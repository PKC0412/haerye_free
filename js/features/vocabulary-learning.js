// Vocabulary Learning Module (Global Object)
window.VocabularyLearning = {
  words: [],
  currentCategory: 'all',
  categories: [],
  isInitialized: false,

  async initialize() {
    await this.loadWords();
    this.extractCategories();
    this.render();
    this.isInitialized = true;
    console.log('[Vocabulary] Initialized');
  },

  async loadWords() {
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
      
      this.words = rawData.map(item => ({
        ...item,
        meaning: item[targetKey] || item.English || item.english || item.Japanese || ''
      }));

    } catch (error) {
      console.error('[Vocabulary] Load failed:', error);
      this.words = [];
    }
  },

  extractCategories() {
    const categorySet = new Set(['all']);
    if (Array.isArray(this.words)) {
        this.words.forEach(w => { if (w.category) categorySet.add(w.category); });
    }
    this.categories = Array.from(categorySet);
  },

  render() {
    const container = document.getElementById('vocabulary-container');
    if (!container) return;

    if (!this.words || this.words.length === 0) {
      this.renderError();
      return;
    }

    const filteredWords = this.currentCategory === 'all'
        ? this.words
        : this.words.filter(w => w.category === this.currentCategory);

    const CATEGORY_EN_TO_KO = {
        all: '전체', greetings: '인사', basic: '기본', food: '음식', people: '사람',
        places: '장소', transportation: '교통', verbs_daily: '일상 동사', verbs_actions: '행동 동사',
        adjectives: '형용사', numbers: '숫자', time: '시간', colors: '색깔', body: '신체',
        nature: '자연', school: '학교'
    };

    const categoryTabs = this.categories.map(category => {
        const isActive = this.currentCategory === category;
        let displayLabel = category;
        const koLabel = CATEGORY_EN_TO_KO[category] || category;
        
        if (window.I18n) {
            const translated = I18n.t(koLabel);
            if (translated !== koLabel) {
                displayLabel = translated;
            } else {
                 const catKeyTranslated = I18n.t(`category.${category}`);
                 if (catKeyTranslated !== `category.${category}`) {
                     displayLabel = catKeyTranslated;
                 } else {
                     if (window.I18n.currentLang === 'ko') displayLabel = koLabel;
                 }
            }
        }

        return `<button class="vocab-category-btn ${isActive ? 'active' : ''}" onclick="window.VocabularyLearning.setCategory('${category}')">${displayLabel}</button>`;
    }).join('');

    const playLabelKey = 'vocab.play';
    const playLabel = (window.I18n && I18n.t(playLabelKey) !== playLabelKey) ? I18n.t(playLabelKey) : '발음 듣기';

    const wordCards = filteredWords.map(word => `
        <div class="vocab-card">
          <div class="vocab-body" role="region" aria-label="단어 정보">
            <div class="vocab-korean">${word.korean}</div>
            <div class="vocab-translation">${word.meaning}</div>
            <div class="vocab-romanization">${word.romanization}</div>
          </div>
          <div class="vocab-footer">
            <button class="vocab-play-btn" title="${playLabel}" aria-label="${playLabel}" onclick="window.VocabularyLearning.speak('${word.korean}')"><span class="vocab-play-icon" aria-hidden="true">🔊</span><span class="vocab-play-text" title="${playLabel}">${playLabel}</span></button>
          </div>
        </div>
    `).join('');

    container.innerHTML = `<div class="vocab-category-tabs">${categoryTabs}</div><div class="vocab-list">${wordCards}</div>`;
  },

  renderError() {
    const container = document.getElementById('vocabulary-container');
    if(container) container.innerHTML = `<div class="vocab-error"><p>⚠️ 데이터를 불러올 수 없습니다.</p></div>`;
  },

  setCategory(cat) { this.currentCategory = cat; this.render(); },

  speak(text) {
    if (!text) return;
    if (window.SpeechSynthesisManager) SpeechSynthesisManager.speak(text);
    else {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ko-KR';
        window.speechSynthesis.speak(u);
    }
  }
};