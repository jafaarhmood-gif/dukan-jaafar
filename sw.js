const CACHE = 'dukan-jaafar-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  // مرر الطلب للشبكة مباشرة (بدون تخزين مؤقت) — وجوده كافي لتفعيل شرط التثبيت بأندرويد
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
