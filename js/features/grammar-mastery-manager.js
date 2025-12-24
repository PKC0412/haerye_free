// Grammar Mastery Manager (CORE - upgraded)
// GrammarUI에서 선택한 문법 유닛 정보를 기반으로 카테고리별 숙련도를 관리합니다.
// - 로컬 스토리지 키: 'pkc-grammar-mastery'
// - recordUnitStudy: 유닛 단위 학습 기록
// - getCategoryHeatmap: 최근 학습 여부 기반 레벨 산출 (0/1/2)
window.GrammarMasteryManager = {
  storageKey: 'pkc-grammar-mastery',
  _data: null,

  init() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this._data = raw ? JSON.parse(raw) : { categories: {}, units: {}, lastUpdated: null };
    } catch (e) {
      console.warn('[GrammarMasteryManager] Failed to load data:', e);
      this._data = { categories: {}, units: {}, lastUpdated: null };
    }
  },

  _ensureInit() {
    if (!this._data) this.init();
    if (!this._data.categories) this._data.categories = {};
    if (!this._data.units) this._data.units = {};
  },

  _save() {
    try {
      this._data.lastUpdated = Date.now();
      localStorage.setItem(this.storageKey, JSON.stringify(this._data));
    } catch (e) {
      console.warn('[GrammarMasteryManager] Failed to save data:', e);
    }
  },

  /**
   * 문법 유닛 학습 기록
   * @param {string} unitId
   * @param {string} categoryId
   * @param {string} categoryLabel - 현재 UI에 표시되는 카테고리 레이블 (기본 한국어)
   */
  recordUnitStudy(unitId, categoryId, categoryLabel) {
    if (!unitId || !categoryId) return;
    this._ensureInit();

    const now = Date.now();
    const units = this._data.units;
    const cats = this._data.categories;

    // 유닛 단위 기록
    const unitEntry = units[unitId] || {
      id: unitId,
      categoryId,
      timesStudied: 0,
      lastStudiedAt: null
    };
    unitEntry.categoryId = categoryId;
    unitEntry.timesStudied = (unitEntry.timesStudied || 0) + 1;
    unitEntry.lastStudiedAt = now;
    units[unitId] = unitEntry;

    // 카테고리 단위 집계
    const catEntry = cats[categoryId] || {
      id: categoryId,
      label: categoryLabel || categoryId,
      studiedUnits: 0,
      totalStudies: 0,
      lastStudiedAt: null
    };

    // label 최신값으로 업데이트
    if (categoryLabel) catEntry.label = categoryLabel;

    // distinct 유닛 수 갱신:
    // timesStudied가 1이 되는 시점 = 해당 유닛을 처음 학습했을 때
    if (unitEntry.timesStudied === 1) {
      catEntry.studiedUnits = (catEntry.studiedUnits || 0) + 1;
    }

    catEntry.totalStudies = (catEntry.totalStudies || 0) + 1;
    catEntry.lastStudiedAt = now;
    cats[categoryId] = catEntry;

    this._save();
  },

  /**
   * 문법 카테고리별 히트맵 레벨 반환
   * level: 0 (부족), 1 (보통), 2 (잘함)
   * - 최근 30일 이내에 학습한 유닛 수를 기준으로 산정
   *   · recentUnits == 0 → 0 (부족)
   *   · 1~2개 → 1 (보통)
   *   · 3개 이상 → 2 (잘함)
   */
  getCategoryHeatmap() {
    this._ensureInit();
    const cats = this._data.categories || {};
    const units = this._data.units || {};
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const unitList = Object.values(units);

    return Object.values(cats).map(cat => {
      // 이 카테고리에 속한 유닛 중, 최근 30일 내에 학습된 유닛 수 계산
      const recentUnits = unitList.filter(u => {
        if (!u || u.categoryId !== cat.id) return false;
        if (!u.lastStudiedAt) return false;
        const diff = now - u.lastStudiedAt;
        return diff >= 0 && diff <= THIRTY_DAYS;
      }).length;

      let level = 0;
      if (recentUnits >= 3) level = 2;
      else if (recentUnits >= 1) level = 1;

      return {
        id: cat.id,
        label: cat.label || cat.id,
        level
      };
    });
  }
};

// 자동 초기화
if (window.GrammarMasteryManager) {
  window.GrammarMasteryManager.init();
}
