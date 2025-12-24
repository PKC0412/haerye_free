# Haerye (해례) - Korean Learning PWA

> **An All-in-One Progressive Web App for Learning Korean**  
> Structured learning path from absolute beginner to low-intermediate level.

---

## 🌐 Quick Start

**Web App URL**: https://www.haerye.com/

Access instantly in your browser or install on your home screen to use like a native app.

---

## ✨ Key Features

### Learning Modules
- **Hangul**: Learn consonants (19), vowels (21), and finals
- **Vocabulary**: 300+ words across 15 categories (greetings, food, people, places, school, time, transportation, numbers, colors, body, nature, adjectives, verbs)
- **Grammar**: 11 systematically organized categories (particles, tenses, negation, comparison, conditionals, connectives, endings, quotations, voice, sentence structure)
- **Flashcards**: Spaced repetition learning system
- **Learning Statistics**: Daily/weekly trends, mastery analysis, personalized recommendations

### Multilingual Support
Full interface available in 11 languages:
- 🇬🇧 English
- 🇩🇪 Deutsch (German)
- 🇪🇸 Español (Spanish)
- 🇫🇷 Français (French)
- 🇮🇹 Italiano (Italian)
- 🇯🇵 日本語 (Japanese)
- 🇳🇱 Nederlands (Dutch)
- 🇵🇹 Português (Portuguese)
- 🇷🇺 Русский (Russian)
- 🇹🇭 ไทย (Thai)
- 🇨🇳 中文 (Chinese)

### PWA Features
- ✅ Partial offline support (Service Worker)
- ✅ Installable to home screen
- ✅ Fast loading speeds
- ✅ Automatic light/dark theme switching
- ✅ TTS pronunciation support
- ✅ Responsive design (optimized for PC/mobile)

---

## 📁 Project Structure

```
Haerye/
├── index.html                      # App entry point
├── config.js                       # Global configuration
├── i18n.js                        # i18n initialization
├── manifest.webmanifest           # PWA manifest
├── service-worker.js              # Offline caching
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── run_pkc_local_server.bat       # Local server script
├── release-notes.txt              # Version history
├── 9e57927dfecb402f9cfa7b1955ebb644.txt  # Verification file
│
├── assets/                        # Static resources
│   ├── icons/                     # App icons
│   ├── images/                    # Images
│   └── audio/                     # Audio files (if needed)
│
├── css/                           # Stylesheets
│   ├── base/
│   │   ├── variables.css          # CSS variables
│   │   ├── layout.css             # Layout
│   │   └── main.css
│   ├── components/                # Component styles
│   │   ├── header.css
│   │   ├── sidebar.css
│   │   ├── components.base.css
│   │   ├── components.sections.css
│   │   ├── components.modals.css
│   │   ├── components.language-modal.css
│   │   └── components.settings.css
│   └── pages/                     # Page-specific styles
│       ├── grammar.css
│       ├── stats.css
│       ├── stats-trend.css
│       ├── stats-mastery.css
│       ├── stats-grammar-heat.css
│       └── stats-recommend.css
│
├── js/                            # JavaScript
│   ├── core/                      # Core modules
│   │   ├── app.js                 # App initialization
│   │   ├── ui-manager.js          # UI controller
│   │   ├── settings.js            # Settings management
│   │   ├── theme.js               # Theme switching
│   │   ├── language-manager.js    # Language management
│   │   ├── date-utils.js          # Date utilities
│   │   ├── learning-progress.model.js
│   │   ├── learning-progress.storage.js
│   │   ├── learning-progress.runtime.js
│   │   ├── stats-manager.js       # Statistics data
│   │   └── stats-log-manager.js   # Learning logs
│   │
│   ├── renderers/                 # UI renderers
│   │   ├── header-renderer.view.js
│   │   ├── header-renderer.flags.js
│   │   ├── header-renderer.progress.js
│   │   ├── nav-renderer.js
│   │   ├── home-renderer.js
│   │   ├── stats-renderer.js
│   │   ├── stats-trend-renderer.js
│   │   └── modal-renderer.js
│   │
│   └── features/                  # Feature modules
│       ├── hangul-learning.js     # Hangul learning
│       ├── vocabulary-learning.js # Vocabulary learning
│       ├── grammar-data.js        # Grammar data
│       ├── grammar-view.js        # Grammar view
│       ├── grammar-ui.js          # Grammar UI
│       ├── flashcard.js           # Flashcard system
│       ├── speech.js              # TTS speech
│       ├── scroll-button.js       # Scroll button
│       ├── word-mastery-manager.js
│       ├── grammar-mastery-manager.js
│       ├── recommendation-manager.js
│       ├── modal-manager.js
│       ├── modal-interaction.js
│       └── modal-settings-logic.js
│
├── data/                          # Korean learning data (source)
│   ├── consonants.json            # 19 consonants
│   ├── vowels.json                # 21 vowels
│   ├── finals.json                # Final consonants
│   ├── words.json                 # 300+ words
│   └── grammar.json               # Grammar items
│
└── locales/                       # Multilingual translations (11 languages)
    ├── de/                        # German
    ├── en/                        # English
    ├── es/                        # Spanish
    ├── fr/                        # French
    ├── it/                        # Italian
    ├── ja/                        # Japanese
    ├── nl/                        # Dutch
    ├── pt/                        # Portuguese
    ├── ru/                        # Russian
    ├── th/                        # Thai
    └── zh/                        # Chinese
        ├── {lang}.json            # UI translations
        ├── {lang}_consonants.json # Consonant descriptions
        ├── {lang}_vowels.json     # Vowel descriptions
        ├── {lang}_finals.json     # Final descriptions
        ├── {lang}_words.json      # Word translations
        ├── {lang}_grammar.json    # Grammar explanations
        └── {lang}_grammar_examples_*.json  # Grammar examples (11 files)
```

**File Statistics**:
- Root items: 17 (12 files + 5 folders)
- Translation files: 11 languages × 17 files = 187 files
- JS modules: 27 files
- CSS files: 15+ files

---

## 🚀 Running Locally

### 1. Clone Repository
```bash
git clone https://github.com/PKC0412/Haerye.git
cd Haerye
```

### 2. Start Local Server

**Option A: Python Built-in Server**
```bash
python -m http.server 8000
```

**Option B: Batch Script (Windows)**
```bash
run_pkc_local_server.bat
```

**Option C: Node.js (http-server)**
```bash
npx http-server -p 8000
```

### 3. Open in Browser
```
http://localhost:8000
```

---

## 📱 PWA Installation Guide

### Android (Chrome)
1. Access the app in your browser
2. Menu (⋮) → "Add to Home screen"
3. Launch like an app from home screen

### iOS (Safari)
1. Access the app in Safari
2. Share button (⬆️) → "Add to Home Screen"
3. Launch from home screen

> ⚠️ iOS (WebKit-based) may have limited PWA functionality

### Desktop (Chrome/Edge)
1. Click "Install" button in address bar
2. App icon added to Dock/taskbar
3. Launches in app mode without address bar

---

## 🎧 TTS Pronunciation Troubleshooting

This app uses the browser's built-in TTS (Web Speech API).

### Common Issues

**First pronunciation doesn't work, but second attempt does**
- Safari's autoplay restriction (ignores first call)
- Try tapping the button twice

**No sound on iPhone**
- Check silent mode switch (side of iPhone)
- Check volume level
- Settings → Accessibility → Spoken Content → Voices → Download Korean voice

**Korean voice (ko-KR) not installed**
- macOS: System Settings → Accessibility → Spoken Content → Install Korean voice
- Windows: Settings → Time & Language → Speech → Add voices

**Verification (DevTools Console)**
```javascript
speechSynthesis.getVoices().filter(v => v.lang.includes('ko'))
```
If one or more Korean voices appear, it's working correctly.

---

## 🛠 Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 (CSS Variables, Grid, Flexbox)
- **PWA**: Service Worker, Web App Manifest
- **API**: Web Speech API (TTS)
- **Storage**: LocalStorage
- **Fonts**: Noto Sans KR, Noto Serif KR
- **Icons**: Phosphor Icons
- **Hosting**: GitHub Pages

---

## 🌟 Key Highlights

### Fully Static Web App
- No backend server required
- Direct hosting on GitHub Pages
- Fast loading speeds

### Modular Architecture
- **Core**: App initialization, settings, theme, language management
- **Renderers**: Dedicated UI rendering
- **Features**: Modularized learning functions
- Easy to maintain and extend

### Learning Progress Tracking
- Daily/weekly learning logs
- Word/grammar mastery analysis
- Personalized recommendation system
- LocalStorage-based data persistence

### Responsive Design
- Optimized for PC/tablet/mobile
- Automatic dark mode switching
- Intuitive UI/UX

---

## 📊 Learning Statistics

- **Learning Trends**: 7-day/30-day activity graphs
- **Word Mastery**: Category-wise mastery percentages
- **Grammar Heatmap**: Grammar topic frequency visualization
- **Recommendation System**: Auto-suggests areas needing improvement

---

## 🐛 Known Issues

### Language switching suddenly stops working
→ Refresh browser (F5) to resolve

### Pronunciation playback not working
→ Likely related to iOS/Safari/silent mode (see TTS guide above)

---

## 🔮 Future Roadmap

- [ ] AI Tutor feature
- [ ] Intermediate/advanced content expansion
- [ ] Enhanced quiz system
- [ ] Social learning features (leaderboards, etc.)
- [ ] Audio example sentences

---

## 📜 License

This project follows a **Dual License Policy**.

### Non-Commercial & Open Source Use
**GPLv3 License** applies
- Free for personal, academic, and non-profit projects
- Free to analyze/improve/fork code
- Redistribution requires original author attribution

### Commercial Use
Separate **commercial license** required for closed-source commercial products

**Contact**: pkc0412@gmail.com

### What You Can Do
✅ Use freely  
✅ Analyze/improve code  
✅ Fork to create other projects  
✅ Redistribute as open source (with attribution)

### Limitations
❌ No guarantee of commercial-grade stability  
❌ No 24-hour customer support (personal project)  
❌ Some features may not work in certain environments

---

## ✍️ Creator & Contact

**Creator**: PKC  
**Blog**: https://pkc0412.tistory.com/
**Email**: pkc0412@gmail.com

Questions, bug reports, and suggestions are always welcome!

---

## 🙏 Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Release Notes

### v1.3 (2025-12-02)
- Added warning modal for unsupported Korean TTS environments
- Various UI improvements

### v1.2 (2025-11-29)
- Initial public release of PKC Korean Learning
- Full 11-language translation support
- Implemented PWA functionality
- Built learning statistics system

---
