// Header Renderer - Flags Data
(function(global) {
  const HeaderRenderer = global.HeaderRenderer || (global.HeaderRenderer = {});

  // 공통 국기 데이터 (헤더 & 모달 공용)
  HeaderRenderer.flags = {
    ko: `<svg class="lang-flag" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#ffffff"/>
      <circle cx="450" cy="300" r="120" fill="#c60c30"/>
      <path d="M 450 180 A 120 120 0 0 1 450 420 A 60 60 0 0 1 450 300 A 60 60 0 0 0 450 180 Z" fill="#003478"/>
      <circle cx="450" cy="240" r="60" fill="#c60c30"/>
      <circle cx="450" cy="360" r="60" fill="#003478"/>
      <g transform="translate(225, 150) rotate(-56.3)">
        <rect x="-60" y="-8" width="120" height="16" fill="#000"/>
        <rect x="-60" y="16" width="120" height="16" fill="#000"/>
        <rect x="-60" y="40" width="120" height="16" fill="#000"/>
      </g>
      <g transform="translate(675, 450) rotate(-56.3)">
        <rect x="-60" y="-8" width="54" height="16" fill="#000"/>
        <rect x="6" y="-8" width="54" height="16" fill="#000"/>
        <rect x="-60" y="16" width="54" height="16" fill="#000"/>
        <rect x="6" y="16" width="54" height="16" fill="#000"/>
        <rect x="-60" y="40" width="54" height="16" fill="#000"/>
        <rect x="6" y="40" width="54" height="16" fill="#000"/>
      </g>
      <g transform="translate(675, 150) rotate(56.3)">
        <rect x="-60" y="-8" width="54" height="16" fill="#000"/>
        <rect x="6" y="-8" width="54" height="16" fill="#000"/>
        <rect x="-60" y="16" width="120" height="16" fill="#000"/>
        <rect x="-60" y="40" width="54" height="16" fill="#000"/>
        <rect x="6" y="40" width="54" height="16" fill="#000"/>
      </g>
      <g transform="translate(225, 450) rotate(56.3)">
        <rect x="-60" y="-8" width="120" height="16" fill="#000"/>
        <rect x="-60" y="16" width="54" height="16" fill="#000"/>
        <rect x="6" y="16" width="54" height="16" fill="#000"/>
        <rect x="-60" y="40" width="120" height="16" fill="#000"/>
      </g>
    </svg>`,

    en: `<svg class="lang-flag" viewBox="0 0 7410 3900" xmlns="http://www.w3.org/2000/svg">
      <rect width="7410" height="3900" fill="#b22234"/>
      <path d="M0,450H7410M0,1350H7410M0,2250H7410M0,3150H7410" stroke="#fff" stroke-width="300"/>
      <rect width="2964" height="2100" fill="#3c3b6e"/>
      <g fill="#fff">
        <g id="s18">
          <g id="s9">
            <g id="s5">
              <g id="s4">
                <path id="s" d="M247,90 317,305 88,138 369,138 140,305z"/>
                <use href="#s" x="494"/>
                <use href="#s" x="988"/>
                <use href="#s" x="1482"/>
              </g>
              <use href="#s" x="1976"/>
            </g>
            <use href="#s5" y="420"/>
            <use href="#s4" y="840"/>
            <use href="#s5" y="1260"/>
          </g>
          <use href="#s9" y="420"/>
        </g>
        <use href="#s18" y="420"/>
        <use href="#s9" x="247" y="210"/>
      </g>
    </svg>`,

    zh: `<svg class="lang-flag" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#de2910"/>
      <g transform="translate(150, 150)" fill="#ffde00">
        <path d="M0,-96 22,-28 91,-28 35,13 56,81 0,40 -56,81 -35,13 -91,-28 -22,-28z"/>
        <g transform="rotate(-30) translate(120,0) rotate(30)">
          <path d="M0,-24 5,-7 23,-7 9,3 14,20 0,10 -14,20 -9,3 -23,-7 -5,-7z"/>
        </g>
        <g transform="rotate(-5) translate(144,0) rotate(5)">
          <path d="M0,-24 5,-7 23,-7 9,3 14,20 0,10 -14,20 -9,3 -23,-7 -5,-7z"/>
        </g>
        <g transform="rotate(20) translate(144,0) rotate(-20)">
          <path d="M0,-24 5,-7 23,-7 9,3 14,20 0,10 -14,20 -9,3 -23,-7 -5,-7z"/>
        </g>
        <g transform="rotate(45) translate(120,0) rotate(-45)">
          <path d="M0,-24 5,-7 23,-7 9,3 14,20 0,10 -14,20 -9,3 -23,-7 -5,-7z"/>
        </g>
      </g>
    </svg>`,

    ja: `<svg class="lang-flag" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#fff"/>
      <circle cx="450" cy="300" r="180" fill="#bc002d"/>
    </svg>`,

    ru: `<svg class="lang-flag" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#fff"/>
      <rect y="200" width="900" height="400" fill="#0039a6"/>
      <rect y="400" width="900" height="200" fill="#d52b1e"/>
    </svg>`,

    es: `<svg class="lang-flag" viewBox="0 0 750 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="500" fill="#c60b1e"/>
      <rect y="125" width="750" height="250" fill="#ffc400"/>
    </svg>`,

    fr: `<svg class="lang-flag" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#fff"/>
      <rect width="300" height="600" fill="#0055a4"/>
      <rect x="600" width="300" height="600" fill="#ef4135"/>
    </svg>`,

    it: `<svg class="lang-flag" viewBox="0 0 1500 1000" xmlns="http://www.w3.org/2000/svg">
      <rect width="1500" height="1000" fill="#fff"/>
      <rect width="500" height="1000" fill="#009246"/>
      <rect x="1000" width="500" height="1000" fill="#ce2b37"/>
    </svg>`,

    de: `<svg class="lang-flag" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="1000" height="600" fill="#ffce00"/>
      <rect width="1000" height="400" fill="#dd0000"/>
      <rect width="1000" height="200" fill="#000"/>
    </svg>`,

    th: `<svg class="lang-flag" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#f4f5f8"/>
      <rect y="100" width="900" height="400" fill="#2d2a4a"/>
      <rect y="200" width="900" height="200" fill="#a51931"/>
      <rect width="900" height="600" fill="#2d2a4a"/>
      <rect y="0" width="900" height="100" fill="#a51931"/>
      <rect y="500" width="900" height="100" fill="#a51931"/>
      <rect y="100" width="900" height="100" fill="#f4f5f8"/>
      <rect y="400" width="900" height="100" fill="#f4f5f8"/>
    </svg>`,

    pt: `<svg class="lang-flag" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#ff0000"/>
      <rect width="240" height="400" fill="#006600"/>
      <circle cx="240" cy="200" r="60" fill="#ffcc00"/>
    </svg>`,

    nl: `<svg class="lang-flag" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#fff"/>
      <rect width="900" height="200" fill="#ae1c28"/>
      <rect y="400" width="900" height="200" fill="#21468b"/>
    </svg>`
  };
})(window);
