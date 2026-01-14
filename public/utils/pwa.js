/**
 * PWA Install Prompt Utility
 * Handles deferred install prompt and install status
 */

let deferredPrompt = null;
let installStatus = 'unknown';

/**
 * Initialize PWA install handling
 * @param {Object} options
 * @param {Function} options.onCanInstall - Called when install is available
 * @param {Function} options.onInstalled - Called after successful install
 */
export function initInstallPrompt(options = {}) {
    const { onCanInstall, onInstalled } = options;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
        installStatus = 'installed';
        return;
    }

    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installStatus = 'available';

        console.log('[PWA] Install prompt available');

        if (onCanInstall) {
            onCanInstall();
        }
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        installStatus = 'installed';

        console.log('[PWA] App installed successfully');

        if (onInstalled) {
            onInstalled();
        }
    });
}

/**
 * Show install prompt
 * @returns {Promise<boolean>} Whether install was accepted
 */
export async function showInstallPrompt() {
    if (!deferredPrompt) {
        console.log('[PWA] Install prompt not available');
        return false;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[PWA] User ${outcome} the install prompt`);

    if (outcome === 'accepted') {
        deferredPrompt = null;
        return true;
    }

    return false;
}

/**
 * Check if app can be installed
 * @returns {boolean}
 */
export function canInstall() {
    return deferredPrompt !== null && installStatus === 'available';
}

/**
 * Get current install status
 * @returns {'unknown' | 'available' | 'installed'}
 */
export function getInstallStatus() {
    return installStatus;
}

/**
 * Check if app is running as PWA
 * @returns {boolean}
 */
export function isRunningAsPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
}

/**
 * Create install button element
 * @param {Object} options
 * @param {string} options.text - Button text
 * @param {string} options.className - CSS class
 * @returns {HTMLButtonElement}
 */
export function createInstallButton(options = {}) {
    const {
        text = 'Установить приложение',
        className = 'btn install-btn'
    } = options;

    const button = document.createElement('button');
    button.className = className;
    button.textContent = text;
    button.style.display = canInstall() ? 'block' : 'none';

    button.addEventListener('click', async () => {
        const installed = await showInstallPrompt();
        if (installed) {
            button.style.display = 'none';
        }
    });

    // Show/hide based on install availability
    window.addEventListener('beforeinstallprompt', () => {
        button.style.display = 'block';
    });

    window.addEventListener('appinstalled', () => {
        button.style.display = 'none';
    });

    return button;
}

/**
 * Register service worker with update handling
 * @param {string} swPath - Path to service worker
 * @param {Object} options
 * @param {Function} options.onUpdate - Called when update is available
 */
export async function registerServiceWorker(swPath = '/service-worker.js', options = {}) {
    const { onUpdate } = options;

    if (!('serviceWorker' in navigator)) {
        console.log('[PWA] Service Worker not supported');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register(swPath);

        console.log('[PWA] Service Worker registered');

        // Check for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[PWA] New content available');

                    if (onUpdate) {
                        onUpdate(() => {
                            newWorker.postMessage('skipWaiting');
                            window.location.reload();
                        });
                    }
                }
            });
        });

        return registration;
    } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
        return null;
    }
}
