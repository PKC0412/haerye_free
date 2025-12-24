window.ModalRenderer = {
  render(containerId = 'modal-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 공통 푸터 HTML
    const footerHtml = `
      <a href="https://discord.gg/Mj6x5sCsYt" target="_blank" rel="noopener noreferrer" class="modal-footer">
        🚀 Discord PKC 해례 Haerye Hub
      </a>
    `;

    // 국기 SVG 데이터 (HeaderRenderer.flags 사용)
    const flags = window.HeaderRenderer?.flags || {};

    // 언어 목록 데이터 (LanguageManager에서 가져오기)
    const langs = window.LanguageManager?.availableLanguages || [];

    // 버튼 HTML 생성 함수
    const generateLanguageButtons = () => {
        return langs.map(l => {
            const flagSvg = flags[l.code] || '';
            const selectedClass = l.code === 'ko' ? ' selected' : ''; 
            const i18nAttr = l.i18n ? ` data-i18n="${l.i18n}"` : '';

            return `<button class="language-option${selectedClass}" data-lang="${l.code}">
                        ${flagSvg}
                        <span${i18nAttr}>${l.name}</span>
                    </button>`;
        }).join('');
    };

    container.innerHTML = `
      <!-- Help Modal -->
      <div id="helpModal" class="modal-overlay">
          <div class="modal-content">
              <span class="modal-close" id="closeHelpModal">✖</span>
              <div class="modal-header">ℹ️ <span data-i18n="help.header">만든이 & 연락처</span></div>
              <p style="margin-bottom:1rem;line-height:1.6;color:var(--text-secondary);" data-i18n="help.description">
                  문의 사항이나 버그 제보, 제안 사항이 있으시면<br>아래 채널로 연락 주세요.
              </p>
              <p style="font-weight:600;margin-bottom:1rem;">
                  <span data-i18n="help.creatorLabel">만든이:</span> PKC
              </p>
              <div class="modal-links">
                  <a href="https://pkc0412.tistory.com/" target="_blank" rel="noopener noreferrer">pkc0412.tistory.com</a>
                  <a href="mailto:pkc0412@gmail.com" target="_blank" rel="noopener noreferrer">pkc0412@gmail.com</a>
              </div>
              ${footerHtml}
          </div>
      </div>

      <!-- Language Modal -->
      <div id="languageModal" class="modal-overlay">
          <div class="modal-content language-modal">
              <span class="modal-close" id="closeLanguageModal">✖</span>
              <div class="modal-header">🌐 <span data-i18n="language.modalTitle">언어 선택</span></div>
              <p class="modal-description" data-i18n="language.modalDescription">
                  인터페이스 언어를 선택하세요.<br>언제든지 변경할 수 있습니다.
              </p>
              <div class="language-grid">
                  ${generateLanguageButtons()}
              </div>
              ${footerHtml}
          </div>
      </div>

      <!-- TTS Warning Modal -->
      <div id="ttsWarningModal" class="modal-overlay">
          <div class="modal-content">
              <span class="modal-close" id="closeTtsWarningModal">✖</span>
              <div class="modal-header"><span data-i18n="ttsWarning.modalTitle">🔊 TTS 알림</span></div>
              <p class="modal-description" data-i18n="ttsWarning.modalDescription">
                  브라우저에서 한국어 음성 TTS(텍스트 음성 변환) 기능을<br>
                  지원하지 않거나 비활성화되어 있습니다.<br><br>
                  소리가 나지 않을 경우,<br>
                  기기 설정에서 <strong>한국어 음성 데이터</strong>를 설치해주세요.
              </p>
              ${footerHtml}
          </div>
      </div>

      <!-- Settings Modal -->
      <div id="settingsModal" class="modal-overlay">
          <div class="modal-content settings-modal">
              <span class="modal-close" id="closeSettingsModal">✖</span>
              <div class="modal-header">⚙️ <span data-i18n="settings.title">설정</span></div>

              <div class="settings-section">
                  <h3 class="settings-label" data-i18n="settings.voice_select_title">목소리 선택</h3>
                  <div class="setting-item">
                      <label data-i18n="settings.voice_label">목소리 (Voice)</label>
                      <select id="sel-voice-ko" class="voice-select">
                          <option value="" data-i18n="settings.default_voice">기본 (Default)</option>
                      </select>
                  </div>
              </div>

              ${footerHtml}
          </div>
      </div>

      <!-- Confirm Modal (for Reset Learning Data) -->
      <div id="confirmModal" class="modal-overlay">
          <div class="modal-content small-modal">
              <span class="modal-close" id="closeConfirmModal">✖</span>
              <div class="modal-header" data-i18n="settings.reset_confirm">정말로 모든 학습 데이터를 초기화하시겠습니까?</div>
              <p id="confirmModalMessage" style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.6; max-width: 100%; margin: 1.5rem 0;">
                  <!-- JS로 동적 주입 -->
              </p>
              <div class="modal-actions">
                  <button id="confirmModalOk" class="btn-danger" style="width: auto; min-width: 120px;" data-i18n="common.confirm">
                      확인
                  </button>
                  <button id="confirmModalCancel" class="btn-secondary" data-i18n="common.cancel">
                      취소
                  </button>
              </div>
          </div>
      </div>

      <!-- Alert Modal (for Success/Error) -->
      <div id="alertModal" class="modal-overlay">
          <div class="modal-content small-modal">
              <span class="modal-close" id="closeAlertModal">✖</span>
              <div class="modal-header" data-i18n="common.alert">알림</div>
              <p id="alertModalMessage" style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.6; max-width: 100%; margin: 1.5rem 0;">
                  <!-- JS로 동적 주입 -->
              </p>
              <div class="modal-actions">
                  <button id="alertModalOk" class="btn-danger" style="width: auto; min-width: 120px;">
                      확인
                  </button>
              </div>
          </div>
      </div>

      <!-- Goal Achievement Modal (Celebration) -->
      <div id="goalModal" class="modal-overlay">
          <div class="modal-content celebration-modal">
              <span class="modal-close" id="closeGoalModal">✖</span>
              <div class="celebration-icon">🎉</div>
              <div class="modal-header" data-i18n="goal.modal_title">축하합니다!</div>
              <p class="modal-description" data-i18n="goal.modal_desc" style="font-size: 1.1rem; margin-bottom: 2rem;">
                  오늘의 목표를 모두 달성하셨습니다!
              </p>
              <button class="celebration-btn" id="btn-goal-confirm" data-i18n="goal.confirm">확인</button>
              <!-- JS로 confetti 요소 동적 추가 예정 -->
              <div id="confetti-container" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; overflow:hidden;"></div>
          </div>
      </div>
    `;
    console.log('[ModalRenderer] Rendered with Unified Flag Data.');
  }
};
