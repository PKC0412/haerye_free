// Learning Progress - Storage & Persistence
(function(global) {
  const LearningProgress = global.LearningProgress || (global.LearningProgress = {});

  LearningProgress.loadProgress = function() {
    try {
      const saved = localStorage.getItem('app-progress');

      // 기본 진행 데이터
      const defaultData = {
        percent: 0,
        streak: 0,
        lastStudyDate: null,
        totalItems: 50,
        completedItems: 0,
        completedItemKeys: [],
        goals: {
          hangul: 10,
          vocabulary: 20,
          grammar: 20
        },
        completedByCategory: {
          hangul: 0,
          vocabulary: 0,
          grammar: 0
        },
        lastSection: null,
        goalCelebrated: false
      };

      if (saved) {
        const parsed = JSON.parse(saved) || {};
        this.progressData = { ...defaultData, ...parsed };

        // 중첩 객체(goals, completedByCategory)는 한 번 더 머지
        this.progressData.goals = {
          ...defaultData.goals,
          ...(parsed.goals || {})
        };
        this.progressData.completedByCategory = {
          ...defaultData.completedByCategory,
          ...(parsed.completedByCategory || {})
        };
      } else {
        this.progressData = { ...defaultData };
      }

      // 신규 필드 보정
      if (!Array.isArray(this.progressData.completedItemKeys)) {
        this.progressData.completedItemKeys = [];
      }
      if (!this.progressData.completedByCategory) {
        this.progressData.completedByCategory = {
          hangul: 0,
          vocabulary: 0,
          grammar: 0
        };
      }

      // 전체 목표량은 goals 합계 기준으로 보정
      const goals = this.progressData.goals || {};
      const totalGoal = (goals.hangul || 0) + (goals.vocabulary || 0) + (goals.grammar || 0);
      this.progressData.totalItems = totalGoal > 0 ? totalGoal : 50;

      this.checkDateAndReset();        // 날짜 체크 및 일일 목표 리셋
      this.saveProgress(this.progressData); // 퍼센트 보정 및 저장 + UI 업데이트
    } catch (e) {
      console.error('[LearningProgress] Failed to load progress:', e);
    }
  };

  LearningProgress.saveProgress = function(newData) {
    try {
      // 진행 데이터 병합
      this.progressData = { ...this.progressData, ...newData };

      // goals / completedByCategory 보정
      const defaultGoals = { hangul: 10, vocabulary: 20, grammar: 20 };
      this.progressData.goals = {
        ...defaultGoals,
        ...(this.progressData.goals || {})
      };
      const defaultCompletedByCat = { hangul: 0, vocabulary: 0, grammar: 0 };
      this.progressData.completedByCategory = {
        ...defaultCompletedByCat,
        ...(this.progressData.completedByCategory || {})
      };

      // 전체 목표량 = goals 합계
      const goals = this.progressData.goals;
      const totalGoal = (goals.hangul || 0) + (goals.vocabulary || 0) + (goals.grammar || 0);
      this.progressData.totalItems = totalGoal > 0 ? totalGoal : 50;

      // 퍼센트 재계산 (최대 100%)
      if (this.progressData.totalItems > 0) {
        const pct = Math.floor(
          (this.progressData.completedItems / this.progressData.totalItems) * 100
        );
        this.progressData.percent = Math.min(100, pct);
      } else {
        this.progressData.percent = 0;
      }

      // [신규] 100% 달성 체크 및 이벤트 발생 (단, 아직 축하하지 않은 경우에만)
      if (this.progressData.percent >= 100 && !this.progressData.goalCelebrated) {
          this.progressData.goalCelebrated = true;
          // 이벤트를 통해 ModalManager 등에 알림
          window.dispatchEvent(new CustomEvent('goalReached'));
      }

      localStorage.setItem('app-progress', JSON.stringify(this.progressData));
      this.notifyProgressUpdate();
    } catch (e) {
      console.error('[LearningProgress] Failed to save progress:', e);
    }
  };

  LearningProgress.checkDateAndReset = function() {
    if (!window.DateUtils) return;

    const today = DateUtils.getTodayDate();
    const lastDate = this.progressData.lastStudyDate;

    // 마지막 학습일 정보가 없으면 배열/카테고리만 보정
    if (!lastDate) {
      if (!Array.isArray(this.progressData.completedItemKeys)) {
        this.progressData.completedItemKeys = [];
      }
      if (!this.progressData.completedByCategory) {
        this.progressData.completedByCategory = {
          hangul: 0,
          vocabulary: 0,
          grammar: 0
        };
      }
      return;
    }

    // "마지막 학습일"과 오늘이 다르면, '오늘의 목표'는 새로 시작
    if (lastDate !== today) {
      console.log('[LearningProgress] New day detected on load. Resetting daily progress only.');
      this.resetDailyProgressForNewDay();
    }
  };

})(window);
