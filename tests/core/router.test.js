/**
 * Tests for Router - hash-based routing with guards
 * Simplified tests that don't rely on heavy DOM manipulation
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Router', () => {
    let Router;
    let router;

    beforeEach(async () => {
        vi.resetModules();

        // Mock appState before importing Router
        vi.doMock('../../public/core/state.js', () => ({
            appState: {
                isAuthenticated: vi.fn(() => false),
                set: vi.fn()
            }
        }));

        const module = await import('../../public/core/router.js');
        Router = module.Router;
        router = new Router();

        // Reset hash
        window.location.hash = '';
    });

    describe('define', () => {
        it('should define a route', () => {
            const renderFn = vi.fn();
            router.define('test', { render: renderFn });

            expect(router._routes.has('test')).toBe(true);
        });

        it('should return router for chaining', () => {
            const result = router.define('test', { render: vi.fn() });
            expect(result).toBe(router);
        });

        it('should store route configuration', () => {
            router.define('login', {
                render: vi.fn(),
                guestOnly: true
            });

            const route = router._routes.get('login');
            expect(route.guestOnly).toBe(true);
        });

        it('should store requiresAuth flag', () => {
            router.define('main', {
                render: vi.fn(),
                requiresAuth: true
            });

            const route = router._routes.get('main');
            expect(route.requiresAuth).toBe(true);
        });
    });

    describe('navigate', () => {
        it('should update window hash', () => {
            router.navigate('login');
            expect(window.location.hash).toBe('#/login');
        });

        it('should navigate to different routes', () => {
            router.navigate('register');
            expect(window.location.hash).toBe('#/register');

            router.navigate('main');
            expect(window.location.hash).toBe('#/main');
        });
    });

    describe('getCurrentRoute', () => {
        it('should return null initially', () => {
            expect(router.getCurrentRoute()).toBe(null);
        });

        it('should return current route after navigation', () => {
            router.define('test', { render: vi.fn() });
            router._handleRoute('test');

            expect(router.getCurrentRoute()).toBe('test');
        });
    });

    describe('onBeforeRoute', () => {
        it('should store callback', () => {
            const callback = vi.fn();
            router.onBeforeRoute(callback);

            expect(router._onRouteChange).toBe(callback);
        });
    });

    describe('_getCurrentHash', () => {
        it('should extract path from hash', () => {
            window.location.hash = '#/test';
            expect(router._getCurrentHash()).toBe('test');
        });

        it('should return login for empty hash', () => {
            window.location.hash = '';
            expect(router._getCurrentHash()).toBe('login');
        });
    });

    describe('multiple routes', () => {
        it('should handle multiple route definitions', () => {
            router
                .define('login', { render: vi.fn(), guestOnly: true })
                .define('register', { render: vi.fn(), guestOnly: true })
                .define('main', { render: vi.fn(), requiresAuth: true })
                .define('settings', { render: vi.fn(), requiresAuth: true });

            expect(router._routes.size).toBe(4);
        });
    });
});
