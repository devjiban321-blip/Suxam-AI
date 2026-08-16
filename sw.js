// Minimal service worker for Suxam AI.
// This mainly exists to satisfy PWA requirements (installability, offline shell)
// It does not cache your AI responses — those always come fresh from your Worker.

const CACHE_NAME = "suxam-ai-shell-v1";
const SHELL_FILES = ["./chat-app.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Network-first: always try the real network (so chat/API calls work normally),
  // only fall back to the cached shell if completely offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
