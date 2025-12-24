// Hangul Learning Module (Global Object)
window.HangulLearning = {
  consonants: [],
  vowels: [],
  finals: [],
  currentIndex: 0,
  mode: 'consonants',
  isInitialized: false,

  async initialize() {
    try {
      await this.loadData();
      this.renderCurrentCharacter();
      this.isInitialized = true;
      console.log('[Hangul] Initialized');
    } catch (error) {
      console.error('[Hangul] Failed to initialize:', error);
    }
  },

  async loadData() {
    try {
      const currentLang = (window.I18n && window.I18n.currentLang) ? window.I18n.currentLang : 'ko';
      
      const getPath = (type) => {
        if (currentLang === 'ko') return `data/${type}.json`;
        return `locales/${currentLang}/${currentLang}_${type}.json`;
      };

      const loadFile = async (type) => {
        const path = getPath(type);
        let res = await fetch(path);
        if (!res.ok) {
            res = await fetch(`data/${type}.json`);
        }
        return await res.json();
      };

      this.consonants = await loadFile('consonants');
      this.vowels = await loadFile('vowels');
      this.finals = await loadFile('finals');

    } catch (error) {
      console.error('[Hangul] Data load failed:', error);
      this.consonants = [{ char: 'ㄱ', name: 'Giyeok', romanization: 'g' }];
      this.vowels = [{ char: 'ㅏ', name: 'A', romanization: 'a' }];
      this.finals = [{ char: 'ㄱ', name: 'giyeok', romanization: 'g' }];
    }
  },

  getCurrentCharacters() {
    switch (this.mode) {
      case 'vowels': return this.vowels;
      case 'finals': return this.finals;
      default: return this.consonants;
    }
  },

  getCurrentCharacter() {
    return this.getCurrentCharacters()[this.currentIndex] || null;
  },

  renderCurrentCharacter() {
    const container = document.getElementById('hangul-container');
    if (!container) return; 

    const character = this.getCurrentCharacter();
    if (!character) {
      container.innerHTML = '<p>No data available.</p>';
      return;
    }

    const getLabel = (key, fallback) => (window.I18n && typeof I18n.t === 'function') ? I18n.t(key) : fallback;

    const modeLabel = this.mode === 'vowels' ? getLabel('모음', '모음') :
                      this.mode === 'finals' ? getLabel('받침', '받침') :
                      getLabel('자음', '자음');

    const lblRoman = getLabel('로마자 표기:', '로마자 표기:');
    const lblHear = getLabel('발음 듣기', '발음 듣기'); 
    const lblPrev = getLabel('이전', '이전');
    const lblNext = getLabel('다음', '다음');
    const lblDesc = getLabel('설명:', '설명:');
    const lblEx = getLabel('예시:', '예시:');

    container.innerHTML = `
      <div class="hangul-tabs">
        <button class="hangul-tab ${this.mode === 'consonants' ? 'active' : ''}" onclick="window.HangulLearning.setMode('consonants')">${getLabel('자음', '자음')}</button>
        <button class="hangul-tab ${this.mode === 'vowels' ? 'active' : ''}" onclick="window.HangulLearning.setMode('vowels')">${getLabel('모음', '모음')}</button>
        <button class="hangul-tab ${this.mode === 'finals' ? 'active' : ''}" onclick="window.HangulLearning.setMode('finals')">${getLabel('받침', '받침')}</button>
      </div>

      <div class="hangul-card">
        <div class="hangul-char">${character.char}</div>
        <div class="hangul-info">
          <div class="hangul-label">${modeLabel} <span class="info-icon" onclick="window.HangulLearning.showInfo()">ⓘ</span></div>
          <div class="hangul-label-text">${character.name}</div>
          <div class="hangul-label">${lblRoman} ${character.romanization}</div>
          <div class="hangul-label">IPA: ${character.ipa || '-'}</div>
        </div>
      </div>

      <div class="hangul-controls">
        <button class="btn-speak" onclick="window.HangulLearning.speak()">🔊 ${lblHear}</button>
      </div>

      <div class="hangul-navigation">
        <button class="btn-prev" onclick="window.HangulLearning.prev()" ${this.currentIndex === 0 ? 'disabled' : ''}>← ${lblPrev}</button>
        <span class="progress-info">${this.currentIndex + 1} / ${this.getCurrentCharacters().length}</span>
        <button class="btn-next" onclick="window.HangulLearning.next()" ${this.currentIndex >= this.getCurrentCharacters().length - 1 ? 'disabled' : ''}>${lblNext} →</button>
      </div>

      <div id="hangulModal" class="modal-overlay" onclick="if(event.target === this) window.HangulLearning.closeInfo()">
        <div class="modal-content">
          <span class="modal-close" onclick="window.HangulLearning.closeInfo()">×</span>
          <div class="modal-header">${character.name}</div>
          <p><strong>${lblDesc}</strong> ${character.description || '-'}</p>
          <p><strong>${lblEx}</strong> ${character.examples || '-'}</p>
        </div>
      </div>
  `;

  // 오늘의 목표 진행률 반영 (중복 카운트는 App 쪽에서 자동 방지)
  if (window.App && typeof window.App.completeLearningItem === 'function') {
    const keyBase = character.id || character.char || null;
    const itemKey = keyBase ? `hangul:${keyBase}` : null;
    window.App.completeLearningItem(itemKey);
  }
},

  setMode(mode) {
    this.mode = mode;
    this.currentIndex = 0;
    this.renderCurrentCharacter();
  },

  next() {
    const characters = this.getCurrentCharacters();
    if (this.currentIndex < characters.length - 1) {
      this.currentIndex++;
      this.renderCurrentCharacter();
    }
  },

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrentCharacter();
    }
  },

  speak() {
    const character = this.getCurrentCharacter();
    // 수정된 부분: window.SpeechSynthesisManager 사용 및 예외 처리
    if (character) {
      if (window.SpeechSynthesisManager && typeof window.SpeechSynthesisManager.speak === 'function') {
        window.SpeechSynthesisManager.speak(character.char);
      } else if ('speechSynthesis' in window) {
        // Fallback if Manager is missing
        const u = new SpeechSynthesisUtterance(character.char);
        u.lang = 'ko-KR';
        window.speechSynthesis.speak(u);
      } else {
        console.warn('TTS not supported.');
      }
    }
  },

  showInfo() { 
      const modal = document.getElementById('hangulModal');
      if(modal) modal.classList.add('active'); 
  },
  
  closeInfo() { 
      const modal = document.getElementById('hangulModal');
      if(modal) modal.classList.remove('active'); 
  }
};