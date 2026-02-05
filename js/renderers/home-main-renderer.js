/**
 * Home Main Renderer
 * 홈 메인 화면 렌더링 (탭 방식 UI)
 */

window.HomeMainRenderer = {
    currentTab: 'origin',

    /**
     * 초기화
     */
    async init() {
        console.log('[HomeMainRenderer] Initializing...');
        await this.render();
    },

    /**
     * 새로고침 (언어 변경 시)
     */
    async refresh() {
        console.log('[HomeMainRenderer] Refreshing...');
        await this.render();
    },

    /**
     * 메인 렌더링
     */
    async render() {
        const container = document.getElementById('home-main-section');
        if (!container) {
            console.error('[HomeMainRenderer] Container not found');
            return;
        }

        const logoSubtitle = '한국어 학습, 시작합니다.';

        const tabOrigin = '해례의 유래';
        const tabMethod = '학습 방법';
        const tabUsage = '사용법';
        const tabFaq = '자주 묻는 질문';
        const tabComparison = '무료 / 유료 비교';

        container.innerHTML = `
            <div class="home-main-container">
                <!-- 로고 섹션 -->
                <div class="home-main-logo">
                    <div class="logo-wrapper">
                        <svg viewBox="0 0 320 300" style="width: 320px; height: 300px;">
                            <!-- 분홍색 작은 원 (상단) -->
                            <circle cx="160" cy="45" r="25" fill="#FF6B9D" />

                            <!-- 가로선 (테마 자동 색상) -->
                            <rect class="logo-mark-line" x="90" y="80" width="140" height="18" rx="9" fill="currentColor"/>

                            <!-- 보라색 큰 원 (중앙) -->
                            <circle cx="160" cy="170" r="70" stroke="#7C3AED" stroke-width="16" fill="none" />

                            <!-- 원 안에 텍스트 (2px 더 아래로) -->
                            <text x="160" y="166" font-family="Noto Sans KR, sans-serif" font-weight="900" font-size="32" fill="currentColor" text-anchor="middle">해례</text>
                            <text x="160" y="194" font-family="Noto Sans KR, sans-serif" font-weight="400" font-size="20" fill="currentColor" text-anchor="middle" opacity="0.7">(Haerye)</text>

                            <!-- 하늘색 작은 원 (우측 하단) -->
                            <circle cx="210" cy="225" r="14" fill="#06B6D4" />
                        </svg>
                    </div>
                    <button type="button" class="logo-subtitle logo-subtitle-btn" data-i18n="home.logo_subtitle">${logoSubtitle}</button>
                </div>

                <!-- 탭 네비게이션 -->
                <div class="home-main-tabs">
                    <button class="tab-button active" data-tab="origin" data-i18n="home.tab_origin">${tabOrigin}</button>
                    <button class="tab-button" data-tab="method" data-i18n="home.tab_method">${tabMethod}</button>
                    <button class="tab-button" data-tab="usage" data-i18n="home.tab_usage">${tabUsage}</button>
                    <button class="tab-button" data-tab="faq" data-i18n="home.tab_faq">${tabFaq}</button>
                    <button class="tab-button" data-tab="comparison" data-i18n="home.tab_comparison">${tabComparison}</button>
                </div>

                <!-- 탭 콘텐츠 영역 -->
                <div class="home-main-content">
                    <!-- 해례의 유래 -->
                    <div class="tab-content active" data-content="origin">
                        ${this.renderOriginTab()}
                    </div>

                    <!-- 학습 방법 -->
                    <div class="tab-content" data-content="method">
                        ${this.renderMethodTab()}
                    </div>

                    <!-- 사용법 -->
                    <div class="tab-content" data-content="usage">
                        ${this.renderUsageTab()}
                    </div>

                    <!-- FAQ -->
                    <div class="tab-content" data-content="faq">
                        ${this.renderFaqTab()}
                    </div>

                    <!-- 무료/유료 비교 -->
                    <div class="tab-content" data-content="comparison">
                        ${this.renderComparisonTab()}
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();

        if (window.I18n && typeof window.I18n.apply === 'function') {
            window.I18n.apply();
        }

        console.log('[HomeMainRenderer] Rendered successfully');
    },
/**
 * 해례의 유래 탭 HTML
 */
renderOriginTab() {
    return `
        <h2 data-i18n="home.content_origin.title">한글과 해례</h2>
        <p data-i18n="home.content_origin.text">해례(解例)는 훈민정음 해례본에서 유래한 이름으로, "풀이와 예시"를 의미합니다. 세종대왕께서 창제하신 한글의 원리를 설명하고 예를 든 것처럼, 이 앱도 체계적인 설명과 풍부한 예시로 한국어를 배울 수 있도록 설계되었습니다.</p>
        <ul>
            <li data-i18n="home.content_origin.point1">📖 훈민정음 해례본의 정신 계승</li>
            <li data-i18n="home.content_origin.point2">🎯 체계적이고 과학적인 학습법</li>
            <li data-i18n="home.content_origin.point3">🌍 전 세계 학습자를 위한 설계</li>
        </ul>
    `;
},
/**
 * 학습 방법 탭 HTML (표준 학습 순서)
 */
renderMethodTab() {
    return `
        <h2 data-i18n="home.content_method.title">효과적인 학습 순서</h2>
        <p data-i18n="home.content_method.intro">해례는 초급부터 고급까지 체계적인 한국어 학습을 지원합니다. 외국인 한국어 교육의 표준 커리큘럼을 기반으로, 자연스럽게 단계를 밟아갈 수 있도록 설계되었습니다.</p>
        <ul>
            <li>
                <strong data-i18n="home.content_method.step1_title">1. 한글 자모 익히기</strong><br>
                <span data-i18n="home.content_method.step1_desc">자음 19개, 모음 21개를 소리와 함께 익힙니다. 자모의 모양, 발음, 조합 원리를 반복 학습하여 한글을 "읽을 수 있는" 단계로 빠르게 진입합니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_method.step2_title">2. 기본 인사말 & 생활 표현</strong><br>
                <span data-i18n="home.content_method.step2_desc">안녕하세요, 감사합니다, 미안합니다 등 일상에서 가장 자주 쓰는 표현부터 시작합니다. 자기소개, 숫자, 날짜, 요일 등 기초 회화에 필요한 핵심 표현을 먼저 학습합니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_method.step3_title">3. 기초 어휘 학습</strong><br>
                <span data-i18n="home.content_method.step3_desc">가족, 음식, 장소, 날씨, 감정 등 주제별로 분류된 300개 이상의 핵심 어휘를 학습합니다. 각 단어는 예문과 함께 제공되어 실제 사용 맥락을 이해할 수 있습니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_method.step4_title">4. 기초 문법 익히기</strong><br>
                <span data-i18n="home.content_method.step4_desc">조사(이/가, 은/는, 을/를), 시제(과거/현재/미래), 존댓말과 반말 구분 등 기본 문법을 배웁니다. "짧은 설명 + 예문 2~3개"로 구성되어 빠르게 이해하고 활용할 수 있습니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_method.step5_title">5. 듣기·말하기 연습</strong><br>
                <span data-i18n="home.content_method.step5_desc">실제 대화 상황을 듣고 이해하는 연습을 합니다. TTS(음성 합성) 기능으로 단어와 문장을 반복해서 들으며 발음을 익히고, 따라 말하기를 통해 말하기 능력을 키웁니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_method.step6_title">6. 읽기·쓰기 확장</strong><br>
                <span data-i18n="home.content_method.step6_desc">짧은 문장 읽기부터 시작해 점차 긴 글을 읽는 연습을 합니다. 간단한 일기나 메시지를 작성하며 배운 어휘와 문법을 실전에 적용해 봅니다.</span>
            </li>
        </ul>
        <p>
            <strong data-i18n="home.content_method.tools_title">학습 도구</strong><br>
            <span data-i18n="home.content_method.tools_desc">플래시카드: 전 과정에서 복습 도구로 활용. 틀린 카드는 더 자주, 익숙한 카드는 덜 나타나는 스마트 복습 시스템을 제공합니다.</span>
        </p>
    `;
},
/**
 * 사용법 탭 HTML
 */
renderUsageTab() {
    return `
        <h2 data-i18n="home.content_usage.title">해례 사용 방법</h2>
        <p data-i18n="home.content_usage.intro">해례는 "처음 접속 → 학습 모듈 선택 → 학습 → 복습"의 단순한 흐름으로 움직입니다. 하루 5~10분만 투자해도 학습 기록이 쌓이고, 어느 부분을 더 보완해야 하는지 한눈에 확인할 수 있습니다.</p>
        <ul>
            <li>
                <strong data-i18n="home.content_usage.usage1_title">1. 앱 시작과 홈 화면</strong><br>
                <span data-i18n="home.content_usage.usage1_desc">브라우저에서 해례에 접속하면 홈 화면에서 오늘의 목표, 학습 진행률, 추천 학습 경로를 먼저 보여 줍니다. "학습 시작" 버튼을 누르면 직전에 학습하던 영역으로 바로 이어서 들어갈 수 있습니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_usage.usage2_title">2. 학습 모듈 선택</strong><br>
                <span data-i18n="home.content_usage.usage2_desc">왼쪽 사이드바에서 자모, 어휘, 문법, 플래시카드 중 하나를 선택합니다. 각 모듈은 현재 진도와 남은 아이템 수를 표시해서 어디부터 시작할지 고민하지 않아도 됩니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_usage.usage3_title">3. 카드 학습 인터페이스</strong><br>
                <span data-i18n="home.content_usage.usage3_desc">카드 앞면에는 한국어 단어나 문장이, 뒷면에는 뜻·발음·예문이 표시됩니다. 카드를 넘기면서 "알겠다 / 아직 헷갈린다"를 선택하면 시스템이 자동으로 복습 우선순위를 조정합니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_usage.usage4_title">4. 설정과 언어 선택</strong><br>
                <span data-i18n="home.content_usage.usage4_desc">상단 아이콘 또는 설정 메뉴에서 인터페이스 언어, 자동 읽기(TTS) 사용 여부, 다크 모드 등을 변경할 수 있습니다. 설정은 브라우저에 저장되어 다음 접속 시에도 유지됩니다.</span>
            </li>
            <li>
                <strong data-i18n="home.content_usage.usage5_title">5. 진행 상황 확인</strong><br>
                <span data-i18n="home.content_usage.usage5_desc">통계(Stats) 화면에서 총 학습한 카드 수, 맞힌 비율, 연속 학습 일수 등을 그래프로 보여 줍니다. "어디까지 왔는지"와 "어디를 더 공부해야 하는지"를 스스로 점검할 수 있습니다.</span>
            </li>
        </ul>
    `;
},
/**
 * FAQ 탭 HTML
 */
renderFaqTab() {
    return `
        <h2 data-i18n="home.content_faq.title">자주 묻는 질문</h2>
        <div class="faq-list">
            <div class="faq-item">
                <div class="faq-question" data-i18n="home.faq.q1">Q. 오프라인에서도 사용할 수 있나요?</div>
                <div class="faq-answer" data-i18n="home.faq.a1">A. 네, PWA(Progressive Web App) 방식으로 일부 오프라인 기능을 지원합니다. 한 번 접속하면 캐시에 저장되어 인터넷 없이도 기본 학습이 가능합니다.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question" data-i18n="home.faq.q2">Q. 발음이 잘 안 들립니다 (특히 iPhone)</div>
                <div class="faq-answer" data-i18n="home.faq.a2">A. iOS 기기에서는 무음 모드 스위치를 확인하고, 볼륨을 높여주세요. 설정 → 손쉬운 사용 → 음성 콘텐츠에서 한국어 음성을 다운로드하면 더 나은 품질로 들을 수 있습니다.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question" data-i18n="home.faq.q3">Q. 학습 기록은 어디에 저장되나요?</div>
                <div class="faq-answer" data-i18n="home.faq.a3">A. 모든 학습 기록은 브라우저의 LocalStorage에 저장됩니다. 브라우저 데이터를 삭제하면 기록도 함께 사라지니 주의하세요.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question" data-i18n="home.faq.q4">Q. 모바일 앱으로 설치할 수 있나요?</div>
                <div class="faq-answer" data-i18n="home.faq.a4">A. 네! Android(Chrome)에서는 메뉴 → "홈 화면에 추가", iOS(Safari)에서는 공유 버튼 → "홈 화면에 추가"를 선택하면 앱처럼 사용할 수 있습니다.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question" data-i18n="home.faq.q5">Q. 어느 수준까지 배울 수 있나요?</div>
                <div class="faq-answer" data-i18n="home.faq.a5">A. 현재는 초급부터 고급까지 지원합니다. 한글 기초부터 일상 회화, 심화 문법까지 폭넓은 학습이 가능합니다.</div>
            </div>
        </div>
    `;
},
/**
 * 무료/유료 비교 탭 HTML
 */
renderComparisonTab() {
    const features = [
        {
            categoryKey: 'home.comparison.category.learning',
            categoryFallback: '핵심 학습 기능 (Learning)',
            items: [
                { nameKey: 'home.comparison.item.vocab', nameFallback: '주제별 단어장', free: 'included', pro: 'extended' },
                { nameKey: 'home.comparison.item.flashcard', nameFallback: '플래시카드 암기', free: 'included', pro: 'extended' },
                { nameKey: 'home.comparison.item.grammar_basic', nameFallback: '기초 문법', free: 'included', pro: 'extended' },
                { nameKey: 'home.comparison.item.dictation', nameFallback: '받아쓰기 훈련', free: 'excluded', pro: 'new' },
                { nameKey: 'home.comparison.item.pronunciation', nameFallback: '발음 교정', free: 'excluded', pro: 'new' }
            ]
        },
        {
            categoryKey: 'home.comparison.category.analytics',
            categoryFallback: '학습 분석 및 통계 (Analytics)',
            items: [
                { nameKey: 'home.comparison.item.progress', nameFallback: '실시간 진행률 추적', free: 'included', pro: 'new' },
                { nameKey: 'home.comparison.item.streak', nameFallback: '연속 학습 스트릭', free: 'excluded', pro: 'new' },
                { nameKey: 'home.comparison.item.dashboard', nameFallback: '상세 통계 대시보드', free: 'excluded', pro: 'new' },
                { nameKey: 'home.comparison.item.weakness', nameFallback: '약점 분석 리포트', free: 'excluded', pro: 'new' }
            ]
        },
        {
            categoryKey: 'home.comparison.category.utility',
            categoryFallback: '편의 기능 (Utility)',
            items: [
                { nameKey: 'home.comparison.item.i18n', nameFallback: '다국어 인터페이스', free: 'included', pro: 'included' },
                { nameKey: 'home.comparison.item.theme', nameFallback: '다크/라이트 테마', free: 'included', pro: 'included' },
                { nameKey: 'home.comparison.item.offline', nameFallback: '오프라인 모드(PWA)', free: 'included', pro: 'included' },
                { nameKey: 'home.comparison.item.voice_select', nameFallback: '음성 선택', free: 'included', pro: 'included' },
                { nameKey: 'home.comparison.item.tts_speed', nameFallback: 'TTS 속도 조절', free: 'excluded', pro: 'included' }
            ]
        }
    ];

    const statusKeyMap = {
        included: 'home.comparison.status.included',
        excluded: 'home.comparison.status.excluded',
        new: 'home.comparison.status.new',
        extended: 'home.comparison.status.extended'
    };

    const statusFallbackMap = {
        included: '✅ 포함',
        excluded: '❌ 미포함',
        new: '✨ 신규 제공',
        extended: '✅ 확장 버전'
    };

    let tableRows = '';

    features.forEach(group => {
        tableRows += `
            <tr class="comp-category-row">
                <td colspan="3" data-i18n="${group.categoryKey}">${group.categoryFallback}</td>
            </tr>
        `;

        group.items.forEach(item => {
            const freeKey = statusKeyMap[item.free];
            const proKey = statusKeyMap[item.pro];

            const freeFallback = statusFallbackMap[item.free];
            const proFallback = statusFallbackMap[item.pro];

            tableRows += `
                <tr>
                    <td class="feat-name" data-i18n="${item.nameKey}">${item.nameFallback}</td>
                    <td class="feat-status status-${item.free}" data-i18n="${freeKey}">${freeFallback}</td>
                    <td class="feat-status status-${item.pro}" data-i18n="${proKey}">${proFallback}</td>
                </tr>
            `;
        });
    });

    return `
        <div class="comparison-view">
            <h2 data-i18n="home.content_comparison.title">무료 vs 유료 기능 비교</h2>
            <p class="comparison-intro" data-i18n="home.content_comparison.intro">해례는 무료 버전만으로도 충분한 학습이 가능합니다. ✨ 더 깊이 있는 분석과 심화 학습이 필요하시다면 PRO 버전을 고려해보세요!</p>

            <div class="comparison-table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th class="th-feature" data-i18n="home.comparison.th_feature">기능</th>
                            <th class="th-free" data-i18n="home.comparison.th_free">무료 (Free)</th>
                            <th class="th-pro" data-i18n="home.comparison.th_pro">유료 (PRO)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>

            <div class="comparison-footer">
                <div class="license-badge">
                    <span class="badge-icon">🎁</span>
                    <span class="badge-text" data-i18n="home.content_comparison.footer_note">PRO 버전 출시. (가격: 월 단위 / $7.99)</span>
                </div>
                <a href="https://app.haerye.com/" target="_blank" class="btn-upgrade-pro" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
                    <span class="btn-icon">⭐</span>
                    <span data-i18n="home.content_comparison.btn_upgrade">PRO 버전 출시!!</span>
                </a>
            </div>
        </div>
    `;
},



    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        const tabButtons = document.querySelectorAll('.home-main-tabs .tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });

        const logoSubtitleBtn = document.querySelector('.logo-subtitle-btn');
        if (logoSubtitleBtn) {
            logoSubtitleBtn.addEventListener('click', () => {
                if (window.NavRenderer && typeof window.NavRenderer.setActive === 'function') {
                    window.NavRenderer.setActive('learn');
                }
                if (typeof window.showLearn === 'function') {
                    window.showLearn();
                    return;
                }
                if (window.UIManager && typeof window.UIManager.showLearn === 'function') {
                    window.UIManager.showLearn();
                }
            });
        }
    },

    /**
     * 탭 전환
     */
    switchTab(tab) {
        console.log('[HomeMainRenderer] Switching to tab:', tab);

        const buttons = document.querySelectorAll('.home-main-tabs .tab-button');
        buttons.forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const contents = document.querySelectorAll('.home-main-content .tab-content');
        contents.forEach(content => {
            if (content.dataset.content === tab) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        this.currentTab = tab;
    }
};
