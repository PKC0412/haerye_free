// Speech Synthesis Manager for Korean Learning (Enhanced v2.1)
// ✅ 개선: 재생 중 중복 호출 완전 차단으로 iOS 경고 모달 방지

const SpeechSynthesisManager = {
  synth: window.speechSynthesis,
  voices: [],
  isInitialized: false,
  isInitializing: false,
  voicesLoadedPromise: null,
  voicesLoadedResolve: null,

  // ✅ 추가: 재생 중 플래그
  isSpeaking: false,

  _pendingSpeakTimerId: null,
  _lastSpeakAtMs: 0,
  _lastSpeakText: '',
  _lastSpeakLang: '',
  _lastPerformSpeakAtMs: 0,
  _lastPerformSpeakText: '',
  _lastPerformSpeakLang: '',
  _speakRequestSeq: 0,

  hasWarnedNoVoice: {},

  initialize() {
    if (this.isInitialized) return Promise.resolve();
    if (this.isInitializing) return this.voicesLoadedPromise;

    this.isInitializing = true;

    this.voicesLoadedPromise = new Promise(resolve => {
      this.voicesLoadedResolve = resolve;
    });

    if (!this.synth) {
      console.warn('[Speech] TTS not supported.');
      if (window.showTtsWarningModal) window.showTtsWarningModal();
      this.isInitialized = true;
      this.isInitializing = false;
      this.voicesLoadedResolve();
      return Promise.resolve();
    }

    this.loadVoices();

    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        console.log('[Speech] Voices changed event triggered');
        this.loadVoices();

        window.dispatchEvent(new CustomEvent('voicesLoaded', {
          detail: { voices: this.voices }
        }));

        if (this.voicesLoadedResolve) {
          this.voicesLoadedResolve();
        }
      };
    }

    setTimeout(() => {
      if (this.voices.length === 0) {
        console.warn('[Speech] No voices loaded yet, retrying...');
        this.loadVoices();
      }

      this.isInitialized = true;
      this.isInitializing = false;

      if (this.voicesLoadedResolve) {
        this.voicesLoadedResolve();
      }
    }, 500);

    return this.voicesLoadedPromise;
  },

  loadVoices() {
    if (!this.synth) return;

    const loadedVoices = this.synth.getVoices() || [];

    const uniqueVoices = [];
    const seenURIs = new Set();

    loadedVoices.forEach(v => {
      if (v.name && v.lang && !seenURIs.has(v.voiceURI)) {
        uniqueVoices.push(v);
        seenURIs.add(v.voiceURI);
      }
    });

    this.voices = uniqueVoices;

    if (this.voices.length > 0) {
      console.log(`[Speech] Loaded ${this.voices.length} unique voices.`);
    }
  },

  async waitForVoices() {
    if (this.voices.length > 0) return;

    if (!this.voicesLoadedPromise) {
      this.voicesLoadedPromise = new Promise(resolve => {
        this.voicesLoadedResolve = resolve;
      });
    }

    await this.voicesLoadedPromise;
  },

  /**
   * ✅ 개선: 재생 중이면 즉시 리턴하여 중복 호출 완전 차단
   */
  async speak(text, lang = 'ko') {
    if (!text) return;

    // ✅ 핵심: 이미 재생 중이면 무시
    if (this.isSpeaking) {
      console.log('[Speech] Already speaking, ignoring duplicate call');
      return;
    }

    const nowMs = Date.now();
    const trimmedText = String(text).trim();
    const normalizedLang = String(lang || 'ko');

    if (
      trimmedText === this._lastSpeakText &&
      normalizedLang === this._lastSpeakLang &&
      (nowMs - this._lastSpeakAtMs) < 250
    ) {
      return;
    }

    this._lastSpeakAtMs = nowMs;
    this._lastSpeakText = trimmedText;
    this._lastSpeakLang = normalizedLang;

    this._speakRequestSeq += 1;
    const currentSeq = this._speakRequestSeq;

    if (this._pendingSpeakTimerId) {
      clearTimeout(this._pendingSpeakTimerId);
      this._pendingSpeakTimerId = null;
    }

    if (!this.isInitialized) {
      this.initialize().then(() => {
        if (currentSeq === this._speakRequestSeq) {
          this._performSpeak(trimmedText, normalizedLang);
        }
      });
      return;
    }

    this._pendingSpeakTimerId = setTimeout(() => {
      if (currentSeq !== this._speakRequestSeq) return;
      this._performSpeak(trimmedText, normalizedLang);
    }, 120);
  },

  async _performSpeak(text, lang = 'ko') {
    if (!this.synth) {
      if (!this.hasWarnedNoVoice[lang] && window.showTtsWarningModal) {
        window.showTtsWarningModal();
        this.hasWarnedNoVoice[lang] = true;
      }
      return;
    }

    // ✅ 재생 중이면 무시
    if (this.isSpeaking) {
      console.log('[Speech] Already speaking in _performSpeak, ignoring');
      return;
    }

    const nowMs = Date.now();
    const isSamePerformRequest = (text === this._lastPerformSpeakText) && (lang === this._lastPerformSpeakLang);
    if (isSamePerformRequest && (nowMs - this._lastPerformSpeakAtMs) < 250) {
      return;
    }

    this._lastPerformSpeakAtMs = nowMs;
    this._lastPerformSpeakText = text;
    this._lastPerformSpeakLang = lang;
    this._lastSpeakAtMs = nowMs;
    this._lastSpeakText = text;
    this._lastSpeakLang = lang;

    this._speakRequestSeq += 1;
    const currentSeq = this._speakRequestSeq;
    if (this._pendingSpeakTimerId) {
      clearTimeout(this._pendingSpeakTimerId);
      this._pendingSpeakTimerId = null;
    }

    await this.waitForVoices();

    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const settings = (window.Settings && window.Settings.getAll) 
                     ? window.Settings.getAll() 
                     : { speechRate: 1.0, speechPitch: 1.0, speechVolume: 1.0, preferredVoices: {} };

    utterance.rate = Math.max(0.1, Math.min(2.0, settings.speechRate || 1.0));
    utterance.pitch = Math.max(0.1, Math.min(2.0, settings.speechPitch || 1.0));
    utterance.volume = Math.max(0, Math.min(1, settings.speechVolume || 1.0));

    let targetVoice = null;

    const normalizedLang = (lang || '')
      .toString()
      .replace('_', '-');
    const normalizedLangLower = normalizedLang.toLowerCase();
    const baseLangLower = normalizedLangLower.split('-')[0];

    const preferredVoiceURI = (settings.preferredVoices)
      ? (settings.preferredVoices[normalizedLang]
        ?? settings.preferredVoices[normalizedLangLower]
        ?? settings.preferredVoices[baseLangLower]
        ?? null)
      : null;

    if (preferredVoiceURI && preferredVoiceURI !== "") {
      targetVoice = this.voices.find(v => v.voiceURI === preferredVoiceURI);
      if (targetVoice) {
        console.log(`[Speech] Using preferred voice: ${targetVoice.name}`);
      }
    }

    if (!targetVoice) {
      targetVoice = this.voices.find(v => v.lang.replace('_', '-').toLowerCase() === normalizedLangLower) || 
                    this.voices.find(v => v.lang.toLowerCase().startsWith(baseLangLower));

      if (targetVoice) {
        console.log(`[Speech] Using auto-selected voice: ${targetVoice.name}`);
      }
    }

    if (targetVoice) {
      utterance.voice = targetVoice;
      utterance.lang = targetVoice.lang;
    } else {
      utterance.lang = normalizedLang;
      console.warn(`[Speech] No voice found for language: ${lang}`);
    }

    // ✅ 개선: 에러 핸들러
    utterance.onerror = (event) => {
      // ✅ 재생 중 플래그 해제
      this.isSpeaking = false;

      if (event.error === 'interrupted') {
        console.log('[Speech] Interrupted (normal cancellation)');
        return;
      }

      console.error('[Speech] Utterance error:', {
        error: event.error,
        text: text.substring(0, 50),
        lang: lang
      });

      // 경고 모달은 표시하지 않음 (사용자 경험 개선)
      console.warn('[Speech] Error occurred but not showing modal to user');
    };

    // ✅ 개선: 완료 핸들러
    utterance.onend = () => {
      console.log('[Speech] Utterance ended');
      this.isSpeaking = false; // 재생 완료

      window.dispatchEvent(new CustomEvent('speechEnded', {
        detail: { text: text.substring(0, 50), lang: lang }
      }));
    };

    // ✅ 개선: 시작 핸들러
    utterance.onstart = () => {
      console.log('[Speech] Utterance started');
      this.isSpeaking = true; // 재생 시작

      window.dispatchEvent(new CustomEvent('speechStarted', {
        detail: { text: text.substring(0, 50), lang: lang }
      }));
    };

    try {
      this.synth.cancel();
    } catch (e) {
      console.warn('[Speech] cancel() failed:', e);
    }

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('[Speech] speak() failed:', e);
      this.isSpeaking = false; // 실패 시 플래그 해제
    }
  },

  stop() {
    if (this.synth) {
      if (this._pendingSpeakTimerId) {
        clearTimeout(this._pendingSpeakTimerId);
        this._pendingSpeakTimerId = null;
      }
      this.synth.cancel();
      this.isSpeaking = false; // 중지 시 플래그 해제
      window.dispatchEvent(new CustomEvent('speechStopped'));
    }
  },

  async getAvailableVoices() {
    await this.waitForVoices();

    if (this.voices.length === 0) {
      this.loadVoices();
    }

    return this.voices;
  },

  getVoicesForLanguage(lang) {
    return this.voices.filter(v => {
      if (!v.lang) return false;
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === lang || vLang.startsWith(lang.toLowerCase());
    });
  }
};

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    SpeechSynthesisManager.initialize();
  });
} else {
  SpeechSynthesisManager.initialize();
}

window.SpeechSynthesisManager = SpeechSynthesisManager;
