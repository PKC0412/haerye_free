/**
 * GrammarView
 * 문법 UI의 HTML 생성 및 DOM 조작을 담당하는 모듈
 */
const GrammarView = {
  container: null,
  sidebarEl: null,
  contentEl: null,

  /**
   * 초기 레이아웃 설정
   */
  init(containerElement) {
    if (!containerElement) {
      console.error('[GrammarView] No container element provided.');
      return;
    }
    this.container = containerElement;
    this.container.innerHTML = '';

    const layout = document.createElement('div');
    layout.className = 'grammar-layout';

    // 1. Sidebar (Accordion)
    const sidebar = document.createElement('div');
    sidebar.className = 'grammar-sidebar';

    // 2. Content Area
    const contentArea = document.createElement('div');
    contentArea.className = 'grammar-content-area';

    layout.appendChild(sidebar);
    layout.appendChild(contentArea);
    this.container.appendChild(layout);

    this.sidebarEl = sidebar;
    this.contentEl = contentArea;
  },

  /**
   * 사이드바(카테고리/그룹 아코디언) 렌더링
   * @param {Array} categories - 카테고리 데이터 목록
   * @param {Object} state - 현재 확장/선택 상태 (expandedCategories, expandedGroups 등)
   * @param {Object} handlers - 클릭 이벤트 핸들러 모음
   * @param {string} currentLang - 현재 언어 코드
   */
  renderSidebar(categories, state, handlers, currentLang) {
    if (!this.sidebarEl) return;

    // [수정] 재렌더링 시 스크롤 위치가 튀지 않도록 현재 위치 저장
    const previousScrollTop = this.sidebarEl.scrollTop;

    this.sidebarEl.innerHTML = '';

    if (!categories.length) {
      this.sidebarEl.innerHTML = '<div class="grammar-empty">No categories loaded.</div>';
      return;
    }

    // [추가] 현재 선택된 유닛이 속한 카테고리와 그룹 찾기
    let activeCategoryId = null;
    let activeGroupId = null;

    if (state.selectedUnitId) {
      for (const cat of categories) {
        if (cat.groups && cat.groups.length > 0) {
          for (const grp of cat.groups) {
            if (grp.unitIds && grp.unitIds.includes(state.selectedUnitId)) {
              activeCategoryId = cat.id;
              activeGroupId = grp.id;
              break;
            }
          }
        }
        if (activeCategoryId) break;
      }
    }

    console.log('[GrammarView] Active Category:', activeCategoryId, 'Active Group:', activeGroupId);

    categories.forEach(cat => {
      // Category Wrapper
      const catEl = document.createElement('div');
      catEl.className = 'acc-category';

      // Category Header
      const header = document.createElement('div');
      const isCatExpanded = state.expandedCategories.has(cat.id);
      const isCatActive = (cat.id === activeCategoryId);

      // [수정] active 클래스 명확하게 추가
      let headerClasses = 'acc-header';
      if (isCatExpanded) headerClasses += ' expanded';
      if (isCatActive) headerClasses += ' active';
      header.className = headerClasses;

      // I18n Label
      let catLabel = cat.label || cat.id;
      if (currentLang !== 'ko' && window.I18n) {
        const key = 'grammar_category_' + cat.id;
        const tr = window.I18n.t(key);
        if (tr && tr !== key) catLabel = tr;
      }

      header.innerHTML = `
        <div class="acc-title-wrap">
          <span>📚</span>
          <span>${catLabel}</span>
        </div>
        <span class="acc-icon">▼</span>
      `;
      header.onclick = () => handlers.onToggleCategory(cat.id);

      // Category Body (Groups)
      const body = document.createElement('div');
      body.className = `acc-body ${isCatExpanded ? 'show' : ''}`;

      if (cat.groups && cat.groups.length > 0) {
        cat.groups.forEach(group => {
          // Group Wrapper
          const groupEl = document.createElement('div');
          groupEl.className = 'acc-group';

          // Group Header
          const grpHeader = document.createElement('div');
          const isGrpExpanded = state.expandedGroups.has(group.id);
          const isGrpActive = (group.id === activeGroupId); // [추가] 그룹 활성 상태

          // [추가] 그룹에도 active 클래스 추가
          let grpHeaderClasses = 'acc-group-header';
          if (isGrpActive) grpHeaderClasses += ' active';
          grpHeader.className = grpHeaderClasses;

          // I18n Label
          let grpLabel = group.label || group.id;
          if (currentLang !== 'ko' && window.I18n) {
            const key = 'grammar_group_' + group.id;
            const tr = window.I18n.t(key);
            if (tr && tr !== key) grpLabel = tr;
          }

          // Folder Icon
          const folderIcon = '📝';

          grpHeader.innerHTML = `
            <span>${folderIcon}</span>
            <span>${grpLabel}</span>
          `;

          // Group click selects the first unit
          grpHeader.onclick = (e) => {
            e.stopPropagation();
            if (group.unitIds && group.unitIds.length > 0) {
              handlers.onSelectUnit(group.unitIds[0]);

              // [추가] 모바일 환경에서 유닛(그룹 헤더) 클릭 시 본문 영역으로 스크롤 이동
              if (window.innerWidth < 768 && this.contentEl) {
                setTimeout(() => {
                  this.contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }
            }
          };

          // Group Body (Units - currently hidden/not used as list items per design)
          const grpBody = document.createElement('div');
          grpBody.className = `acc-group-body ${isGrpExpanded ? 'show' : ''}`;

          if (!group.unitIds || group.unitIds.length === 0) {
            grpBody.innerHTML = '<div style="padding:0.5rem 1rem; color:#999; font-size:0.8rem;">(No units)</div>';
          }

          groupEl.appendChild(grpHeader);
          groupEl.appendChild(grpBody);
          body.appendChild(groupEl);
        });
      } else {
        body.innerHTML = '<div style="padding:1rem; color:#999;">No content available.</div>';
      }

      catEl.appendChild(header);
      catEl.appendChild(body);
      this.sidebarEl.appendChild(catEl);
    });

    // [수정] 렌더링 완료 후 스크롤 위치 복구
    this.sidebarEl.scrollTop = previousScrollTop;
  },

  /**
   * 본문 컨텐츠(설명 및 예문) 렌더링
   * @param {Object} unit - 선택된 유닛 데이터
   * @param {Array} examples - 해당 유닛의 예문 목록
   * @param {Object} translations - 번역 데이터 { unitTitle, unitDesc, exMap }
   * @param {Object} handlers - 이벤트 핸들러
   */
  renderContent(unit, examples, translations, handlers) {
    if (!this.contentEl) return;
    this.contentEl.innerHTML = '';

    if (!unit) {
      this.contentEl.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-tertiary);">
          <div style="font-size:3rem; margin-bottom:1rem;">👈</div>
          <p>왼쪽 메뉴에서 학습할 내용을 선택해주세요.</p>
        </div>
      `;
      return;
    }

    // 1. Header (Title & Description)
    const titleText = translations.unitTitle || unit.title;
    const descText = translations.unitDesc || unit.description;

    const header = document.createElement('div');
    header.className = 'grammar-detail-header';
    header.innerHTML = `
      <h2 class="grammar-detail-title">
        <span>📌</span> ${titleText}
      </h2>
      <div class="grammar-detail-description">${descText || '설명이 없습니다.'}</div>
    `;
    this.contentEl.appendChild(header);

    // 2. Examples List
    if (!examples || examples.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'grammar-empty';
      empty.textContent = '예문이 아직 준비되지 않았습니다.';
      this.contentEl.appendChild(empty);
      return;
    }

    const list = document.createElement('div');
    list.className = 'grammar-examples-list';

    examples.forEach(ex => {
      const row = document.createElement('div');
      row.className = 'grammar-example';

      const translation = translations.exMap[ex.id] || '';

      row.innerHTML = `
        <div class="grammar-example-text">
          <div class="grammar-example-korean">${ex.korean}</div>
          <div class="grammar-example-romanization">${ex.romanization || ''}</div>
          <div class="grammar-example-ipa">${ex.ipa || ''}</div>
          ${translation ? `<div class="grammar-example-translation">${translation}</div>` : ''}
        </div>
        <button class="grammar-example-speak" aria-label="Listen">🔊</button>
      `;

      // Bind Speak Event
      const btn = row.querySelector('.grammar-example-speak');
      btn.addEventListener('click', () => handlers.onSpeak(ex.korean));

      list.appendChild(row);
    });

    this.contentEl.appendChild(list);
    // this.contentEl.scrollTop = 0; // Removed auto-scroll on content load
  },

  renderError(msg) {
    if (this.container) {
      this.container.innerHTML = `<div class="grammar-error">⚠️ ${msg}</div>`;
    }
  }
};

// 전역 객체로 노출
window.GrammarView = GrammarView;