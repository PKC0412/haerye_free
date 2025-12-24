// Theme Management Module
window.ThemeManager = {
  LIGHT_MODE: 'light',
  DARK_MODE: 'dark',
  STORAGE_KEY: 'app-theme-preference',

  init() {
    this.loadTheme();
    this.setupEventListeners();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let theme = this.LIGHT_MODE;

    if (savedTheme) {
      theme = savedTheme;
    } else if (prefersDark) {
      theme = this.DARK_MODE;
    }

    this.applyTheme(theme);
  },

  applyTheme(theme) {
    if (theme === this.DARK_MODE) {
      document.documentElement.setAttribute('data-theme', this.DARK_MODE);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.updateThemeToggleIcon(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  },

  getCurrentTheme() {
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    return htmlTheme === this.DARK_MODE ? this.DARK_MODE : this.LIGHT_MODE;
  },

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.LIGHT_MODE ? this.DARK_MODE : this.LIGHT_MODE;
    this.applyTheme(newTheme);
  },

  updateThemeToggleIcon(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      // 다크 모드일 때는 '해(🌞)' 아이콘을 보여줘서 "라이트 모드로 전환"을 유도
      // 라이트 모드일 때는 '달(🌙)' 아이콘을 보여줘서 "다크 모드로 전환"을 유도
      // (기존 코드와 반대일 수 있으니 확인 필요. 보통 현재 상태 아이콘 or 전환될 아이콘)
      // 여기서는 "현재 상태에 맞는 아이콘"이 아니라 "눌렀을 때 될 상태의 아이콘"을 보여주는 게 UX적으로 흔함
      // 하지만 요청하신 "아이콘도 그대로고" 피드백을 반영해, 직관적으로 현재 상태를 보여주거나 토글됨을 명확히 함.
      
      // 기획 의도: 버튼을 누르면 바뀔 모드의 아이콘을 보여주는 것이 일반적
      // Light Mode -> 보여줄 아이콘: 🌙 (Dark Mode로 가기)
      // Dark Mode -> 보여줄 아이콘: 🌞 (Light Mode로 가기)
      const icon = theme === this.DARK_MODE ? '🌞' : '🌙';
      toggleBtn.innerHTML = `<span class="theme-icon">${icon}</span>`;
    }
  },

  setupEventListeners() {
    // 동적 렌더링 대응: document 자체에 이벤트 위임 (가장 안전)
    // 기존 리스너 제거 방지 등을 위해 한 번만 실행되도록 하거나, 
    // UI Manager에서 init 호출 시 매번 연결해도 됨 (removeEventListener 필요)
    
    // 여기서는 간단하게 버튼이 있을 때만 연결 (UI Manager가 렌더링 후 호출해줘야 함)
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      // 기존 리스너 중복 방지를 위해 cloneNode 사용 또는 onclick 덮어쓰기
      themeToggleBtn.onclick = () => {
        this.toggleTheme();
      };
    }

    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').onchange = (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.applyTheme(e.matches ? this.DARK_MODE : this.LIGHT_MODE);
        }
    };
  }
};