window.NavRenderer = {
    render(containerId = 'nav-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[NavRenderer] Container #${containerId} not found.`);
            return;
        }

        // 1. 초기 데이터 가져오기
        const data = (window.App && window.App.getSummaryData)
            ? window.App.getSummaryData()
            : { percent: 0, streak: 0 };

        container.outerHTML = `
            <nav class="bottom-nav">
                <ul class="nav-list">
                    <!-- 홈 -->
                    <li class="nav-item active" data-nav="home" onclick="if(window.NavRenderer) window.NavRenderer.setActive('home'); if(window.showHomeMain) window.showHomeMain();">
                        <i class="ph-fill ph-house"></i>
                        <span data-i18n="nav.home">홈</span>
                    </li>

                    <!-- 학습 -->
                    <li class="nav-item" data-nav="learn" onclick="if(window.NavRenderer) window.NavRenderer.setActive('learn'); if(window.showLearn) window.showLearn();">
                        <i class="ph ph-book-open"></i>
                        <span data-i18n="nav.learn">학습</span>
                    </li>

                    <!-- 설정 -->
                    <li class="nav-item" data-nav="settings" onclick="if(window.NavRenderer) window.NavRenderer.setActive('settings'); if(window.ModalManager && window.ModalManager.settingsModal) window.ModalManager.openModal(window.ModalManager.settingsModal);">
                        <i class="ph ph-gear"></i>
                        <span data-i18n="nav.settings">설정</span>
                    </li>
                </ul>

                <!-- Desktop Sidebar Progress Card -->
                <div class="sidebar-progress-card">
                    <div class="sidebar-progress-header">
                        <span class="sidebar-progress-title" data-i18n="nav.goal">오늘의 목표</span>
                        <span id="desktop-progress-percent" class="sidebar-progress-percent">${data.percent}%</span>
                    </div>
                    <div class="sidebar-progress-bar-bg">
                        <div id="desktop-progress-bar" class="sidebar-progress-bar-fill" style="width: ${data.percent}%"></div>
                    </div>
                    <p id="desktop-streak-text" class="sidebar-progress-desc">
                        <span data-i18n="nav.streak">연속 학습</span> ${data.streak}<span data-i18n="nav.daysuffix">일째 🔥</span>
                    </p>
                    <button class="sidebar-continue-btn" onclick="window.App && window.App.resumeLearning && window.App.resumeLearning();" data-i18n="nav.continue">이어하기</button>
                </div>

                <a href="https://discord.gg/Mj6x5sCsYt" target="_blank" rel="noopener noreferrer" class="modal-footer sidebar-discord-link">
                    🚀 Discord PKC 해례 Haerye Hub
                </a>
            </nav>
        `;

        // 활성 메뉴 하이라이트 바인딩
        this.bindActiveHandlers();

        // 2. 데이터 업데이트 리스너 등록
        window.addEventListener('progressUpdated', (e) => {
            this.updateUI(e.detail);
        });

        console.log('[NavRenderer] Rendered.');
    },

    // UI 업데이트 함수
    setActive(navKey) {
        const items = document.querySelectorAll('.bottom-nav .nav-item');
        items.forEach(item => item.classList.remove('active'));

        if (!navKey) return;

        const target = document.querySelector(`.bottom-nav .nav-item[data-nav="${navKey}"]`);
        if (target) target.classList.add('active');
    },

    bindActiveHandlers() {
        const nav = document.querySelector('.bottom-nav');
        if (!nav) return;

        // 중복 바인딩 방지
        if (nav.dataset && nav.dataset.activeBound === '1') return;
        if (nav.dataset) nav.dataset.activeBound = '1';

        nav.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item');
            if (!item) return;

            const key = item.getAttribute('data-nav');
            if (key) this.setActive(key);
        });
    },

    updateUI(data) {
        const percentText = document.getElementById('desktop-progress-percent');
        const barFill = document.getElementById('desktop-progress-bar');
        const streakText = document.getElementById('desktop-streak-text');

        if (percentText && barFill && streakText) {
            percentText.textContent = `${data.percent}%`;
            barFill.style.width = `${data.percent}%`;

            // I18n 라벨 및 접미사 유지하면서 숫자 업데이트
            streakText.innerHTML = `<span data-i18n="nav.streak">연속 학습</span> ${data.streak}<span data-i18n="nav.daysuffix">일째 🔥</span>`;

            // 언어팩 재적용 (동적 업데이트 후 번역이 풀리는 것 방지)
            if (window.I18n && typeof window.I18n.apply === 'function') {
                window.I18n.apply();
            }
        }
    }
};
