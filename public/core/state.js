/**
 * AppState - Centralized state management for the application
 * Provides reactive state with subscribe/notify pattern
 */

class AppState {
    constructor() {
        this._state = {
            user: null,
            theme: localStorage.getItem('theme') || 'light',
            language: localStorage.getItem('language') || 'ru',
            isLoading: true,
            currentRoute: ''
        };

        this._listeners = new Map();
        this._initTheme();
    }

    /**
     * Initialize theme on document
     */
    _initTheme() {
        document.documentElement.setAttribute('data-theme', this._state.theme);
    }

    /**
     * Get current state value
     * @param {string} key - State key
     * @returns {*} State value
     */
    get(key) {
        return this._state[key];
    }

    /**
     * Get entire state object (readonly copy)
     * @returns {Object} State copy
     */
    getState() {
        return { ...this._state };
    }

    /**
     * Set state value and notify listeners
     * @param {string} key - State key
     * @param {*} value - New value
     */
    set(key, value) {
        const oldValue = this._state[key];
        if (oldValue === value) return;

        this._state[key] = value;
        this._persist(key, value);
        this._notify(key, value, oldValue);
    }

    /**
     * Update multiple state values at once
     * @param {Object} updates - Key-value pairs to update
     */
    update(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Persist certain state to localStorage
     */
    _persist(key, value) {
        if (key === 'theme') {
            localStorage.setItem('theme', value);
            document.documentElement.setAttribute('data-theme', value);
        } else if (key === 'language') {
            localStorage.setItem('language', value);
        }
    }

    /**
     * Subscribe to state changes
     * @param {string} key - State key to watch (or '*' for all)
     * @param {Function} callback - Called with (newValue, oldValue, key)
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this._listeners.has(key)) {
            this._listeners.set(key, new Set());
        }
        this._listeners.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            this._listeners.get(key)?.delete(callback);
        };
    }

    /**
     * Notify all listeners of state change
     */
    _notify(key, newValue, oldValue) {
        // Notify specific key listeners
        this._listeners.get(key)?.forEach(callback => {
            try {
                callback(newValue, oldValue, key);
            } catch (error) {
                console.error(`State listener error for "${key}":`, error);
            }
        });

        // Notify wildcard listeners
        this._listeners.get('*')?.forEach(callback => {
            try {
                callback(newValue, oldValue, key);
            } catch (error) {
                console.error('State wildcard listener error:', error);
            }
        });
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return this._state.user !== null;
    }

    /**
     * Set current user
     * @param {Object|null} user - Firebase user object or null
     */
    setUser(user) {
        this.set('user', user);
    }

    /**
     * Toggle theme between light and dark
     */
    toggleTheme() {
        const newTheme = this._state.theme === 'light' ? 'dark' : 'light';
        this.set('theme', newTheme);
    }
}

// Export singleton instance
export const appState = new AppState();

// Export class for testing
export { AppState };
