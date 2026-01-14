/**
 * EventBus - Global event pub/sub system for decoupled communication
 */

class EventBus {
    constructor() {
        this._listeners = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event).add(callback);

        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event for one-time execution
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     */
    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        this.on(event, wrapper);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name  
     * @param {Function} callback - Event handler to remove
     */
    off(event, callback) {
        this._listeners.get(event)?.delete(callback);
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} payload - Event data
     */
    emit(event, payload) {
        const listeners = this._listeners.get(event);
        if (!listeners) return;

        listeners.forEach(callback => {
            try {
                callback(payload);
            } catch (error) {
                console.error(`EventBus error for "${event}":`, error);
            }
        });
    }

    /**
     * Remove all listeners for an event (or all events)
     * @param {string} [event] - Event name (optional)
     */
    clear(event) {
        if (event) {
            this._listeners.delete(event);
        } else {
            this._listeners.clear();
        }
    }
}

// Common event names
export const Events = {
    // Auth events
    AUTH_LOGIN: 'auth:login',
    AUTH_LOGOUT: 'auth:logout',
    AUTH_ERROR: 'auth:error',

    // UI events
    TOAST_SHOW: 'ui:toast',
    ERROR_SHOW: 'ui:error',
    ERROR_HIDE: 'ui:error:hide',
    LOADING_START: 'ui:loading:start',
    LOADING_END: 'ui:loading:end',

    // Navigation events
    NAVIGATE: 'nav:navigate',
    ROUTE_CHANGED: 'nav:changed',

    // User events
    USER_UPDATED: 'user:updated',
    LANGUAGE_CHANGED: 'user:language',
    THEME_CHANGED: 'user:theme'
};

// Export singleton instance
export const eventBus = new EventBus();

// Export class for testing
export { EventBus };
