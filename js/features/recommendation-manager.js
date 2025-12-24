// Recommendation Manager (CORE)
// 통계/숙련도 데이터를 기반으로 개인화 추천 카드를 생성합니다.
window.RecommendationManager = {
  /**
   * 추천 카드 리스트 반환
   * 각 카드: { id, type, title, description, actionSection }
   * @param {Object} [options]
   * @param {number} [options.maxCards] - 최대 몇 장까지 보여줄지 (기본 3장)
   */
  getRecommendations(options) {
    const opts = options || {};
    const maxCards = typeof opts.maxCards === 'number' ? opts.maxCards : 3;

    const cards = [];

    const stats = (window.StatsManager && window.StatsManager.getStats)
      ? window.StatsManager.getStats()
      : { percent: 0, lastSection: null };

    const wordSummary = (window.WordMasteryManager && window.WordMasteryManager.getSummary)
      ? window.WordMasteryManager.getSummary()
      : null;

    const grammarHeat = (window.GrammarMasteryManager && window.GrammarMasteryManager.getCategoryHeatmap)
      ? window.GrammarMasteryManager.getCategoryHeatmap()
      : [];

    // 다국어 지원 헬퍼 함수
    const t = (key, fallback) => {
      if (window.I18n && typeof window.I18n.t === 'function') {
        const result = window.I18n.t(key);
        if (result !== key) return result;
      }
      return fallback;
    };

    // 1) 오늘 목표가 100% 미만이면, 이어하기 추천
    if (stats.percent < 100) {
      cards.push({
        id: 'continue-today',
        type: 'today',
        title: t('stats.continue_today_title', '오늘 학습 이어가기'),
        description: t('stats.continue_today_desc', '오늘 설정한 목표를 아직 다 채우지 않았어요. 조금만 더 달려볼까요?'),
        actionSection: stats.lastSection || 'hangul-section'
      });
    }

    // 2) 단어 숙련도가 낮은 경우 → 단어 복습 추천
    if (wordSummary && wordSummary.weakCount > 0) {
      cards.push({
        id: 'review-words',
        type: 'vocabulary',
        title: t('stats.review_words_title', '자주 헷갈리는 단어 복습'),
        description: t('stats.review_words_desc', '최근에 헷갈린 단어들이 있어요. 플래시카드로 가볍게 복습해봐요.'),
        actionSection: 'flashcard-section'
      });
    }

    // 3) 문법 히트맵에서 가장 약한 카테고리 추천
    if (grammarHeat && grammarHeat.length > 0) {
      const sorted = [...grammarHeat].sort((a, b) => (a.level || 0) - (b.level || 0));
      const weakest = sorted[0];
      if (weakest) {
        const categoryLabel = t('grammar_category_' + weakest.id, weakest.label || weakest.id);
        const prefix = t('stats.grammar_focus_prefix', '문법 - ');
        const suffix = t('stats.grammar_focus_suffix', ' 집중 학습');

        cards.push({
          id: 'focus-grammar-' + weakest.id,
          type: 'grammar',
          title: `${prefix}${categoryLabel}${suffix}`,
          description: t('stats.grammar_focus_desc', '다른 영역보다 덜 익숙한 문법 영역이에요. 관련 예문과 설명을 한 번 더 살펴볼까요?'),
          actionSection: 'grammar-section'
        });
      }
    }

    if (cards.length > maxCards) {
      return cards.slice(0, maxCards);
    }
    return cards;
  }
};