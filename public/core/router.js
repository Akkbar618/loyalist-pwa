/**
 * Router - Declarative hash-based routing with guards
 */

import { appState } from './state.js';

class Router {
    constructor() {
        this._routes = new Map();
        this._currentRoute = null;
        this._container = null;
        this._onRouteChange = null;

        this._bindHashChange();
    }

    /**
     * Initialize router with container element
     * @param {HTMLElement} container - Main app container
     */
    init(container) {
        this._container = container;
        this.navigate(this._getCurrentHash());
    }

    /**
     * Define a route
     * @param {string} path - Route path (e.g., 'login', 'main')
     * @param {Object} config - Route configuration
     * @param {Function} config.render - Render function for the route
     * @param {boolean} [config.requiresAuth=false] - Whether route requires authentication
     * @param {boolean} [config.guestOnly=false] - Whether route is for guests only
     */
    define(path, config) {
        this._routes.set(path, {
            render: config.render,
            requiresAuth: config.requiresAuth || false,
            guestOnly: config.guestOnly || false,
            beforeEnter: config.beforeEnter || null
        });
        return this;
    }

    /**
     * Set route change callback
     * @param {Function} callback - Called before route changes
     */
    onBeforeRoute(callback) {
        this._onRouteChange = callback;
    }

    /**
     * Navigate to a route
     * @param {string} path - Route path
     */
    navigate(path) {
        window.location.hash = `#/${path}`;
    }

    /**
     * Get current route path
     * @returns {string}
     */
    getCurrentRoute() {
        return this._currentRoute;
    }

    /**
     * Handle hash change
     */
    _bindHashChange() {
        window.addEventListener('hashchange', () => {
            this._handleRoute(this._getCurrentHash());
        });
    }

    /**
     * Get current hash without #/
     * @returns {string}
     */
    _getCurrentHash() {
        return window.location.hash.replace('#/', '') || 'login';
    }

    /**
     * Handle route change
     * @param {string} path - Route path
     */
    _handleRoute(path) {
        const route = this._routes.get(path);

        if (!route) {
            console.warn(`Route "${path}" not found, redirecting to login`);
            this.navigate('login');
            return;
        }

        // Check authentication guards
        const isAuthenticated = appState.isAuthenticated();

        if (route.requiresAuth && !isAuthenticated) {
            console.log('Route requires auth, redirecting to login');
            this.navigate('login');
            return;
        }

        if (route.guestOnly && isAuthenticated) {
            console.log('Route is guest only, redirecting to main');
            this.navigate('main');
            return;
        }

        // Execute beforeEnter guard if exists
        if (route.beforeEnter) {
            const canProceed = route.beforeEnter(path, this._currentRoute);
            if (canProceed === false) return;
        }

        // Notify before route change
        if (this._onRouteChange) {
            this._onRouteChange(path, this._currentRoute);
        }

        // Update current route
        this._currentRoute = path;
        appState.set('currentRoute', path);

        // Render the route
        if (this._container && route.render) {
            route.render(this._container);
        }
    }

    /**
     * Refresh current route
     */
    refresh() {
        this._handleRoute(this._currentRoute);
    }
}

// Export singleton instance
export const router = new Router();

// Export class for testing
export { Router };
