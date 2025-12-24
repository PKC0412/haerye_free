// Learning Progress - Runtime & Events
(function(global) {
  const LearningProgress = global.LearningProgress || (global.LearningProgress = {});

  LearningProgress.init = function() {
    this.loadProgress();
    this.startDailyResetWatcher();
    console.log('[LearningProgress] Initialized');
  };

  LearningProgress.startDailyResetWatcher = function() {
    if (!window.DateUtils) return;

    this._lastDateForWatcher = DateUtils.getTodayDate();

    setInterval(() => {
      const today = DateUtils.getTodayDate();
      if (today !== this._lastDateForWatcher) {
        this._lastDateForWatcher = today;

        // 날짜가 바뀌면 '오늘의 목표' 진행률만 새로 시작
        this.resetDailyProgressForNewDay();

        // 전체 목표량 재계산 (goals 합계 기준)
        const goals = this.progressData.goals || {};
        const totalGoal = (goals.hangul || 0) + (goals.vocabulary || 0) + (goals.grammar || 0);
        this.progressData.totalItems = totalGoal > 0 ? totalGoal : 50;

        // 퍼센트 재계산
        if (this.progressData.totalItems > 0) {
          const pct = Math.floor(
            (this.progressData.completedItems / this.progressData.totalItems) * 100
          );
          this.progressData.percent = Math.min(100, pct);
        } else {
          this.progressData.percent = 0;
        }

        try {
          localStorage.setItem('app-progress', JSON.stringify(this.progressData));
        } catch (e) {
          console.warn('[LearningProgress] Failed to persist daily reset:', e);
        }
        this.notifyProgressUpdate();
        console.log('[LearningProgress] Daily reset by watcher (midnight).');
      }
    }, 60 * 1000); // 1분마다 체크
  };

  LearningProgress.completeLearningItem = function(itemKey, currentSection) {
    if (!window.DateUtils) return;

    const today = DateUtils.getTodayDate();
    const lastDate = this.progressData.lastStudyDate;
    let newStreak = this.progressData.streak || 0;

    // 0) 카테고리 판별 (itemKey prefix 기준)
    let category = null;
    if (typeof itemKey === 'string') {
      if (itemKey.startsWith('hangul:')) category = 'hangul';
      else if (itemKey.startsWith('vocab:') || itemKey.startsWith('vocabList:')) category = 'vocabulary';
      else if (itemKey.startsWith('grammar:')) category = 'grammar';
    }

    // 1) 날짜 변화에 따른 '연속 스트릭' 계산 (진짜 연속일 기준)
    if (!lastDate) {
      // 첫 학습
      newStreak = 1;
    } else if (lastDate === today) {
      // 같은 날 다시 학습 → 스트릭 변화 없음
      newStreak = this.progressData.streak || 1;
    } else {
      // 다른 날에 처음 학습하는 경우 → 날짜 차이로 연속 여부 체크
      const diff = DateUtils.getDayDiff(lastDate, today);
      if (diff === 1) {
        // 어제에 이어 오늘도 학습 → 스트릭 +1
        newStreak = (this.progressData.streak || 0) + 1;
      } else {
        // 하루 이상 건너뛴 경우 → 스트릭 리셋 (오늘 1일부터 다시)
        newStreak = 1;
      }
    }

    // 2) 자정 이후 첫 학습 시, 이전 일일 진행도는 0에서 다시 시작
    if (lastDate && lastDate !== today) {
      this.resetDailyProgressForNewDay();
    }

    // 3) 유닛/단어 중복 카운트 방지 + 카테고리별 카운트 증가
    let completedItems = this.progressData.completedItems || 0;
    let completedItemKeys = Array.isArray(this.progressData.completedItemKeys)
      ? [...this.progressData.completedItemKeys]
      : [];

    const defaultCompletedByCat = { hangul: 0, vocabulary: 0, grammar: 0 };
    let completedByCategory = {
      ...defaultCompletedByCat,
      ...(this.progressData.completedByCategory || {})
    };

    const lastSection = currentSection || this.mapCategoryToSection(category);

    // 이미 오늘 완료한 항목이면 카운트 증가 없이 streak/날짜/섹션만 업데이트
    if (itemKey && completedItemKeys.includes(itemKey)) {
      this.saveProgress({
        lastStudyDate: today,
        streak: newStreak,
        completedItemKeys,
        completedByCategory,
        lastSection
      });

    // StatsLogManager: 학습 완료 이벤트 기록
    if (window.StatsLogManager && typeof window.StatsLogManager.logEvent === 'function') {
      const categoryForLog = category || (currentSection === 'hangul-section'
        ? 'hangul'
        : currentSection === 'grammar-section'
          ? 'grammar'
          : 'vocabulary');
      window.StatsLogManager.logEvent('learning_complete', {
        category: categoryForLog,
        itemKey: itemKey,
        date: today
      });
    }

      return;
    }

    if (itemKey) {
      completedItemKeys.push(itemKey);
      completedItems += 1;

      if (category && Object.prototype.hasOwnProperty.call(completedByCategory, category)) {
        completedByCategory[category] = (completedByCategory[category] || 0) + 1;
      }
    } else {
      // itemKey가 없으면 구분 불가 → 전체 카운트만 증가 (카테고리 미지정)
      completedItems += 1;
    }

    this.saveProgress({
      completedItems,
      lastStudyDate: today,
      streak: newStreak,
      completedItemKeys,
      completedByCategory,
      lastSection
    });
  };

})(window);
