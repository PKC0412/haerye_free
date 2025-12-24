// Header Renderer - View & Language Toggle
(function(global) {
  const HeaderRenderer = global.HeaderRenderer || (global.HeaderRenderer = {});

  HeaderRenderer.render = function(containerId = 'header-container') {

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[HeaderRenderer] Container #${containerId} not found.`);
            return;
        }

        // 1. 초기 데이터 가져오기
        const data = (window.App && window.App.getSummaryData) 
                     ? window.App.getSummaryData() 
                     : { percent: 0, streak: 0 };

        // 원형 차트 계산
        const radius = 20;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (data.percent / 100) * circumference;

        // 2. 테마 아이콘 설정
        const savedTheme = localStorage.getItem('app-theme-preference');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        const initialThemeIcon = isDark ? '🌞' : '🌙';

        // 3. 현재 언어 확인
        const currentLang = (window.I18n && window.I18n.currentLang) ? window.I18n.currentLang : 'ko';
        const initialLangIcon = this.flags[currentLang] || '<i class="ph ph-globe"></i>';

        // 4. HTML 렌더링
        container.innerHTML = `
          <header class="app-header">
              <div class="header-bg-pattern"></div>
              <div class="header-deco-circle red"></div>
              <div class="header-deco-circle blue"></div>

              <div class="header-content">
                  <div class="header-top">
                      <div class="header-logo">
                          <svg viewBox="0 0 280 60" style="height: 40px; width: auto;">
                              <g transform="translate(-15, -5) scale(0.325)">
                                  <circle cx="100" cy="50" r="20" fill="#EC4899" />
                                  <rect class="logo-mark-line" x="50" y="80" width="100" height="15" rx="7.5" fill="white"/>
                                  <circle cx="100" cy="140" r="45" stroke="#6366F1" stroke-width="15" fill="none" />
                                  <circle cx="145" cy="170" r="10" fill="#22D3EE" />
                              </g>
                              <text x="50" y="50" font-family="Noto Sans KR, sans-serif" font-weight="900" font-size="35" fill="currentColor">해례</text>
                              <text x="130" y="50" font-family="Noto Sans KR, sans-serif" font-weight="300" font-size="35" fill="currentColor" opacity="0.6">Haerye</text>
                          </svg>
                      </div>
                      <div class="header-text">
                          <p class="sub-title">PKC Korean Learning</p>
                      </div>
                      <div class="header-actions">
                          <button id="language-btn" class="icon-btn" aria-label="Select language">
                              ${initialLangIcon}
                          </button>
                          <button id="theme-toggle" class="icon-btn" aria-label="Toggle theme">
                              <span class="theme-icon">${initialThemeIcon}</span>
                          </button>
                           <button id="help-btn" class="icon-btn" aria-label="Help">
                              <i class="ph ph-question"></i>
                          </button>
                      </div>
                  </div>

                  <!-- Progress Card (Mobile) -->
                  <div class="progress-summary-card">
                      <div class="progress-circle-wrapper">
                          <svg class="progress-ring" width="48" height="48">
                              <circle class="progress-ring__circle-bg" stroke="rgba(255,255,255,0.2)" stroke-width="4" fill="transparent" r="${radius}" cx="24" cy="24"/>
                              <circle id="mobile-progress-circle" class="progress-ring__circle" stroke="#D9A62E" stroke-width="4" fill="transparent" r="${radius}" cx="24" cy="24" 
                                      stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                          </svg>
                          <span id="mobile-progress-text" class="progress-text">${data.percent}%</span>
                      </div>
                      <div class="progress-info">
                          <p class="progress-label" data-i18n="nav.goal">오늘의 목표</p>
                          <p id="mobile-streak-text" class="progress-sub">
                            <span data-i18n="nav.streak">연속 학습</span> ${data.streak}<span data-i18n="nav.day_suffix">일째</span> 🔥
                          </p>
                      </div>
                      <button class="continue-btn" onclick="window.App && window.App.showSection('vocabulary-section')" data-i18n="nav.continue">이어하기</button>
                  </div>
              </div>
          </header>
        `;

        // 5. 데이터 업데이트 리스너 등록
        window.addEventListener('progressUpdated', (e) => {
            this.updateUI(e.detail);
        });

        // 6. 언어 변경 리스너 등록
        window.addEventListener('languageChanged', (e) => {
            this.updateLanguageIcon(e.detail.lang);
            // 언어가 변경되면 updateUI도 호출하여 텍스트 강제 갱신
            if (window.App && window.App.getSummaryData) {
                this.updateUI(window.App.getSummaryData());
            }
        });

        console.log('[HeaderRenderer] Rendered.');
  };

  HeaderRenderer.updateLanguageIcon = function(langCode) {

          const btn = document.getElementById('language-btn');
          if (btn) {
              const newIcon = this.flags[langCode] || '<i class="ph ph-globe"></i>';
              btn.innerHTML = newIcon;
          }
  };

})(window);
