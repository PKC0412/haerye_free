/**
 * GrammarData
 * 문법 관련 JSON 데이터 로딩 및 가공을 담당하는 모듈
 */
const GrammarData = {
  categories: [],
  contents: {},           // unitId -> unit data
  examplesByGroup: {},    // groupId -> [examples]
  exampleTranslations: {},// exampleId -> text
  grammarTranslations: {},// unitId -> { title, explanation }

  /**
   * 모든 초기 데이터 로드 (카테고리, 인덱스, 컨텐츠, 예문)
   */
  async loadResources() {
    try {
      // 1. 카테고리 로드
      const categoriesRes = await fetch('data/grammar/grammar_categories.json');
      const categoriesJson = await categoriesRes.json();
      this.categories = categoriesJson.categories || [];

      // 2. 컨텐츠 인덱스 및 파일 로드
      const indexRes = await fetch('data/grammar/grammar_content_index.json');
      const indexJson = await indexRes.json();
      const files = indexJson.files || [];

      // 3. 컨텐츠 블록 병렬 로드
      const allBlocks = await Promise.all(
        files.map((url) =>
          fetch(url)
            .then((r) => r.ok ? r.json() : { units: [] })
            .catch((err) => {
              console.error('[GrammarData] Error loading content:', url, err);
              return { units: [] };
            })
        )
      );

      // 4. 컨텐츠 병합 (contents 맵 구성)
      this.contents = {};
      allBlocks.forEach((block) => {
        (block.units || []).forEach((unit) => {
          if (unit && unit.id) this.contents[unit.id] = unit;
        });
      });

      // 5. 예문 데이터 로드
      this.examplesByGroup = {};
      await this._loadExamples();
      
      console.log('[GrammarData] Resources loaded successfully.');
    } catch (error) {
      console.error('[GrammarData] Fatal error loading resources:', error);
      throw error;
    }
  },

  /**
   * 카테고리별 예문 파일 로드 (내부 함수)
   */
  async _loadExamples() {
    const basePath = 'data/grammar/examples';
    if (!Array.isArray(this.categories)) return;

    const tasks = this.categories.map(async (cat) => {
      const url = `${basePath}/grammar_examples_${cat.id}.json`;
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        (json.examples || []).forEach((ex) => {
          if (ex && ex.groupId) {
            if (!this.examplesByGroup[ex.groupId]) {
              this.examplesByGroup[ex.groupId] = [];
            }
            this.examplesByGroup[ex.groupId].push(ex);
          }
        });
      } catch (e) {
        console.warn(`[GrammarData] Failed to load examples for ${cat.id}`, e);
      }
    });

    await Promise.all(tasks);
  },

  /**
   * 언어별 문법 설명 번역 로드
   */
  async loadGrammarTranslations(lang) {
    if (!lang || lang === 'ko') {
      this.grammarTranslations = {};
      return;
    }
    const path = `locales/${lang}/${lang}_grammar.json`;
    try {
      const res = await fetch(path);
      if (res.ok) {
        const json = await res.json();
        const map = {};
        (json || []).forEach((item) => {
          if (item && item.id) {
            map[item.id] = {
              title: item.title || '',
              explanation: item.explanation || ''
            };
          }
        });
        this.grammarTranslations = map;
      } else {
        this.grammarTranslations = {};
      }
    } catch (e) {
      console.warn('[GrammarData] Translation load error:', e);
      this.grammarTranslations = {};
    }
  },

  /**
   * 언어별 예문 번역 로드
   */
  async loadExampleTranslations(lang) {
    if (!lang || lang === 'ko' || !this.categories.length) {
      this.exampleTranslations = {};
      return;
    }
    
    const baseDir = `locales/${lang}`;
    const map = {};
    const tasks = this.categories.map(async (cat) => {
      const url = `${baseDir}/${lang}_grammar_examples_${cat.id}.json`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const translations = json.translations || {};
          Object.keys(translations).forEach((id) => {
            const t = translations[id];
            if (t && (t.translation || t.text)) {
              map[id] = t.translation || t.text;
            }
          });
        }
      } catch (e) {
        // 특정 카테고리 번역 파일이 없을 수 있음 (무시)
      }
    });

    await Promise.all(tasks);
    this.exampleTranslations = map;
  },

  /**
   * 데이터 접근자 (Getters)
   */
  getCategories() { return this.categories; },
  getContent(unitId) { return this.contents[unitId]; },
  getExamples(groupId) { return this.examplesByGroup[groupId] || []; },
  getGrammarTranslation(unitId) { return this.grammarTranslations[unitId]; },
  getExampleTranslation(exampleId) { return this.exampleTranslations[exampleId]; }
};

// 전역 객체로 노출
window.GrammarData = GrammarData;