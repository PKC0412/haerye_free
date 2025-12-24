/**
 * ModalSettingsLogic
 * 설정 모달 내부의 UI(목소리 선택)와 
 * 실제 설정 데이터(Settings 모듈)를 동기화하는 로직 모듈입니다.
 */
window.ModalSettingsLogic = {
  // UI 요소 캐싱
  elements: {
    selVoiceKo: null
  },

  /**
   * 초기화: 설정 UI 요소를 찾고 이벤트를 바인딩합니다.
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    console.log('[ModalSettingsLogic] Initialized');
  },

  cacheElements() {
    this.elements.selVoiceKo = document.getElementById('sel-voice-ko');
  },

  bindEvents() {
    if (!window.Settings) return;
    const el = this.elements;

    // ✅ 모든 언어 목소리 선택
    if (el.selVoiceKo) {
      el.selVoiceKo.addEventListener('change', (e) => {
        const selectedURI = e.target.value;
        const currentPrefs = Settings.get('preferredVoices') || {};
        currentPrefs['ko'] = selectedURI;
        Settings.set('preferredVoices', currentPrefs);

        // 선택 즉시 미리듣기
        if (window.SpeechSynthesisManager && selectedURI) {
          setTimeout(() => {
            // 선택한 음성의 언어 코드 가져오기
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v => v.voiceURI === selectedURI);
            const lang = selectedVoice ? selectedVoice.lang.split('-')[0] : 'ko';

            // 언어별 미리듣기 텍스트
            const previewTexts = {
              'ko': '안녕하세요, 선택하신 목소리로 예시를 들려드립니다.',
              'en': 'Hello, this is a preview of the selected voice.',
              'ja': 'こんにちは、選択した音声のプレビューです。',
              'zh': '您好，这是所选语音的预览。',
              'es': 'Hola, esta es una vista previa de la voz seleccionada.',
              'fr': 'Bonjour, ceci est un aperçu de la voix sélectionnée.',
              'de': 'Hallo, dies ist eine Vorschau der ausgewählten Stimme.'
            };

            const previewText = previewTexts[lang] || previewTexts['en'];
            SpeechSynthesisManager.speak(previewText, lang);
          }, 50);
        }
      });
    }
  },

  updateUI() {
    if (!window.Settings) return;
    const s = Settings.getAll();
    const el = this.elements;

    if (el.selVoiceKo && s.preferredVoices && s.preferredVoices['ko']) {
      el.selVoiceKo.value = s.preferredVoices['ko'];
    }
  },

  /**
   * ✅ 모든 언어의 음성을 언어별 그룹으로 표시
   */
  async loadVoiceOptions(retryCount = 0) {
    const el = this.elements;
    if (!el.selVoiceKo || !window.SpeechSynthesisManager) {
      console.warn('[ModalSettingsLogic] Missing required elements or SpeechSynthesisManager');
      return;
    }

    try {
      const voices = await window.SpeechSynthesisManager.getAvailableVoices();

      // 재시도 로직
      if (voices.length === 0 && retryCount < 5) {
        console.log(`[ModalSettingsLogic] No voices yet, retry ${retryCount + 1}/5`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.loadVoiceOptions(retryCount + 1);
      }

      // 옵션 초기화
      el.selVoiceKo.innerHTML = '<option value="">기본 (Default)</option>';

      if (voices.length === 0) {
        console.warn('[ModalSettingsLogic] No voices found after retries');
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = '음성을 찾을 수 없습니다';
        el.selVoiceKo.appendChild(option);
        return;
      }

      // ✅ 언어별로 그룹핑
      const grouped = {};
      voices.forEach(voice => {
        const langCode = voice.lang.split('-')[0].toLowerCase();
        if (!grouped[langCode]) {
          grouped[langCode] = [];
        }
        grouped[langCode].push(voice);
      });

      // ✅ 언어 이름 매핑
      const languageNames = {
        'ko': '한국어 (Korean)',
        'en': '영어 (English)',
        'ja': '일본어 (Japanese)',
        'zh': '중국어 (Chinese)',
        'es': '스페인어 (Spanish)',
        'fr': '프랑스어 (French)',
        'de': '독일어 (German)',
        'it': '이탈리아어 (Italian)',
        'pt': '포르투갈어 (Portuguese)',
        'ru': '러시아어 (Russian)',
        'ar': '아랍어 (Arabic)',
        'hi': '힌디어 (Hindi)',
        'th': '태국어 (Thai)',
        'vi': '베트남어 (Vietnamese)',
        'id': '인도네시아어 (Indonesian)',
        'tr': '터키어 (Turkish)',
        'pl': '폴란드어 (Polish)',
        'nl': '네덜란드어 (Dutch)',
        'sv': '스웨덴어 (Swedish)',
        'da': '덴마크어 (Danish)',
        'fi': '핀란드어 (Finnish)',
        'no': '노르웨이어 (Norwegian)'
      };

      // ✅ 언어 순서 정렬 (한국어 우선, 그 다음 영어, 나머지는 알파벳순)
      const sortedLangCodes = Object.keys(grouped).sort((a, b) => {
        if (a === 'ko') return -1;
        if (b === 'ko') return 1;
        if (a === 'en') return -1;
        if (b === 'en') return 1;
        return a.localeCompare(b);
      });

      // ✅ optgroup으로 렌더링
      sortedLangCodes.forEach(langCode => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = languageNames[langCode] || `${langCode.toUpperCase()}`;

        // 해당 언어의 음성들 추가
        grouped[langCode].forEach(voice => {
          const option = document.createElement('option');
          option.value = voice.voiceURI;
          option.textContent = voice.name;
          optgroup.appendChild(option);
        });

        el.selVoiceKo.appendChild(optgroup);
      });

      console.log(`[ModalSettingsLogic] Loaded ${voices.length} voices in ${sortedLangCodes.length} languages`);

      // 저장된 설정값 적용
      const s = window.Settings ? window.Settings.getAll() : null;
      if (s && s.preferredVoices && s.preferredVoices['ko']) {
        const exists = voices.some(v => v.voiceURI === s.preferredVoices['ko']);
        if (exists) {
          el.selVoiceKo.value = s.preferredVoices['ko'];
          console.log('[ModalSettingsLogic] Restored preferred voice');
        }
      }
    } catch (err) {
      console.error('[ModalSettingsLogic] Error loading voices:', err);
    }
  }
};
