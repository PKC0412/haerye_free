/**
 * GrammarUI
 * GrammarData와 GrammarView를 연결하고 사용자 인터랙션을 관리하는 컨트롤러
 */
const GrammarUI = {
  initialized: false,
  currentLang: 'ko',

  // UI 상태 관리
  state: {
    selectedUnitId: null,
    expandedCategories: new Set(), // Set of Category IDs
    expandedGroups: new Set()      // Set of Group IDs
  },

  /**
   * 초기화: 데이터 로드 -> 언어 설정 -> 초기 선택 -> 렌더링
   */
  async initialize() {
    if (this.initialized) {
      this.render();
      return;
    }

    const container = document.getElementById('grammar-container');
    if (!container) {
      console.warn('[GrammarUI] #grammar-container not found');
      return;
    }

    try {
      // 1. 뷰 초기화 (레이아웃 생성)
      GrammarView.init(container);

      // 2. 데이터 로드 (Data 모듈 위임)
      if (window.GrammarData) {
        await GrammarData.loadResources();
      } else {
        throw new Error('GrammarData module not found.');
      }

      // 3. 언어 설정 적용
      const lang = (window.I18n && window.I18n.currentLang) || 'ko';
      await this.updateLanguage(lang);

      // 4. 초기 선택 (첫 번째 항목 자동 선택)
      this.ensureInitialSelection();

      // 5. 최초 렌더링
      this.render();
      this.initialized = true;

      // 6. 언어 변경 이벤트 리스너
      window.addEventListener('languageChanged', (event) => {
        const nextLang = (event && event.detail && event.detail.lang) || 'ko';
        this.updateLanguage(nextLang);
      });

    } catch (e) {
      console.error('[GrammarUI] Initialization error:', e);
      GrammarView.renderError('문법 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  },

  /**
   * 언어 변경 처리
   */
  async updateLanguage(lang) {
    this.currentLang = lang || 'ko';
    if (window.GrammarData) {
      await GrammarData.loadGrammarTranslations(this.currentLang);
      await GrammarData.loadExampleTranslations(this.currentLang);
    }
    if (this.initialized) {
      this.render();
    }
  },

  /**
   * 초기 실행 시 첫 번째 유닛 자동 선택 및 확장
   */
  ensureInitialSelection() {
    const categories = GrammarData.getCategories();
    if (!categories.length) return;

    // 첫 번째 유효한 그룹과 유닛 찾기
    for (const cat of categories) {
      if (cat.groups && cat.groups.length > 0) {
        const firstGroup = cat.groups[0];
        if (firstGroup.unitIds && firstGroup.unitIds.length > 0) {
          const firstUnitId = firstGroup.unitIds[0];

          this.state.selectedUnitId = firstUnitId;
          this.state.expandedCategories.add(cat.id);
          this.state.expandedGroups.add(firstGroup.id);
          return;
        }
      }
    }
  },

  /**
   * 카테고리 토글 핸들러
   */
  toggleCategory(catId) {
    if (this.state.expandedCategories.has(catId)) {
      this.state.expandedCategories.delete(catId);
    } else {
      this.state.expandedCategories.add(catId);

      // 카테고리 확장 시 첫 번째 그룹 자동 선택 로직
      const categories = GrammarData.getCategories();
      const category = categories.find(c => c.id === catId);

      if (category && category.groups && category.groups.length > 0) {
        const firstGroup = category.groups[0];
        this.state.expandedGroups.add(firstGroup.id);

        if (firstGroup.unitIds && firstGroup.unitIds.length > 0) {
          this.selectUnit(firstGroup.unitIds[0]);
          return; // selectUnit에서 렌더링 호출하므로 여기서 리턴
        }
      }
    }
    this.render(); // 사이드바 상태 업데이트를 위해 전체 렌더링
  },

  /**
   * 유닛 선택 핸들러
   * 유닛을 선택(학습)할 때마다 '오늘의 목표' 진행률을 업데이트합니다.
   * (동일 유닛을 여러 번 클릭해도 App 쪽에서 중복 카운트는 막습니다.)
   */
  selectUnit(unitId) {
    this.state.selectedUnitId = unitId;

    // 부모 카테고리 및 그룹 자동 확장 (프로그래매틱 선택 시 필요)
    const categories = GrammarData.getCategories();
    for (const cat of categories) {
      for (const grp of (cat.groups || [])) {
        if (grp.unitIds && grp.unitIds.includes(unitId)) {
          this.state.expandedCategories.add(cat.id);
          this.state.expandedGroups.add(grp.id);
        }
      }
    }

    // 문법 마스터리 기록
    if (window.GrammarMasteryManager && typeof window.GrammarMasteryManager.recordUnitStudy === 'function') {
      const categories = GrammarData.getCategories();
      let categoryId = null;
      let categoryLabel = null;
      for (const cat of categories) {
        for (const grp of (cat.groups || [])) {
          if (grp.unitIds && grp.unitIds.includes(unitId)) {
            categoryId = cat.id;
            categoryLabel = cat.label || cat.id;
            break;
          }
        }
        if (categoryId) break;
      }
      if (categoryId) {
        window.GrammarMasteryManager.recordUnitStudy(unitId, categoryId, categoryLabel);
      }
    }

    // 앱 진행률 업데이트 호출
    // 문법 유닛마다 고유 키를 만들어 전달 → 중복 클릭 방지
    if (window.App && typeof window.App.completeLearningItem === 'function') {
      const itemKey = unitId ? `grammar:${unitId}` : null;
      window.App.completeLearningItem(itemKey);
    }

    this.render();
  },

  /**
   * TTS 음성 재생 핸들러
   */
  speakText(text) {
    if (!text) return;
    if (window.SpeechSynthesisManager && typeof window.SpeechSynthesisManager.speak === 'function') {
      window.SpeechSynthesisManager.speak(text); 
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  },

  /**
   * 전체 화면 렌더링 (View 모듈 호출)
   */
  render() {
    const categories = GrammarData.getCategories();

    // 이벤트 핸들러 래핑
    const handlers = {
      onToggleCategory: (id) => this.toggleCategory(id),
      onSelectUnit: (id) => this.selectUnit(id),
      onSpeak: (text) => this.speakText(text)
    };

    // 1. 사이드바 렌더링
    GrammarView.renderSidebar(categories, this.state, handlers, this.currentLang);

    // 2. 본문 컨텐츠 준비 및 렌더링
    const unitId = this.state.selectedUnitId;
    const unit = GrammarData.getContent(unitId);

    // 번역 데이터 준비
    let transData = { unitTitle: null, unitDesc: null, exMap: {} };
    if (unit && this.currentLang !== 'ko') {
      const gTrans = GrammarData.getGrammarTranslation(unitId);
      if (gTrans) {
        transData.unitTitle = gTrans.title;
        transData.unitDesc = gTrans.explanation;
      }
    }

    // 예문 및 예문 번역 준비
    let examples = [];
    if (unit) {
      // 해당 unit이 속한 그룹 찾기 (예문은 그룹 단위로 로드됨)
      let groupId = null;
      for (const cat of categories) {
        for (const grp of cat.groups || []) {
          if (grp.unitIds && grp.unitIds.includes(unitId)) {
            groupId = grp.id;
            break;
          }
        }
        if (groupId) break;
      }

      examples = GrammarData.getExamples(groupId);

      // 예문 번역 매핑
      examples.forEach(ex => {
        const t = GrammarData.getExampleTranslation(ex.id);
        if (t) transData.exMap[ex.id] = t;
      });
    }

    GrammarView.renderContent(unit, examples, transData, handlers);
  }
};

// 전역 노출
window.GrammarUI = GrammarUI;