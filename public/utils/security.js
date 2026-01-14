/**
 * Security utilities - validation and sanitization helpers
 */

/**
 * Sanitize string to prevent XSS
 * Escapes HTML special characters
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return str.replace(/[&<>"'`=/]/g, char => map[char]);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') return false;

    // RFC 5322 simplified regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validatePassword(password) {
    const errors = [];

    if (typeof password !== 'string') {
        return { isValid: false, errors: ['Password must be a string'] };
    }

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (password.length > 128) {
        errors.push('Password must be less than 128 characters');
    }

    // Optional: Add more strength checks
    // if (!/[A-Z]/.test(password)) {
    //     errors.push('Password must contain uppercase letter');
    // }
    // if (!/[a-z]/.test(password)) {
    //     errors.push('Password must contain lowercase letter');
    // }
    // if (!/[0-9]/.test(password)) {
    //     errors.push('Password must contain a number');
    // }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Sanitize user input for display
 * Trims whitespace and removes control characters
 * @param {string} str - Input string
 * @returns {string} Cleaned string
 */
export function sanitizeInput(str) {
    if (typeof str !== 'string') return '';

    return str
        .trim()
        // Remove control characters
        .replace(/[\x00-\x1F\x7F]/g, '')
        // Limit length
        .slice(0, 1000);
}

/**
 * Create a safe text node (prevents XSS when adding to DOM)
 * @param {string} text - Text content
 * @returns {Text} Text node
 */
export function createSafeText(text) {
    return document.createTextNode(text);
}

/**
 * Safely set element text content
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text to set
 */
export function setTextContent(element, text) {
    if (element && typeof text === 'string') {
        element.textContent = text;
    }
}

/**
 * Validate that a value is a safe integer
 * @param {*} value - Value to check
 * @param {Object} options - Min/max bounds
 * @returns {boolean}
 */
export function isValidInteger(value, { min = -Infinity, max = Infinity } = {}) {
    return Number.isInteger(value) && value >= min && value <= max;
}

/**
 * Rate limiter helper
 * Creates a function that can only be called N times per interval
 * @param {number} maxCalls - Maximum calls allowed
 * @param {number} intervalMs - Time window in milliseconds
 * @returns {Function} Rate limited check function
 */
export function createRateLimiter(maxCalls, intervalMs) {
    const calls = [];

    return function () {
        const now = Date.now();

        // Remove old calls outside the window
        while (calls.length > 0 && calls[0] < now - intervalMs) {
            calls.shift();
        }

        if (calls.length >= maxCalls) {
            return false; // Rate limited
        }

        calls.push(now);
        return true; // Allowed
    };
}
