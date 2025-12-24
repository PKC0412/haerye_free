// Main App Module (Thin UI / Router)
// 학습 진행 로직은 LearningProgress 모듈이 담당합니다.
window.App = {
  currentSection: null,
  initialized: false,

  init() {
    // 진행도 매니저 초기화
    if (window.LearningProgress && typeof window.LearningProgress.init === 'function') {
      window.LearningProgress.init();
    }

    this.setupEventListeners();
    console.log('[App] Initialized');
  },

  setupEventListeners() {
    const bindBtn = (id, section) => {
      const btn = document.getElementById(id);
      if (btn) btn.onclick = () => this.showSection(section);
    };

    bindBtn('btn-hangul', 'hangul-section');
    bindBtn('btn-vocabulary', 'vocabulary-section');
    bindBtn('btn-flashcard', 'flashcard-section');
    bindBtn('btn-grammar', 'grammar-section');
  },

  showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
      section.style.display = 'none';
    });

    // home-container는 계속 표시 (카드 메뉴가 상단에 고정)
    const homeContainer = document.getElementById('home-container');
    if (homeContainer) {
      homeContainer.style.display = 'block';
    }

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = 'block';
      this.currentSection = sectionId;

      // 네비게이션 활성 상태 업데이트 (학습 메뉴)
      if (window.setActiveNav) {
        window.setActiveNav(1);
      }

      // 각 섹션별 모듈 초기화
      if (sectionId === 'hangul-section' && window.HangulLearning) window.HangulLearning.initialize();
      else if (sectionId === 'vocabulary-section' && window.VocabularyLearning) window.VocabularyLearning.initialize();
      else if (sectionId === 'flashcard-section' && window.Flashcard) window.Flashcard.initialize();
      else if (sectionId === 'grammar-section' && window.GrammarUI) window.GrammarUI.initialize();

      // 스크롤 이동 (카드 아래 콘텐츠로)
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  },

  showWelcome() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');

    const homeContainer = document.getElementById('home-container');
    if (homeContainer) {
      homeContainer.style.display = 'block';
    }

    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) welcomeSection.style.display = 'block';
    this.currentSection = null;

    // 네비게이션 활성 상태 업데이트 (홈)
    if (window.setActiveNav) {
      window.setActiveNav(0);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 오늘 마지막 학습 섹션으로 이동 (이어하기)
  resumeLearning() {
    if (!window.LearningProgress) {
      this.showSection('vocabulary-section');
      return;
    }
    const data = LearningProgress.getSummaryData();
    const last = data && data.lastSection;
    if (last) {
      this.showSection(last);
    } else {
      this.showSection('vocabulary-section');
    }
  },

  // 외부 모듈에서 학습 완료를 보고할 때 사용하는 헬퍼
  completeLearningItem(itemKey) {
    if (!window.LearningProgress || typeof LearningProgress.completeLearningItem !== 'function') return;
    LearningProgress.completeLearningItem(itemKey, this.currentSection);
  },

  // 진행 요약 데이터 전달 (NavRenderer 등에서 사용)
  getSummaryData() {
    if (window.LearningProgress && typeof LearningProgress.getSummaryData === 'function') {
      return LearningProgress.getSummaryData();
    }
    return { percent: 0, streak: 0 };
  }
};

window.showWelcome = function() {
  if (window.App) window.App.showWelcome();
};

window.setActiveNav = function(index) {
  // 모바일 하단 네비 + 데스크탑 사이드바 공통 처리
  const navRoot = document.querySelector('.bottom-nav .nav-list');
  if (!navRoot) return;

  const items = navRoot.querySelectorAll('.nav-item');
  items.forEach((item, i) => {
    // 마이크 FAB는 항상 비활성
    if (item.classList.contains('fab-container')) {
      item.classList.remove('active');
      return;
    }
    item.classList.toggle('active', i === index);
  });
};
