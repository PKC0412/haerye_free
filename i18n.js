const I18n = {
  currentLang: 'ko', // 기본 언어
  dictionary: {},

  /**
   * 깊은 병합 (객체만 재귀 병합)
   * - 배열/문자열 등은 덮어씀
   */
  deepMerge(target, source) {
    if (!target || typeof target !== 'object' || Array.isArray(target)) {
      return source;
    }
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      return source;
    }

    const out = { ...target };

    Object.keys(source).forEach((key) => {
      const srcVal = source[key];
      const tgtVal = out[key];

      const bothObjects =
        tgtVal &&
        srcVal &&
        typeof tgtVal === 'object' &&
        typeof srcVal === 'object' &&
        !Array.isArray(tgtVal) &&
        !Array.isArray(srcVal);

      out[key] = bothObjects ? this.deepMerge(tgtVal, srcVal) : srcVal;
    });

    return out;
  },

  async load(lang) {
    try {
      // 1. 한국어(ko)는 번역 파일을 로드하지 않음 (HTML 기본 텍스트 사용)
      if (lang === 'ko') {
        this.dictionary = {};
        this.currentLang = lang;
        return;
      }

      // 2. 기본 번역 로드: locales/{lang}/{lang}.json
      // 예: locales/en/en.json
      const basePath = `locales/${lang}/${lang}.json`;
      console.log(`[I18n] Loading UI translation from: ${basePath}`);

      const baseRes = await fetch(basePath);
      if (!baseRes.ok) {
        console.warn(`[I18n] Failed to load ${basePath}, status: ${baseRes.status}`);
        this.dictionary = {};
        this.currentLang = lang;
        return;
      }

      const baseDict = await baseRes.json();

      // 3. 추가 번역팩(선택): locales/{lang}/{lang}_home.json
      // - 파일이 없으면(404) 조용히 스킵
      const homePackPath = `locales/${lang}/${lang}_home.json`;
      console.log(`[I18n] Loading optional pack from: ${homePackPath}`);

      let mergedDict = baseDict;

      try {
        const packRes = await fetch(homePackPath);
        if (packRes.ok) {
          const packDict = await packRes.json();
          mergedDict = this.deepMerge(baseDict, packDict);
          console.log(`[I18n] Optional pack merged: ${homePackPath}`);
        } else if (packRes.status !== 404) {
          console.warn(`[I18n] Failed to load ${homePackPath}, status: ${packRes.status}`);
        }
      } catch (packErr) {
        // 네트워크/파싱 오류 등은 앱 실행을 막지 않도록 조용히 처리
        console.warn('[I18n] Optional pack error:', packErr);
      }

      this.dictionary = mergedDict;
      this.currentLang = lang;
      console.log(`[I18n] Loaded successfully: ${lang}`);
    } catch (e) {
      console.error('[I18n] Error:', e);
      this.dictionary = {};
      this.currentLang = lang;
    }
  },

  t(key) {
    // 키 탐색 로직 (점 표기법 지원, 예: menu.help)
    const parts = key.split('.');
    let cur = this.dictionary;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p];
      } else {
        return key; // 찾지 못하면 키 자체 반환
      }
    }
    return typeof cur === 'string' ? cur : key;
  },

  apply() {
    // DOM 업데이트
    document.querySelectorAll('[data-i18n]').forEach((elem) => {
      const key = elem.getAttribute('data-i18n');
      const value = this.t(key);

      if (value && value !== key) {
        if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
          if (elem.hasAttribute('placeholder')) elem.placeholder = value;
        } else {
          elem.textContent = value;
        }
      }
    });

    // 언어 변경 이벤트 전파 (다른 모듈들이 감지하도록)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
  }
};

window.I18n = I18n;
