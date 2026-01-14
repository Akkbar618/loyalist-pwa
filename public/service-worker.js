/**
 * Service Worker for Loyalist PWA
 * Provides offline caching and faster load times
 */

const CACHE_NAME = 'loyalist-cache-v3';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    // Styles
    '/styles/main.css',
    '/styles/base.css',
    '/styles/components.css',
    '/styles/animations.css',
    '/styles/a11y.css',
    '/styles/navigation.css',
    '/styles/theme.css',
    '/styles/screens/auth.css',
    '/styles/screens/main.css',
    '/styles/screens/settings.css',
    // Core
    '/app.js',
    '/firebase-config.js',
    '/translations.js',
    '/core/index.js',
    '/core/state.js',
    '/core/router.js',
    '/core/eventBus.js',
    // Components
    '/components/errorMessage.js',
    '/components/navigation.js',
    '/components/qrCode.js',
    '/components/rewardModal.js',
    '/components/skeleton.js',
    // Utils
    '/utils/errorHandler.js',
    '/utils/toast.js',
    '/utils/rewardsStorage.js',
    '/utils/security.js',
    '/utils/transitions.js',
    '/utils/a11y.js',
    '/utils/pwa.js',
    // Screens
    '/screens/loginScreen.js',
    '/screens/registerScreen.js',
    '/screens/resetScreen.js',
    '/screens/mainScreen.js',
    '/screens/settingsScreen.js',
    '/screens/newPasswordScreen.js',
    // Assets
    '/fonts/Saira-VariableFont_wdth,wght.ttf',
    '/manifest.json'
];

// External resources (cache but update in background)
const EXTERNAL_ASSETS = [
    'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js',
    'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js',
    'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Firebase API calls (need fresh data)
    if (url.hostname.includes('firebaseio.com') ||
        url.hostname.includes('googleapis.com') ||
        url.pathname.includes('__')) {
        return;
    }

    // Network-first for HTML (always get fresh content)
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Cache-first for static assets
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version, update in background
                    event.waitUntil(
                        fetch(request)
                            .then((response) => {
                                if (response.ok) {
                                    caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
                                }
                            })
                            .catch(() => { /* ignore */ })
                    );
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                return fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                        }
                        return response;
                    });
            })
    );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
