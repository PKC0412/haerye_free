/**
 * Scroll to Top Button
 * 독립적인 FAB 버튼 - 모바일/데스크톱 모두 지원
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollToTopButton();
});

function initScrollToTopButton() {
    // 1. 버튼 생성
    const btn = document.createElement('button');
    btn.id = 'scroll-to-top-btn';
    btn.className = 'scroll-to-top-btn';
    btn.setAttribute('aria-label', '맨 위로 이동');
    btn.setAttribute('title', '맨 위로');
    btn.innerHTML = '<i class="ph-fill ph-arrow-up"></i>';

    // 2. 인라인 스타일 적용
    btn.style.cssText = `
        position: fixed;
        bottom: 6rem;
        right: 1.5rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-primary, #3182ce);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 50;
        padding: 0;
    `;

    // 3. DOM에 추가
    document.body.appendChild(btn);
    console.log('[ScrollBtn] Button created and added to DOM');

    // 4. 호버 이벤트
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px)';
        btn.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    });

    // 5. 클릭 이벤트
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        // app-main 스크롤
        const appMain = document.querySelector('.app-main');
        if (appMain) {
            appMain.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // 윈도우 스크롤도 함께
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        console.log('[ScrollBtn] Clicked - scrolling to top');
    });

    // 6. 스크롤 감지
    const SCROLL_THRESHOLD = 500;
    let isVisible = false;

    // app-main 스크롤 이벤트 (주요 - 데스크톱)
    const appMain = document.querySelector('.app-main');
    if (appMain) {
        appMain.addEventListener('scroll', () => {
            const scrollPos = appMain.scrollTop;

            if (scrollPos > SCROLL_THRESHOLD && !isVisible) {
                btn.style.display = 'flex';
                isVisible = true;
                console.log('[ScrollBtn] Shown (app-main) at ' + scrollPos + 'px');
            } else if (scrollPos <= SCROLL_THRESHOLD && isVisible) {
                btn.style.display = 'none';
                isVisible = false;
                console.log('[ScrollBtn] Hidden (app-main) at ' + scrollPos + 'px');
            }
        }, { passive: true });
    }

    // 윈도우 스크롤 이벤트 (보조 - 모바일)
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;

        if (scrollPos > SCROLL_THRESHOLD && !isVisible) {
            btn.style.display = 'flex';
            isVisible = true;
            console.log('[ScrollBtn] Shown (window) at ' + scrollPos + 'px');
        } else if (scrollPos <= SCROLL_THRESHOLD && isVisible) {
            btn.style.display = 'none';
            isVisible = false;
            console.log('[ScrollBtn] Hidden (window) at ' + scrollPos + 'px');
        }
    }, { passive: true });

    console.log('[ScrollBtn] Fully initialized (threshold: ' + SCROLL_THRESHOLD + 'px)');
}