/**
 * Error Tracking Utility
 * Global error handling and reporting
 */

// Error log storage
const errorLog = [];
const MAX_ERRORS = 50;

/**
 * Initialize global error tracking
 * @param {Object} options
 * @param {Function} options.onError - Custom error handler
 * @param {boolean} options.logToConsole - Log errors to console
 */
export function initErrorTracking(options = {}) {
    const { onError, logToConsole = true } = options;

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
        const errorInfo = {
            type: 'error',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        trackError(errorInfo, logToConsole, onError);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const errorInfo = {
            type: 'unhandledrejection',
            message: event.reason?.message || String(event.reason),
            stack: event.reason?.stack,
            timestamp: Date.now(),
            url: window.location.href
        };

        trackError(errorInfo, logToConsole, onError);
    });

    console.log('[ErrorTracking] Initialized');
}

/**
 * Track an error
 * @param {Object} errorInfo 
 * @param {boolean} logToConsole 
 * @param {Function} onError 
 */
function trackError(errorInfo, logToConsole, onError) {
    // Add to local log
    errorLog.push(errorInfo);

    // Keep log size limited
    if (errorLog.length > MAX_ERRORS) {
        errorLog.shift();
    }

    if (logToConsole) {
        console.error('[ErrorTracking]', errorInfo);
    }

    if (onError) {
        try {
            onError(errorInfo);
        } catch (e) {
            console.error('[ErrorTracking] onError handler failed:', e);
        }
    }
}

/**
 * Manually log an error
 * @param {Error|string} error 
 * @param {Object} context - Additional context
 */
export function logError(error, context = {}) {
    const errorInfo = {
        type: 'manual',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context,
        timestamp: Date.now(),
        url: window.location.href
    };

    errorLog.push(errorInfo);
    console.error('[ErrorTracking] Manual error:', errorInfo);
}

/**
 * Get error log
 * @returns {Array}
 */
export function getErrorLog() {
    return [...errorLog];
}

/**
 * Clear error log
 */
export function clearErrorLog() {
    errorLog.length = 0;
}

/**
 * Create error boundary wrapper for async functions
 * @param {Function} fn - Async function to wrap
 * @param {string} context - Error context
 * @returns {Function}
 */
export function withErrorBoundary(fn, context = 'unknown') {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            logError(error, { context, args: args.map(String) });
            throw error;
        }
    };
}
