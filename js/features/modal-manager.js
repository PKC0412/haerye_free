/**
 * ModalManager (Core)
 * 모달 시스템의 진입점이자 메인 컨트롤러입니다.
 * 하위 모듈(Interaction, SettingsLogic)을 조율하고 기본 Open/Close 동작을 관리합니다.
 */
window.ModalManager = {
  // 기본 모달 요소 캐싱
  elements: {
    helpModal: null,
    languageModal: null,
    settingsModal: null,
    ttsWarningModal: null,
    
    languageBtn: null,
    helpBtn: null,
    
    closeButtons: [],
    overlays: []
  },

  /**
   * 시스템 초기화
   */
  init() {
    this.cacheElements();
    this.hideAllModals();

    // 1. 하위 모듈 초기화 (순서 중요)
    if (window.ModalInteraction) window.ModalInteraction.init();
    if (window.ModalSettingsLogic) window.ModalSettingsLogic.init();

    // 2. 기본 버튼 바인딩
    this.bindHeaderButtons();
    this.bindNavSettingsButton();
    this.bindCloseButtons();
    this.bindOverlayClickClose();

    // 3. 전역 이벤트 리스너 등록
    this.setupGlobalListeners();
    this.exposeGlobalHelpers();

    console.log('[ModalManager] Core Initialized.');
  },

  cacheElements() {
    // 모달 오버레이
    this.elements.helpModal = document.getElementById('helpModal');
    this.elements.languageModal = document.getElementById('languageModal');
    this.elements.settingsModal = document.getElementById('settingsModal');
    this.elements.ttsWarningModal = document.getElementById('ttsWarningModal');

    // 트리거 버튼
    this.elements.languageBtn = document.getElementById('language-btn');
    this.elements.helpBtn = document.getElementById('help-btn');

    // 공통 요소
    this.elements.closeButtons = document.querySelectorAll('.modal-close');
    this.elements.overlays = document.querySelectorAll('.modal-overlay');
  },

  hideAllModals() {
    if (!this.elements.overlays) return;
    this.elements.overlays.forEach(overlay => {
      overlay.classList.remove('active');
    });
  },

  // --- 기본 이벤트 바인딩 ---

  bindHeaderButtons() {
    const { languageBtn, languageModal, helpBtn, helpModal } = this.elements;
    
    if (languageBtn && languageModal) {
      languageBtn.addEventListener('click', () => this.openModal(languageModal));
    }
    if (helpBtn && helpModal) {
      helpBtn.addEventListener('click', () => this.openModal(helpModal));
    }
  },

  bindNavSettingsButton() {
    // 네비게이션 바의 '설정' 아이콘 찾기
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
      const icon = item.querySelector('i');
      const label = item.querySelector('span');

      const hasGearIcon = icon && icon.className && icon.className.includes('ph-gear');
      const hasSettingsText = label && label.textContent && label.textContent.trim().includes('설정');

      if (hasGearIcon || hasSettingsText) {
        item.onclick = () => {
          if (this.elements.settingsModal) this.openModal(this.elements.settingsModal);
        };
      }
    });
  },

  bindCloseButtons() {
    if (!this.elements.closeButtons) return;
    this.elements.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const overlay = btn.closest('.modal-overlay');
        if (overlay) this.closeModal(overlay);
      });
    });
  },

  bindOverlayClickClose() {
    if (!this.elements.overlays) return;
    this.elements.overlays.forEach(overlay => {
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) this.closeModal(overlay);
      });
    });
  },

  // --- 전역 이벤트 리스너 ---

  setupGlobalListeners() {
    // TTS 보이스 로드 완료 시 -> 설정 로직에 전파
    window.addEventListener('voicesLoaded', () => {
      if (window.ModalSettingsLogic) {
        window.ModalSettingsLogic.loadVoiceOptions();
      }
    });

    // 목표 달성 이벤트 -> 인터랙션 모듈에 전파
    window.addEventListener('goalReached', () => {
      if (window.ModalInteraction) {
        window.ModalInteraction.showCelebration();
      }
    });
  },

  exposeGlobalHelpers() {
    // TTS 경고 모달 (Speech 모듈에서 호출)
    window.showTtsWarningModal = () => {
      if (this.elements.ttsWarningModal) {
        this.openModal(this.elements.ttsWarningModal);
      }
    };
  },

  // --- Public APIs ---

  /**
   * 모달 열기
   * @param {HTMLElement} overlay - 열고자 하는 모달 요소
   */
  openModal(overlay) {
    if (!overlay) return;
    this.hideAllModals();

    // 설정 모달인 경우, UI 상태 최신화 (Logic 모듈 위임)
    if (overlay === this.elements.settingsModal && window.ModalSettingsLogic) {
      window.ModalSettingsLogic.loadVoiceOptions(); 
      window.ModalSettingsLogic.updateUI();
    }

    overlay.classList.add('active');
  },

  /**
   * 모달 닫기
   * @param {HTMLElement} overlay - 닫고자 하는 모달 요소
   */
  closeModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('active');
  }
};