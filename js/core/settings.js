/**
 * Settings Module
 * 앱 전역 설정 상태 관리 (TTS, 접근성 등)
 */
window.Settings = {
  // 기본 설정값
  defaults: {
    speechRate: 1.0,
    speechPitch: 1.0,
    speechVolume: 1.0,
    autoRead: false,
    preferredVoices: {}
  },

  // 현재 설정 상태 (실시간 값 저장)
  state: {},

  // localStorage 저장 키
  STORAGE_KEY: 'app-settings',

  /**
   * 초기화: 저장된 설정 로드
   */
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.state = { ...this.defaults, ...JSON.parse(saved) };
      } catch (e) {
        console.error('[Settings] Failed to parse settings:', e);
        this.state = { ...this.defaults };
      }
    } else {
      this.state = { ...this.defaults };
    }
    console.log('[Settings] Initialized:', this.state);
  },

  /**
   * 설정값 조회
   */
  get(key) {
    return this.state[key];
  },

  /**
   * 전체 설정 객체 조회
   */
  getAll() {
    return { ...this.state };
  },

  /**
   * 설정값 변경 및 저장
   */
  set(key, value) {
    this.state[key] = value;
    this.save();
    this.notify(key, value);
  },

  /**
   * localStorage에 저장
   */
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('[Settings] Failed to save settings:', e);
    }
  },

  /**
   * 설정 초기화
   */
  reset() {
    this.state = { ...this.defaults };
    this.save();
    this.notify('reset', this.state);
  },

  /**
   * 학습 데이터 초기화
   */
  resetLearningData() {
    try {
      const keysToRemove = [
        // 학습 진행 및 요약 통계
        'app-progress',
        'pkc-stats-log',
        // 단어 / 문법 숙련도 (구 버전 + 신규 버전 키 모두 삭제)
        'word-mastery',
        'pkc-word-mastery',
        'grammar-mastery',
        'pkc-grammar-mastery'
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('[Settings] Learning data reset completed.');

      location.reload();
    } catch (e) {
      console.error('[Settings] Failed to reset learning data:', e);
      alert('초기화 중 오류가 발생했습니다.');
    }
  },

  /**
   * 설정 변경 이벤트 발생
   */
  notify(key, value) {
    const event = new CustomEvent('settingsChanged', {
      detail: { key, value, settings: this.state }
    });
    window.dispatchEvent(event);
  }
};

// 모듈 로드 시 즉시 초기화
window.Settings.init();