/*
 * Kill-switch service worker. KEEP THIS FILE DEPLOYED.
 *
 * Older versions of this site registered an offline-caching service worker (gatsby-plugin-offline)
 * at /sw.js. Browsers that visited back then keep checking this URL for updates. This replacement
 * deletes the old caches, unregisters itself, and reloads open tabs so they get the live site.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => client.navigate(client.url));
    })(),
  );
});
