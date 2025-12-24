// Learning Progress - Core State & Utilities
(function(global) {
  const LearningProgress = global.LearningProgress || (global.LearningProgress = {});

  // ---------------------------------------------------------------------------
  // Score Rules (Daily)
  // - Hangul:     cap 15, 1 click = 1 point
  // - Vocabulary: cap 15, 1 click = 1 point
  // - Flashcard:  cap 35, 1 click = 2.5 points
  // - Grammar:    cap 35, 1 click = 2.5 points
  // ---------------------------------------------------------------------------
  LearningProgress.scoreRules = {
    hangul: { cap: 15, perClick: 1 },
    vocabulary: { cap: 15, perClick: 1 },
    flashcard: { cap: 35, perClick: 2.5 },
    grammar: { cap: 35, perClick: 2.5 }
  };

  LearningProgress.getScoreBreakdown = function(completedByCategory) {
    const rules = this.scoreRules || {};
    const counts = completedByCategory || {};

    const calc = (cat) => {
      const r = rules[cat] || { cap: 0, perClick: 0 };
      const count = Number(counts[cat] || 0);
      const raw = count * Number(r.perClick || 0);
      const capped = Math.min(Number(r.cap || 0), raw);
      return {
        count,
        perClick: Number(r.perClick || 0),
        cap: Number(r.cap || 0),
        points: capped
      };
    };

    return {
      hangul: calc('hangul'),
      vocabulary: calc('vocabulary'),
      flashcard: calc('flashcard'),
      grammar: calc('grammar')
    };
  };

  LearningProgress.getTotalScore = function(completedByCategory) {
    const b = this.getScoreBreakdown(completedByCategory);
    const total = (b.hangul.points || 0)
      + (b.vocabulary.points || 0)
      + (b.flashcard.points || 0)
      + (b.grammar.points || 0);
    return Math.min(100, total);
  };

  LearningProgress.getPercentFromScore = function(score) {
    const n = Number(score || 0);
    return Math.max(0, Math.min(100, Math.floor(n)));
  };

  LearningProgress.progressData = {
      percent: 0,
      score: 0,
      streak: 0,
      lastStudyDate: null,
  
      // 전체 목표량 (goals 합계, 기본 50개)
      totalItems: 50,
      completedItems: 0,
  
      // 오늘 완료 처리된 항목 키 목록 (중복 카운트 방지용)
      completedItemKeys: [],
  
      // 카테고리별 일일 목표
      goals: {
        hangul: 10,
        vocabulary: 20,
        flashcard: 20,
        grammar: 20
      },
  
      // 카테고리별 완료 개수
      completedByCategory: {
        hangul: 0,
        vocabulary: 0,
        flashcard: 0,
        grammar: 0
      },
  
      // 오늘 마지막으로 학습한 섹션 (이어하기용)
      lastSection: null,
      
      // [신규] 오늘의 목표 달성 축하 메시지를 보았는지 여부
      goalCelebrated: false
    };

  LearningProgress.resetDailyProgressForNewDay = function() {
    this.progressData.completedItems = 0;
    this.progressData.percent = 0;
    this.progressData.score = 0;
    this.progressData.completedItemKeys = [];
    this.progressData.goalCelebrated = false; // 리셋 시 축하 상태 초기화

    // 카테고리별 완료 수 리셋
    this.progressData.completedByCategory = {
      hangul: 0,
      vocabulary: 0,
      flashcard: 0,
      grammar: 0
    };
  };

  LearningProgress.mapCategoryToSection = function(category) {
    switch (category) {
      case 'hangul':
        return 'hangul-section';
      case 'vocabulary':
        return 'vocabulary-section';
      case 'flashcard':
        return 'flashcard-section';
      case 'grammar':
        return 'grammar-section';
      default:
        return 'vocabulary-section';
    }
  };

  LearningProgress.notifyProgressUpdate = function() {
    const event = new CustomEvent('progressUpdated', { detail: this.progressData });
    window.dispatchEvent(event);
  };

  LearningProgress.getSummaryData = function() {
    return this.progressData;
  };

})(window);
