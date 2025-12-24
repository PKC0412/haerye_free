/**
 * UI Manager
 * 앱의 진입점으로, 컴포넌트 렌더링 및 각 매니저 모듈을 초기화합니다.
 */

// ==================== 전역 UIManager 객체 ====================
window.UIManager = {
    currentSection: null,

    /**
     * 모든 섹션 숨기기
     */
    hideAllSections() {
        // 홈 메인 섹션
        const homeMainSection = document.getElementById('home-main-section');
        if (homeMainSection) homeMainSection.style.display = 'none';

        // 기존 홈 컨테이너
        const homeContainer = document.getElementById('home-container');
        if (homeContainer) homeContainer.style.display = 'none';

        // 다른 모든 섹션
        const sections = [
            'hangul-section',
            'vocabulary-section',
            'flashcard-section',
            'grammar-section'
        ];

        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = 'none';
        });

        console.log('[UIManager] All sections hidden');
    },

    /**
     * 홈 메인 화면 표시
     */
    async showHomeMain() {
        console.log('[UIManager] Showing Home Main');

        this.hideAllSections();

        const section = document.getElementById('home-main-section');
        if (section) {
            section.style.display = 'block';

            // HomeMainRenderer 초기화
            if (window.HomeMainRenderer) {
                await window.HomeMainRenderer.init();
            }

            this.currentSection = 'home-main';
        }
    },

    /**
     * 기존 홈 대시보드 표시 (학습 메뉴)
     */
    showHome() {
        console.log('[UIManager] Showing Home Dashboard');

        this.hideAllSections();

        const homeContainer = document.getElementById('home-container');
        if (homeContainer) {
            homeContainer.style.display = 'block';
            this.currentSection = 'home';
        }
    },
    /**
     * 학습 메뉴 표시
     */
    showLearn() {
        console.log('[UIManager] Showing Learn Menu');

        this.hideAllSections();

        const homeContainer = document.getElementById('home-container');
        if (homeContainer) {
            homeContainer.style.display = 'block';
            this.currentSection = 'learn';
        }
    },

    /**
     * 언어 변경 시 재렌더링
     */
    async refreshCurrentSection() {
        console.log('[UIManager] Refreshing current section:', this.currentSection);

        if (this.currentSection === 'home-main') {
            if (window.HomeMainRenderer) {
                await window.HomeMainRenderer.refresh();
            }
        }
        // 다른 섹션들도 필요시 추가
    }
};

// ==================== DOMContentLoaded 초기화 ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[UI Manager] Initializing...');

    // 1. UI 컴포넌트 렌더링 (Renderers)
    if (window.HeaderRenderer) window.HeaderRenderer.render('header-container');
    if (window.HomeRenderer) window.HomeRenderer.render('home-container');
    if (window.NavRenderer) window.NavRenderer.render('nav-container');
    if (window.ModalRenderer) window.ModalRenderer.render('modal-container');

    // 2. 테마 초기화
    if (window.ThemeManager) window.ThemeManager.init();

    // 3. 매니저 모듈 초기화
    // (Settings는 로드 시 자체적으로 init 되지만 순서 보장을 위해 확인)
    if (window.ModalManager) window.ModalManager.init();
    if (window.LanguageManager) window.LanguageManager.init();

    // 4. 메인 앱 로직 초기화
    if (window.App) window.App.init();

    // 5. 전역 이벤트 연결
    initGlobalEvents();

    // 6. 언어팩 적용 (초기 로드)
    if (window.LanguageManager) {
        const lang = localStorage.getItem('preferredLanguage') || 'ko'; // ✅ 기본 한국어
        await window.LanguageManager.applyLanguage(lang, true);
    }

    // 7. ★ 홈 메인 화면을 첫 화면으로 표시 ★
    if (window.UIManager) {
        await window.UIManager.showHomeMain();
    }

    // 8. 스크롤 투 탑 버튼 초기화
    setTimeout(() => {
        initScrollToTopButton();
    }, 200);
});

// --- 전역 이벤트 관리 ---
function initGlobalEvents() {
    // 1. ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    // 2. 접근성: 포커스 시 자동 읽기 기능
    document.addEventListener('focusin', handleAutoRead);
}

// 자동 읽기 핸들러 (접근성)
function handleAutoRead(e) {
    if (!window.Settings || !window.Settings.get('autoRead')) return;

    // iOS에서 focusin이 연속으로 발생하면 TTS가 연속 호출되어 경고가 발생할 수 있어
    // 간단한 스로틀/중복 방지로 호출 횟수를 제한합니다.
    const nowMs = Date.now();
    if (!handleAutoRead._lastCallMs) handleAutoRead._lastCallMs = 0;
    if (!handleAutoRead._lastText) handleAutoRead._lastText = '';
    if (!handleAutoRead._lastTextMs) handleAutoRead._lastTextMs = 0;

    const target = e.target;
    // 입력 필드 등은 제외
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

    // 읽을 텍스트 추출 (aria-label 우선, 없으면 텍스트 콘텐츠)
    let textToRead = target.getAttribute('aria-label') || target.innerText || "";
    textToRead = textToRead.trim();

    // 텍스트가 너무 길지 않고 비어있지 않으면 읽기
    if (textToRead.length > 0 && textToRead.length < 100) {
        // 1) 너무 자주 호출되면 무시 (기본 500ms)
        if ((nowMs - handleAutoRead._lastCallMs) < 500) {
            return;
        }

        // 2) 같은 텍스트를 짧은 시간(2초) 안에 반복 읽지 않기
        if (textToRead === handleAutoRead._lastText && (nowMs - handleAutoRead._lastTextMs) < 2000) {
            return;
        }

        handleAutoRead._lastCallMs = nowMs;
        handleAutoRead._lastText = textToRead;
        handleAutoRead._lastTextMs = nowMs;

        if (window.SpeechSynthesisManager) {
            window.SpeechSynthesisManager.speak(textToRead);
        }
    }
}

// --- 스크롤 투 탑 버튼 (오른쪽 끝 하단 고정) ---
function initScrollToTopButton() {
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) {
        console.warn('[ScrollBtn] .app-container not found');
        return;
    }

    // 기존 버튼 제거
    const existingBtn = document.querySelector('.scroll-to-top-btn');
    if (existingBtn) existingBtn.remove();

    // 버튼 생성
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top-btn';
    scrollBtn.style.display = 'none';
    scrollBtn.innerHTML = '<i class="ph-fill ph-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', '맨 위로 이동');
    scrollBtn.setAttribute('title', '맨 위로');

    // 클릭 이벤트
    scrollBtn.onclick = (e) => {
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const appMain = document.querySelector('.app-main');
        if (appMain) {
            appMain.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // app-container에 추가
    appContainer.appendChild(scrollBtn);
    console.log('[ScrollBtn] Button added to .app-container (right-bottom fixed)');

    // 스크롤 감지
    const SCROLL_THRESHOLD = 100;

    // 윈도우 스크롤 이벤트
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;

        if (currentScroll > SCROLL_THRESHOLD) {
            if (scrollBtn.style.display === 'none') {
                scrollBtn.style.display = 'flex';
            }
        } else {
            if (scrollBtn.style.display === 'flex') {
                scrollBtn.style.display = 'none';
            }
        }
    }, { passive: true });

    // app-main 스크롤 이벤트
    const appMain = document.querySelector('.app-main');
    if (appMain) {
        appMain.addEventListener('scroll', () => {
            const appScroll = appMain.scrollTop;

            if (appScroll > SCROLL_THRESHOLD) {
                if (scrollBtn.style.display === 'none') {
                    scrollBtn.style.display = 'flex';
                }
            } else {
                if (scrollBtn.style.display === 'flex') {
                    scrollBtn.style.display = 'none';
                }
            }
        }, { passive: true });
    }

    console.log('[ScrollBtn] Initialized at right-bottom (threshold: 100px)');
}

// 서비스 워커 등록 (HTTPS 환경에서만)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('SW registered:', reg))
            .catch(err => console.log('SW registration failed:', err));
    });
}

// ==================== 전역 함수 (하위 호환성) ====================
// 기존 코드에서 showWelcome() 같은 함수를 직접 호출할 수 있으므로 전역으로 노출
window.showWelcome = function() {
    if (window.UIManager) {
        window.UIManager.showHome();
    }
};

window.showHomeMain = function() {
    if (window.UIManager) {
        window.UIManager.showHomeMain();
    }
};
window.showLearn = function() {
    if (window.UIManager) {
        window.UIManager.showLearn();
    }
};
