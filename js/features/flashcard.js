// Flashcard Module (Global Object)
window.Flashcard = {
  allWords: [],
  words: [],
  currentIndex: 0,
  isFlipped: false,
  knownCount: 0,
  unknownCount: 0,
  isInitialized: false,
  sessionSize: 50,
  useShuffled: true,

  getLabel(key, fallback) {
    if (window.I18n && typeof I18n.t === 'function') {
      const value = I18n.t(key);
      if (value && value !== key) return value;
    }
    return fallback;
  },

  async initialize() {
    await this.loadData();
    this.setupSession();
    this.resetProgress();
    this.render();
    this.isInitialized = true;
    console.log('[Flashcard] Initialized');
  },

  async loadData() {
    try {
      const currentLang = (window.I18n && window.I18n.currentLang) ? window.I18n.currentLang : 'ko';
      let path = `locales/${currentLang}/${currentLang}_words.json`;

      if (currentLang === 'ko') {
        path = 'data/words.json'; 
      }

      let response = await fetch(path);
      if (!response.ok) {
        path = 'data/words.json';
        response = await fetch(path);
      }

      const rawData = await response.json();

      const langKeyMap = {
        'en': 'English', 'ja': 'Japanese', 'zh': 'Chinese', 'ru': 'Russian',
        'es': 'Spanish', 'fr': 'French', 'it': 'Italian', 'de': 'German',
        'th': 'Thai', 'pt': 'Portuguese', 'nl': 'Dutch'
      };

      const targetKey = langKeyMap[currentLang] || 'english';

      this.allWords = rawData.map(item => ({
        ...item,
        meaning: item[targetKey] || item.English || item.english || item.Japanese || ''
      }));

    } catch (error) {
      console.error('[Flashcard] Load failed:', error);
      this.allWords = [];
    }
  },

  setupSession() {
    if (!this.allWords || this.allWords.length === 0) {
        this.words = [];
        return;
    }
    let sessionWords = [...this.allWords];
    if (this.useShuffled) {
      sessionWords = this.shuffleArray(sessionWords);
    }
    this.words = sessionWords.slice(0, this.sessionSize);
  },

  shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  getCurrentWord() { return this.words[this.currentIndex] || null; },

  flip() {
    this.isFlipped = !this.isFlipped;
    this.updateCard();
  },

  speakWord() {
    const w = this.getCurrentWord();
    if (w && w.korean) {
        if (window.SpeechSynthesisManager) {
            SpeechSynthesisManager.speak(w.korean);
        } else {
            const u = new SpeechSynthesisUtterance(w.korean);
            u.lang = 'ko-KR';
            window.speechSynthesis.speak(u);
        }
    }
  },

  // '알아요' 버튼 클릭 시 앱 진행률 업데이트 + 중복 카운트 방지용 키 전달
  markAsKnown() {
    this.knownCount++;

    // 현재 단어 기준으로 오늘의 목표 중복 카운트 방지용 키 생성
    const word = this.getCurrentWord();
    let itemKey = null;
    if (word) {
      // 단어 데이터에 id가 있으면 우선 사용, 없으면 한글 표기를 사용
      itemKey = word.id || word.korean || null;
    }

    // 단어 마스터리 기록
    if (window.WordMasteryManager && typeof window.WordMasteryManager.recordResult === 'function' && word) {
      window.WordMasteryManager.recordResult({
        id: word.id,
        korean: word.korean,
        meaning: word.meaning
      }, true);
    }

    // 앱 전체 진행률(오늘의 목표) 업데이트
    if (window.App && typeof window.App.completeLearningItem === 'function') {
      const keyForApp = itemKey ? `vocab:${itemKey}` : null;
      window.App.completeLearningItem(keyForApp);
    }

    this.nextCard();
  },

  markAsUnknown() {
    this.unknownCount++;

    const word = this.getCurrentWord();
    if (window.WordMasteryManager && typeof window.WordMasteryManager.recordResult === 'function' && word) {
      window.WordMasteryManager.recordResult({
        id: word.id,
        korean: word.korean,
        meaning: word.meaning
      }, false);
    }

    this.nextCard();
  },

  nextCard() {
    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++;
      this.isFlipped = false;
      this.updateCard();
    } else {
      this.showCompletion();
    }
  },

  updateCard() {
    const card = document.querySelector('.flashcard');
    const w = this.getCurrentWord();
    if (card && w) {
      card.textContent = this.isFlipped ? w.meaning : w.korean;
      card.classList.toggle('flipped', this.isFlipped);
    }

    const romanEl = document.querySelector('.flashcard-roman');
    if (romanEl && w) {
      romanEl.textContent = w.romanization || '';
    }

    this.updateProgress();
  },

  updateProgress() {
    const el = document.querySelector('.flashcard-progress');
    if (el) {
      const total = this.words.length;
      const completed = this.knownCount + this.unknownCount;
      let labelTemplate = this.getLabel('flashcard.progress.label', '진행도: {done} / {total}');

      if (labelTemplate === 'flashcard.progress.label') {
          const simpleLabel = this.getLabel('flashcard.progress', '진행도');
          labelTemplate = `${simpleLabel}: {done} / {total}`;
      }

      el.textContent = labelTemplate.replace('{done}', completed).replace('{total}', total);
    }
  },

  render() {
    const container = document.getElementById('flashcard-container');
    if (!container) return;

    const word = this.getCurrentWord();

    if (!word) {
      container.innerHTML = `<p style="text-align:center;margin-top:2rem;">${this.getLabel('flashcard.empty', '학습할 단어가 없습니다.')}</p>`;
      return;
    }

    const lblHear = this.getLabel('flashcard.controls.hear', '발음 듣기');
    const lblKnow = this.getLabel('flashcard.controls.know', '알아요');
    const lblDont = this.getLabel('flashcard.controls.dontKnow', '모르겠어요');
    const lblHint = this.getLabel('flashcard.hint.reveal', '카드를 눌러 뜻을 확인하세요.');
    const lblRoman = this.getLabel('flashcard.hint.romanizationLabel', '로마자 표기:');

    let sessTemplate = this.getLabel('flashcard.session.summary', '세션: {current} / {total}');
    const sessionText = sessTemplate.replace('{current}', this.words.length).replace('{total}', this.allWords.length);

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.9rem;">
        <p>${sessionText}</p>
      </div>

      <div class="flashcard-wrapper">
        <div class="flashcard" onclick="window.Flashcard.flip()">
          ${word.korean}
        </div>
      </div>

      <div class="flashcard-controls">
        <button class="btn-speak" onclick="window.Flashcard.speakWord()">
          🔊 ${lblHear}
        </button>
      </div>

      <div class="flashcard-controls">
        <button class="btn-know" onclick="window.Flashcard.markAsKnown()">
          ✓ ${lblKnow}
        </button>
        <button class="btn-dont-know" onclick="window.Flashcard.markAsUnknown()">
          ✗ ${lblDont}
        </button>
      </div>

      <div class="flashcard-progress"></div>

      <div style="text-align: center; color: var(--text-secondary); font-size: 0.9rem; margin-top: 1rem;">
        <p>${lblHint}</p>
        <p style="font-size: 0.85rem; margin-top: 0.5rem;">
          ${lblRoman} <strong class="flashcard-roman">${word.romanization}</strong>
        </p>
      </div>
    `;

    this.updateProgress();
  },

  showCompletion() {
    const container = document.getElementById('flashcard-container');
    const total = this.words.length;
    const acc = total > 0 ? Math.round((this.knownCount / total) * 100) : 0;

    const lblTitle = this.getLabel('flashcard.result.title', '수고하셨어요!');
    let lblComp = this.getLabel('flashcard.result.completed', '{total}개 완료');
    lblComp = lblComp.replace('{total}', total);
    let lblAcc = this.getLabel('flashcard.result.accuracy', '정답률: {accuracy}%');
    lblAcc = lblAcc.replace('{accuracy}', acc);
    const lblRestart = this.getLabel('flashcard.result.restart', '다시 시작하기');

    container.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h2 style="color: var(--accent-tertiary); margin-bottom: 1rem;">
          🎉 ${lblTitle}
        </h2>
        <div style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 1.5rem;">
          <p>${lblComp}</p>
          <p style="margin-top: 1rem;">
            <strong>${lblAcc}</strong>
          </p>
        </div>
        <button class="btn-next" onclick="window.Flashcard.restart()" style="font-size: 1rem; padding: 0.75rem 2rem;">
          ↻ ${lblRestart}
        </button>
      </div>
    `;
  },

  restart() {
    this.setupSession();
    this.currentIndex = 0;
    this.isFlipped = false;
    this.knownCount = 0;
    this.unknownCount = 0;
    this.render();
  },

  resetProgress() {
    this.currentIndex = 0;
    this.isFlipped = false;
    this.knownCount = 0;
    this.unknownCount = 0;
  },

  setSessionSize(size) {
    this.sessionSize = Math.min(size, this.allWords.length);
    this.restart();
  },

  toggleShuffle() {
    this.useShuffled = !this.useShuffled;
    this.restart();
  }
};