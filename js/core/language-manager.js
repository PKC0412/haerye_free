/**
 * LanguageManager
 * 앱의 다국어 지원, 언어 변경 및 관련 UI 업데이트를 담당합니다.
 */
window.LanguageManager = {
  supportedLanguages: ['en', 'zh', 'ja', 'ru', 'es', 'fr', 'it', 'de', 'th', 'pt', 'nl'],
  defaultLanguage: 'ko',

  // modal-renderer.js에서 사용할 언어 목록
  availableLanguages: [
    { code: 'ko', name: '한국어 (Korean)', i18n: null },
    { code: 'en', name: 'English', i18n: 'language.names.en' },
    { code: 'zh', name: '中文', i18n: 'language.names.zh' },
    { code: 'ja', name: '日本語', i18n: 'language.names.ja' },
    { code: 'ru', name: 'Русский', i18n: 'language.names.ru' },
    { code: 'es', name: 'Español', i18n: 'language.names.es' },
    { code: 'fr', name: 'Français', i18n: 'language.names.fr' },
    { code: 'it', name: 'Italiano', i18n: 'language.names.it' },
    { code: 'de', name: 'Deutsch', i18n: 'language.names.de' },
    { code: 'th', name: 'ไทย', i18n: 'language.names.th' },
    { code: 'pt', name: 'Português', i18n: 'language.names.pt' },
    { code: 'nl', name: 'Nederlands', i18n: 'language.names.nl' }
  ],

  init() {
    this.setupLanguageOptions();

    // 초기 언어 로드 (전역 함수로 노출하여 UI Manager 등에서 호출 가능하게 함)
    window.applyLanguage = (lang, isInitialLoad) => this.applyLanguage(lang, isInitialLoad);
  },

  normalizeLanguage(lang) {
    if (!lang || typeof lang !== 'string') return this.defaultLanguage;
    const lower = lang.toLowerCase();
    const base = lower.split('-')[0];

    if (this.supportedLanguages.includes(lower)) return lower;
    if (this.supportedLanguages.includes(base)) return base;
    return this.defaultLanguage;
  },

  async applyLanguage(lang, isInitialLoad = false) {
    const normalized = this.normalizeLanguage(lang);
    if (!window.I18n) return;

    const currentStored = localStorage.getItem('preferredLanguage');

    // 언어가 변경되었고 초기 로드가 아닐 경우 리로드 (UI 전체 갱신)
    if (!isInitialLoad && currentStored !== normalized) {
      localStorage.setItem('preferredLanguage', normalized);
      window.location.reload();
      return;
    }

    try {
      await window.I18n.load(normalized);
      window.I18n.apply();
      document.documentElement.lang = normalized;
      localStorage.setItem('preferredLanguage', normalized);
    } catch (err) {
      console.error('[LanguageManager] Failed to apply language:', err);
    }

    this.updateSelectedLanguageButton(normalized);
  },

  updateSelectedLanguageButton(currentLang) {
    const options = document.querySelectorAll('.language-option');
    options.forEach((btn) => {
      if (btn.dataset.lang === currentLang) btn.classList.add('selected');
      else btn.classList.remove('selected');
    });
  },

  setupLanguageOptions() {
    const options = document.querySelectorAll('.language-option');
    if (options.length === 0) return;

    options.forEach((btn) => {
      // 기존 버튼 교체 (이벤트 중복 방지)
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', () => {
        const selectedLang = newBtn.dataset.lang;
        this.applyLanguage(selectedLang, false);
      });
    });
  }
};
