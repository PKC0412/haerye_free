/**
 * ModalInteraction
 * 알림창(Alert), 확인창(Confirm), 축하 효과(Confetti) 등
 * 사용자와의 상호작용 및 시각적 피드백을 담당하는 UI 모듈입니다.
 */
window.ModalInteraction = {
  // 요소 캐싱
  elements: {
    confirmModal: null,
    alertModal: null,
    goalModal: null,
    confettiContainer: null,
    btnGoalConfirm: null,
    confirmMsg: null,
    confirmOk: null,
    confirmCancel: null,
    alertMsg: null,
    alertOk: null
  },

  /**
   * 초기화: 필요한 DOM 요소를 캐싱하고 이벤트를 연결합니다.
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    console.log('[ModalInteraction] Initialized');
  },

  cacheElements() {
    this.elements.confirmModal = document.getElementById('confirmModal');
    this.elements.alertModal = document.getElementById('alertModal');
    this.elements.goalModal = document.getElementById('goalModal');
    this.elements.confettiContainer = document.getElementById('confetti-container');
    this.elements.btnGoalConfirm = document.getElementById('btn-goal-confirm');

    // Confirm 내부 요소
    this.elements.confirmMsg = document.getElementById('confirmModalMessage');
    this.elements.confirmOk = document.getElementById('confirmModalOk');
    this.elements.confirmCancel = document.getElementById('confirmModalCancel');

    // Alert 내부 요소
    this.elements.alertMsg = document.getElementById('alertModalMessage');
    this.elements.alertOk = document.getElementById('alertModalOk');
  },

  bindEvents() {
    // 목표 달성 축하 모달의 확인 버튼
    if (this.elements.btnGoalConfirm) {
      this.elements.btnGoalConfirm.addEventListener('click', () => {
        if (window.ModalManager && this.elements.goalModal) {
          window.ModalManager.closeModal(this.elements.goalModal);
        }
      });
    }
  },

  // ============================================================
  // Custom Modal APIs - Confirm & Alert
  // ============================================================

  /**
   * 확인창(Confirm) 표시
   * @param {string} messageKey - I18n 메시지 키
   * @param {function} onConfirm - 확인 시 실행할 콜백 함수
   */
  showConfirm(messageKey, onConfirm) {
    const { confirmModal, confirmMsg, confirmOk, confirmCancel } = this.elements;

    if (!confirmModal || !window.I18n || !window.I18n.t) return;
    if (!confirmMsg || !confirmOk || !confirmCancel) return;

    // 메시지 설정
    const message = window.I18n.t(messageKey);
    confirmMsg.textContent = message;
    confirmMsg.classList.add('modal-message');

    // 버튼 이벤트 (일회성 바인딩을 위해 onclick 사용)
    confirmOk.onclick = () => {
      if (window.ModalManager) window.ModalManager.closeModal(confirmModal);
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    };

    confirmCancel.onclick = () => {
      if (window.ModalManager) window.ModalManager.closeModal(confirmModal);
    };

    // 모달 열기
    if (window.ModalManager) window.ModalManager.openModal(confirmModal);
  },

  /**
   * 알림창(Alert) 표시
   * @param {string} messageKey - I18n 메시지 키
   * @param {function} onOk - 확인 후 실행할 콜백 (옵션)
   */
  showAlert(messageKey, onOk) {
    const { alertModal, alertMsg, alertOk } = this.elements;

    if (!alertModal || !window.I18n || !window.I18n.t) return;
    if (!alertMsg || !alertOk) return;

    // 메시지 설정
    const message = window.I18n.t(messageKey);
    alertMsg.textContent = message;
    alertMsg.classList.add('modal-message');

    // 버튼 이벤트
    alertOk.onclick = () => {
      if (window.ModalManager) window.ModalManager.closeModal(alertModal);
      if (typeof onOk === 'function') {
        onOk();
      }
    };

    // 모달 열기
    if (window.ModalManager) window.ModalManager.openModal(alertModal);
  },

  // ============================================================
  // Celebration Effects
  // ============================================================

  /**
   * 목표 달성 축하 모달 및 폭죽 효과 실행
   */
  showCelebration() {
    if (this.elements.goalModal && window.ModalManager) {
      window.ModalManager.openModal(this.elements.goalModal);
      this.startConfetti();
    }
  },

  /**
   * 폭죽 애니메이션 생성
   */
  startConfetti() {
    const container = this.elements.confettiContainer;
    if (!container) return;

    container.innerHTML = ''; // 기존 폭죽 초기화

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');

      // 랜덤 속성 부여 (위치, 색상, 애니메이션 속도)
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'; // 2~4초

      container.appendChild(confetti);
    }
  }
};