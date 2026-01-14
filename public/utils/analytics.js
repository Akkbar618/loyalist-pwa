/**
 * Analytics Utility
 * Firebase Analytics integration with custom events
 */

// Analytics instance (lazy loaded)
let analyticsInstance = null;

/**
 * Initialize Firebase Analytics
 * @param {Object} app - Firebase app instance
 */
export async function initAnalytics(app) {
    try {
        // Dynamic import for code splitting
        const { getAnalytics, setUserId, setUserProperties } = await import(
            'https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js'
        );

        analyticsInstance = getAnalytics(app);
        console.log('[Analytics] Initialized');

        return analyticsInstance;
    } catch (error) {
        console.warn('[Analytics] Failed to initialize:', error);
        return null;
    }
}

/**
 * Log custom event
 * @param {string} eventName - Event name (snake_case)
 * @param {Object} params - Event parameters
 */
export async function logEvent(eventName, params = {}) {
    if (!analyticsInstance) {
        console.log('[Analytics] Not initialized, skipping event:', eventName);
        return;
    }

    try {
        const { logEvent: firebaseLogEvent } = await import(
            'https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js'
        );

        firebaseLogEvent(analyticsInstance, eventName, {
            ...params,
            timestamp: Date.now()
        });

        console.log('[Analytics] Event logged:', eventName, params);
    } catch (error) {
        console.warn('[Analytics] Failed to log event:', error);
    }
}

/**
 * Track page view
 * @param {string} pageName - Page/screen name
 * @param {string} pageTitle - Page title
 */
export function trackPageView(pageName, pageTitle) {
    logEvent('page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: pageTitle || document.title,
        screen_name: pageName
    });
}

/**
 * Track user action
 * @param {string} action - Action name
 * @param {string} category - Action category
 * @param {string} label - Action label
 */
export function trackAction(action, category, label) {
    logEvent('user_action', {
        action,
        category,
        label
    });
}

/**
 * Set user ID for analytics
 * @param {string} userId 
 */
export async function setAnalyticsUserId(userId) {
    if (!analyticsInstance) return;

    try {
        const { setUserId } = await import(
            'https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js'
        );

        setUserId(analyticsInstance, userId);
        console.log('[Analytics] User ID set');
    } catch (error) {
        console.warn('[Analytics] Failed to set user ID:', error);
    }
}

/**
 * Set user properties
 * @param {Object} properties 
 */
export async function setAnalyticsUserProperties(properties) {
    if (!analyticsInstance) return;

    try {
        const { setUserProperties } = await import(
            'https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js'
        );

        setUserProperties(analyticsInstance, properties);
    } catch (error) {
        console.warn('[Analytics] Failed to set user properties:', error);
    }
}

// Pre-defined event helpers
export const Events = {
    // Auth events
    login: (method = 'email') => logEvent('login', { method }),
    signUp: (method = 'email') => logEvent('sign_up', { method }),
    logout: () => logEvent('logout'),

    // Navigation events
    screenView: (screenName) => logEvent('screen_view', { screen_name: screenName }),

    // Feature usage
    qrCodeViewed: () => logEvent('qr_code_viewed'),
    rewardEarned: (points) => logEvent('reward_earned', { points }),
    settingsChanged: (setting) => logEvent('settings_changed', { setting }),
    languageChanged: (language) => logEvent('language_changed', { language }),
    themeChanged: (theme) => logEvent('theme_changed', { theme })
};
