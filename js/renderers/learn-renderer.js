window.LearnRenderer = {
  render(containerId = 'learn-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`[LearnRenderer] Container #${containerId} not found.`);
        return;
    }

    container.innerHTML = `
      <nav class="menu-container">
          <div class="section-title-wrapper">
              <h2 class="home-section-title" data-i18n="home.menu.study_menu_title">학습 메뉴</h2>
          </div>

          <div class="menu-grid">
              <button class="menu-card card-red" id="btn-hangul">
                  <div class="card-icon-wrapper">
                      <span class="card-text-icon">가</span>
                  </div>
                  <div class="card-content">
                      <h3 class="card-title" data-i18n="menu.hangul">한글 배우기</h3>
                      <p class="card-desc" data-i18n="home.menu.hangul_desc">기초 자모음</p>
                  </div>
                  <div class="card-deco"></div>
              </button>

              <button class="menu-card card-blue" id="btn-vocabulary">
                  <div class="card-icon-wrapper">
                      <i class="ph-fill ph-book-bookmark"></i>
                  </div>
                  <div class="card-content">
                      <h3 class="card-title" data-i18n="menu.vocabulary">단어장</h3>
                      <p class="card-desc" data-i18n="home.menu.vocab_desc">필수 어휘</p>
                  </div>
                  <div class="card-deco"></div>
              </button>

              <button class="menu-card card-yellow" id="btn-flashcard">
                  <div class="card-icon-wrapper">
                      <i class="ph-fill ph-cards"></i>
                  </div>
                  <div class="card-content">
                      <h3 class="card-title" data-i18n="menu.flashcard">플래시카드</h3>
                      <p class="card-desc" data-i18n="home.menu.flashcard_desc">복습 하기</p>
                  </div>
                  <div class="card-deco"></div>
              </button>

              <button class="menu-card card-indigo" id="btn-grammar">
                  <div class="card-icon-wrapper">
                      <i class="ph-fill ph-student"></i>
                  </div>
                  <div class="card-content">
                      <h3 class="card-title" data-i18n="menu.grammar">문법</h3>
                      <p class="card-desc" data-i18n="home.menu.grammar_desc">문장 구조</p>
                  </div>
                  <div class="card-deco"></div>
              </button>
          </div>

          <div class="wide-card">
               <div class="wide-card-content">
                  <div class="tags">
                      <span class="tag new" data-i18n="home.wide_card.new">NEW</span>
                      <span class="tag topic" data-i18n="home.wide_card.topic">생활 회화</span>
                  </div>
                  <h3 class="wide-card-title" data-i18n="home.wide_card.title">기본 인사말 배우기</h3>
                  <p class="wide-card-desc" data-i18n="home.wide_card.desc">한국어의 시작, 인사부터!</p>
               </div>
               <div class="wide-card-icon">
                  <i class="ph-fill ph-caret-right"></i>
               </div>
               <div class="wide-card-bg-gradient"></div>
          </div>
      </nav>
    `;
    console.log('[LearnRenderer] Rendered.');
  }
};
