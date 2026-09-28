// Service Worker لتطبيق دُكَّان جهفر
// الهدف: أي تحديث نسويه على الموقع يوصل تلقائيًا للعميل اللي مضيف اختصار
// على شاشته الرئيسية، بدون ما يحتاج يمسح الاختصار ويسويه من جديد.
const CACHE_NAME = 'dukan-jaafar-v1';
const APP_SHELL = [
  './dukan-jaafar-firebase.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// شبكة أولًا (Network First): كل مرة يفتح فيها التطبيق ومتوفر انترنت،
// يجيب آخر نسخة محدثة من السيرفر مباشرة. إذا ماكو انترنت، يرجع للنسخة المحفوظة بالكاش.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
