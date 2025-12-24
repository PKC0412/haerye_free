// Header Renderer - Progress & UI Updates
(function(global) {
  const HeaderRenderer = global.HeaderRenderer || (global.HeaderRenderer = {});

  HeaderRenderer.updateUI = function(data) {

          const circle = document.getElementById('mobile-progress-circle');
          const text = document.getElementById('mobile-progress-text');
          const streak = document.getElementById('mobile-streak-text');

          // 번역 헬퍼: 번역된 값이 키(Key)와 같으면(번역 실패 시) 기본 텍스트 반환
          const t = (key, defaultText) => {
              if (window.I18n && typeof window.I18n.t === 'function') {
                  const val = window.I18n.t(key);
                  // 번역 결과가 없거나, 키값 그대로 나오면 defaultText 사용
                  if (!val || val === key) return defaultText;
                  return val;
              }
              return defaultText;
          };

          if (circle && text && streak) {
              const radius = 20;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (data.percent / 100) * circumference;

              circle.style.strokeDashoffset = offset;
              text.textContent = `${data.percent}%`;

              // 1. Streak 부분 업데이트 (번역 키와 함께 텍스트도 직접 주입)
              // t() 함수가 키 대신 '연속 학습', '일째'를 반환하도록 보장함
              const streakLabel = t('nav.streak', '연속 학습');
              const daySuffix = t('nav.day_suffix', '일째');
              streak.innerHTML = `<span data-i18n="nav.streak">${streakLabel}</span> ${data.streak}<span data-i18n="nav.day_suffix">${daySuffix}</span> 🔥`;

              // 2. [강제 적용] '오늘의 목표' 텍스트 강제 업데이트
              const goalLabel = document.querySelector('.progress-info .progress-label');
              if (goalLabel) {
                  goalLabel.textContent = t('nav.goal', '오늘의 목표');
                  goalLabel.setAttribute('data-i18n', 'nav.goal'); // 속성 유지
              }

              // 3. [강제 적용] '이어하기' 버튼 텍스트 강제 업데이트
              const continueBtn = document.querySelector('.progress-summary-card .continue-btn');
              if (continueBtn) {
                  continueBtn.textContent = t('nav.continue', '이어하기');
                  continueBtn.setAttribute('data-i18n', 'nav.continue'); // 속성 유지
              }

              // 4. 마지막 안전장치: I18n.apply() 호출
              if (window.I18n && typeof window.I18n.apply === 'function') {
                  window.I18n.apply();
              }
          }
  };

})(window);
