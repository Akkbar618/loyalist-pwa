/**
 * Tests for AppState - centralized state management
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Need to import after mocks are ready
let AppState;

describe('AppState', () => {
    let state;

    beforeEach(async () => {
        // Dynamic import to get fresh module each time
        vi.resetModules();
        const module = await import('../../public/core/state.js');
        AppState = module.AppState;
        state = new AppState();
        localStorage.clear();
    });

    describe('initialization', () => {
        it('should initialize with default values', () => {
            expect(state.get('user')).toBe(null);
            expect(state.get('isLoading')).toBe(true);
        });

        it('should have theme state', () => {
            const theme = state.get('theme');
            expect(['light', 'dark']).toContain(theme);
        });
    });

    describe('get/set', () => {
        it('should get state value', () => {
            const theme = state.get('theme');
            expect(theme).toBeDefined();
        });

        it('should set state value', () => {
            state.set('isLoading', false);
            expect(state.get('isLoading')).toBe(false);
        });

        it('should not notify if value is the same', () => {
            const callback = vi.fn();
            const currentTheme = state.get('theme');
            state.subscribe('theme', callback);
            state.set('theme', currentTheme); // Same value
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('getState', () => {
        it('should return a copy of entire state', () => {
            const fullState = state.getState();
            expect(fullState).toHaveProperty('user');
            expect(fullState).toHaveProperty('theme');
            expect(fullState).toHaveProperty('language');
        });

        it('should return immutable copy', () => {
            const fullState = state.getState();
            fullState.user = 'modified';
            expect(state.get('user')).toBe(null);
        });
    });

    describe('update', () => {
        it('should update multiple values at once', () => {
            state.update({
                isLoading: false,
                currentRoute: 'main'
            });
            expect(state.get('isLoading')).toBe(false);
            expect(state.get('currentRoute')).toBe('main');
        });
    });

    describe('subscribe', () => {
        it('should notify subscribers on state change', () => {
            const callback = vi.fn();
            state.subscribe('isLoading', callback);

            state.set('isLoading', false);

            expect(callback).toHaveBeenCalled();
        });

        it('should return unsubscribe function', () => {
            const callback = vi.fn();
            const unsubscribe = state.subscribe('isLoading', callback);

            unsubscribe();
            state.set('isLoading', false);

            expect(callback).not.toHaveBeenCalled();
        });

        it('should support wildcard subscription', () => {
            const callback = vi.fn();
            state.subscribe('*', callback);

            state.set('isLoading', false);
            state.set('currentRoute', 'test');

            expect(callback).toHaveBeenCalledTimes(2);
        });
    });

    describe('isAuthenticated', () => {
        it('should return false when user is null', () => {
            expect(state.isAuthenticated()).toBe(false);
        });

        it('should return true when user exists', () => {
            state.setUser({ uid: '123', email: 'test@test.com' });
            expect(state.isAuthenticated()).toBe(true);
        });
    });

    describe('setUser', () => {
        it('should set user and notify subscribers', () => {
            const callback = vi.fn();
            state.subscribe('user', callback);

            const user = { uid: '123', email: 'test@test.com' };
            state.setUser(user);

            expect(state.get('user')).toEqual(user);
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('toggleTheme', () => {
        it('should toggle theme', () => {
            const before = state.get('theme');
            state.toggleTheme();
            const after = state.get('theme');
            expect(after).not.toBe(before);
        });
    });
});
