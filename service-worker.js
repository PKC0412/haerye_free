const CACHE_NAME = `PKC-Haerye-v\${CONFIG.version}`;

const ASSETS_TO_CACHE = [
  './',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './config.js',

  // CSS 파일들 (현재 구조에 맞게 업데이트)
  './css/base/reset.css',
  './css/base/typography.css',
  './css/base/variables.css',
  './css/components/buttons.css',
  './css/components/cards.css',
  './css/components/forms.css',
  './css/components/modals.css',
  './css/components/base.css',
  './css/components/sections.css',
  './css/pages/hangul.css',
  './css/pages/vocabulary.css',
  './css/pages/grammar.css',
  './css/grammar.css',
  './css/main.css',

  // 데이터 파일들
  './data/consonants.json',
  './data/finals.json',
  './data/vowels.json',
  './data/words.json',

  // 문법 데이터
  './data/grammar/grammar_categories.json',
  './data/grammar/grammar_content_index.json',
  './data/grammar/grammar_content_aux_verbs.json',
  './data/grammar/grammar_content_comparison.json',
  './data/grammar/grammar_content_conditionals.json',
  './data/grammar/grammar_content_connectives.json',
  './data/grammar/grammar_content_ending.json',
  './data/grammar/grammar_content_negation.json',
  './data/grammar/grammar_content_particles.json',
  './data/grammar/grammar_content_quotations.json',
  './data/grammar/grammar_content_sentence.json',
  './data/grammar/grammar_content_tenses.json',
  './data/grammar/grammar_content_voice.json',
  './data/grammar/examples/grammar_examples_aux_verbs.json',
  './data/grammar/examples/grammar_examples_comparison.json',
  './data/grammar/examples/grammar_examples_conditionals.json',
  './data/grammar/examples/grammar_examples_connectives.json',
  './data/grammar/examples/grammar_examples_ending.json',
  './data/grammar/examples/grammar_examples_negation.json',
  './data/grammar/examples/grammar_examples_particles.json',
  './data/grammar/examples/grammar_examples_quotations.json',
  './data/grammar/examples/grammar_examples_sentence_structure.json',
  './data/grammar/examples/grammar_examples_tenses.json',
  './data/grammar/examples/grammar_examples_voice.json',

  // 국제화
  './i18n.js',
  './locales/ko.json',
  './locales/en.json',
  './locales/ja.json',
  './locales/zh.json',
  './locales/es.json',
  './locales/fr.json',
  './locales/de.json',
  './locales/pt.json',
  './locales/it.json',
  './locales/ru.json',
  './locales/nl.json',
  './locales/th.json',

  // HTML
  './index.html',

  // 핵심 스크립트 (로드 순서 중요)
  './js/i18n-init.js',

  // 코어 모듈들
  './js/core/settings.js',
  './js/core/theme.js',
  './js/core/learning-progress.js',
  './js/core/learning-stats.js',
  './js/core/learning-mastery.js',
  './js/core/language-manager.js',
  './js/core/modal-manager.js',
  './js/core/ui-manager.js',
  './js/core/app.js',

  // 렌더러들
  './js/renderers/header-renderer.js',
  './js/renderers/header-renderer-flags.js',
  './js/renderers/header-renderer-theme.js',
  './js/renderers/home-renderer.js',
  './js/renderers/nav-renderer.js',
  './js/renderers/modal-renderer.js',

  // 기능 모듈들
  './js/features/modal-interaction.js',
  './js/features/modal-settings-logic.js',
  './js/features/speech.js',
  './js/features/flashcard.js',
  './js/features/hangul-learning.js',
  './js/features/vocabulary-learning.js',
  './js/features/grammar-ui.js'
];

// ✅ 수정: CONFIG에서 버전 동적으로 로드
// config.js가 로드되어야 함 (HTML <head>에서 먼저 로드)
if (typeof CONFIG === 'undefined' || !CONFIG.version) {
  console.warn('[SW] CONFIG not loaded. Using fallback cache name.');
}

self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log(`[SW] Caching ${ASSETS_TO_CACHE.length} assets...`);

      // ✅ 수정: 개별 캐싱으로 오류 처리 (일부 파일 실패해도 계속 진행)
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url).catch(err => {
          console.warn(`[SW] Failed to cache: \${url}`, err);
        }))
      ).then(() => {
        console.log('[SW] Cache installation completed');
      });
    }).catch(err => {
      console.error('[SW] Cache open failed:', err);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      console.log('[SW] Cleaning old caches...');
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log(`[SW] Deleting old cache: \${key}`);
            return caches.delete(key);
          })
      );
    }).catch(err => {
      console.error('[SW] Activation cleanup failed:', err);
    })
  );
});

self.addEventListener('fetch', event => {
  // ✅ 수정: GET 요청만 캐시 (POST, PUT 등은 제외)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // ✅ 수정: 캐시 응답 + 백그라운드 업데이트
        // (선택적: 더 최신 버전이 있는지 확인)
        fetch(event.request)
          .then(response => {
            // 네트워크 응답이 유효하면 캐시 업데이트
            if (response && response.status === 200 && response.type === 'basic') {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, response.clone());
              });
            }
          })
          .catch(() => {
            // 네트워크 실패해도 캐시된 버전 사용
          });

        return cached;
      }

      // 캐시 미스: 네트워크 요청
      return fetch(event.request)
        .then(response => {
          // ✅ 수정: 응답 검증 (null, 404, 500 등 제외)
          if (!response || response.status !== 200) {
            return response;
          }

          // 성공한 응답만 캐시 저장
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(err => {
          // ✅ 수정: 네트워크 오류 + 캐시 미스 시 fallback 페이지
          console.warn('[SW] Fetch failed:', event.request.url, err);

          // 네비게이션 요청이면 fallback 페이지 제공
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html').catch(() => {
              // 최후의 수단: 기본 오류 응답
              return new Response(
                '오프라인 상태입니다. 나중에 다시 시도해주세요.',
                { status: 503, statusText: 'Service Unavailable' }
              );
            });
          }

          // 네비게이션이 아니면 그냥 실패
          return undefined;
        });
    })
  );
});

// ✅ 추가: 메시지 리스너 (캐시 수동 갱신용)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    // 특정 URL들을 명시적으로 캐시
    const urls = event.data.urls || [];
    caches.open(CACHE_NAME).then(cache => {
      Promise.allSettled(urls.map(url => cache.add(url))).then(() => {
        event.ports[0].postMessage({ cached: urls.length });
      });
    });
  }
});

console.log('[SW] Service Worker loaded');
