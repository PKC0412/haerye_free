// Word Mastery Manager (CORE)
// 플래시카드 학습 결과를 기반으로 단어 숙련도를 관리합니다.
window.WordMasteryManager = {
  storageKey: 'pkc-word-mastery',
  _data: null,

  init() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this._data = raw ? JSON.parse(raw) : { words: {}, lastUpdated: null };
    } catch (e) {
      console.warn('[WordMasteryManager] Failed to load data:', e);
      this._data = { words: {}, lastUpdated: null };
    }
  },

  _ensureInit() {
    if (!this._data) this.init();
    if (!this._data.words) this._data.words = {};
  },

  _save() {
    try {
      this._data.lastUpdated = Date.now();
      localStorage.setItem(this.storageKey, JSON.stringify(this._data));
    } catch (e) {
      console.warn('[WordMasteryManager] Failed to save data:', e);
    }
  },

  /**
   * 단어 학습 결과 기록
   * @param {Object} word - { id?, korean, meaning }
   * @param {boolean} isCorrect - true: 알고 있음, false: 모름
   */
  recordResult(word, isCorrect) {
    if (!word || !word.korean) return;
    this._ensureInit();

    const key = word.id || word.korean;
    const now = Date.now();
    const entry = this._data.words[key] || {
      id: key,
      korean: word.korean,
      meaning: word.meaning || '',
      correct: 0,
      wrong: 0,
      lastCorrectAt: null,
      lastWrongAt: null
    };

    if (isCorrect) {
      entry.correct += 1;
      entry.lastCorrectAt = now;
    } else {
      entry.wrong += 1;
      entry.lastWrongAt = now;
    }

    this._data.words[key] = entry;
    this._save();
  },

  /**
   * 단어 숙련도 요약 정보 반환
   */
  getSummary() {
    this._ensureInit();
    const result = {
      totalTracked: 0,
      strongCount: 0,
      mediumCount: 0,
      weakCount: 0,
      recentWrongTop: [] // { korean, meaning, wrong, lastWrongAt }
    };

    const words = this._data.words || {};
    const entries = Object.values(words);
    result.totalTracked = entries.length;

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const recentCandidates = [];

    entries.forEach(entry => {
      const totalAttempts = (entry.correct || 0) + (entry.wrong || 0);
      if (totalAttempts === 0) return;

      const accuracy = entry.correct / totalAttempts;

      if (accuracy >= 0.8 && entry.correct >= 2) {
        result.strongCount += 1;
      } else if (accuracy >= 0.4) {
        result.mediumCount += 1;
      } else {
        result.weakCount += 1;
      }

      if (entry.lastWrongAt && (now - entry.lastWrongAt) <= sevenDaysMs) {
        recentCandidates.push(entry);
      }
    });

    recentCandidates.sort((a, b) => (b.lastWrongAt || 0) - (a.lastWrongAt || 0));
    result.recentWrongTop = recentCandidates.slice(0, 10).map(e => ({
      korean: e.korean,
      meaning: e.meaning,
      wrong: e.wrong,
      lastWrongAt: e.lastWrongAt
    }));

    return result;
  }
};

// 자동 초기화
if (window.WordMasteryManager) {
  window.WordMasteryManager.init();
}
