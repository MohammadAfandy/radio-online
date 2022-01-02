import { precacheAndRoute } from 'workbox-precaching';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';

const APPNAME = 'radiosv';

clientsClaim();

self.skipWaiting();

setCacheNameDetails({
  prefix: APPNAME,
  suffix: 'v1',
  precache: 'precache',
});

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => (
    url.origin === 'https://fonts.googleapis.com'
    || url.origin === 'https://fonts.gstatic.com'
  ),
  new StaleWhileRevalidate({
    cacheName: `${APPNAME}-google-fonts`,
  }),
);

registerRoute(
  ({ url }) => (url.origin.endsWith('.fontawesome.com')),
  new StaleWhileRevalidate({
    cacheName: `${APPNAME}-fontawesome`,
  }),
);

registerRoute(
  ({ url, request }) => (
    url.origin === 'https://flagcdn.com'
    && request.destination === 'image'
  ),
  new StaleWhileRevalidate({
    cacheName: `${APPNAME}-flagcdn`,
  }),
);

registerRoute(
  ({ url }) => (
    url.origin.endsWith('api.radio-browser.info')
    && (
      url.pathname === '/json/countries'
    )
  ),
  new CacheFirst({
    cacheName: `${APPNAME}-radio-browser-cache`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 1 * 24 * 60 * 60, // 1 day
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => (
    url.origin.endsWith('api.radio-browser.info')
    && (
      url.pathname.startsWith('/json/vote/') === false
      && url.pathname.startsWith('/json/url/') === false
    )
  ),
  new NetworkFirst({
    cacheName: `${APPNAME}-radio-browser-network`,
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 1 * 24 * 60 * 60, // 1 day
      }),
    ],
  }),
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: `${APPNAME}-images`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

registerRoute(
  ({ request }) => (
    request.destination === 'script'
    || request.destination === 'style'
  ),
  new StaleWhileRevalidate({
    cacheName: `${APPNAME}-static-resources`,
  }),
);
