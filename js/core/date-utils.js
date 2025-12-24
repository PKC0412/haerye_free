// Date / Time Utility Module
// 로컬 타임존 기준 날짜 계산 유틸
window.DateUtils = {
  // 오늘 날짜(로컬 기준)를 YYYY-MM-DD 문자열로 반환
  getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 'YYYY-MM-DD' -> Date 객체(로컬 자정 기준)
  parseDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    return new Date(y, m - 1, d);
  },

  // 두 날짜 문자열 사이의 일 수 차이 (to - from)
  getDayDiff(fromStr, toStr) {
    const fromDate = this.parseDate(fromStr);
    const toDate = this.parseDate(toStr);
    if (!fromDate || !toDate) return 0;
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = Math.round((toDate.getTime() - fromDate.getTime()) / msPerDay);
    return diff;
  }
};
