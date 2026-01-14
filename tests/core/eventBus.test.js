/**
 * Tests for EventBus - pub/sub event system
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus, Events } from '../../public/core/eventBus.js';

describe('EventBus', () => {
    let bus;

    beforeEach(() => {
        bus = new EventBus();
    });

    describe('on', () => {
        it('should subscribe to an event', () => {
            const callback = vi.fn();
            bus.on('test', callback);

            bus.emit('test', 'payload');

            expect(callback).toHaveBeenCalledWith('payload');
        });

        it('should return unsubscribe function', () => {
            const callback = vi.fn();
            const unsubscribe = bus.on('test', callback);

            unsubscribe();
            bus.emit('test', 'payload');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should allow multiple subscribers', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            bus.on('test', callback1);
            bus.on('test', callback2);
            bus.emit('test', 'data');

            expect(callback1).toHaveBeenCalledWith('data');
            expect(callback2).toHaveBeenCalledWith('data');
        });
    });

    describe('once', () => {
        it('should only fire callback once', () => {
            const callback = vi.fn();
            bus.once('test', callback);

            bus.emit('test', 'first');
            bus.emit('test', 'second');

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('first');
        });
    });

    describe('off', () => {
        it('should unsubscribe from an event', () => {
            const callback = vi.fn();
            bus.on('test', callback);
            bus.off('test', callback);

            bus.emit('test', 'payload');

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('emit', () => {
        it('should emit event with payload', () => {
            const callback = vi.fn();
            bus.on('test', callback);

            bus.emit('test', { data: 'value' });

            expect(callback).toHaveBeenCalledWith({ data: 'value' });
        });

        it('should not throw if no listeners', () => {
            expect(() => bus.emit('nonexistent', 'data')).not.toThrow();
        });

        it('should handle errors in callbacks gracefully', () => {
            const errorCallback = vi.fn(() => {
                throw new Error('Test error');
            });
            const normalCallback = vi.fn();

            bus.on('test', errorCallback);
            bus.on('test', normalCallback);

            expect(() => bus.emit('test', 'data')).not.toThrow();
            expect(normalCallback).toHaveBeenCalled();
        });
    });

    describe('clear', () => {
        it('should clear specific event listeners', () => {
            const callback = vi.fn();
            bus.on('test', callback);
            bus.clear('test');

            bus.emit('test', 'data');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should clear all listeners when no event specified', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            bus.on('event1', callback1);
            bus.on('event2', callback2);
            bus.clear();

            bus.emit('event1', 'data');
            bus.emit('event2', 'data');

            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
        });
    });

    describe('Events constants', () => {
        it('should have auth events defined', () => {
            expect(Events.AUTH_LOGIN).toBe('auth:login');
            expect(Events.AUTH_LOGOUT).toBe('auth:logout');
            expect(Events.AUTH_ERROR).toBe('auth:error');
        });

        it('should have UI events defined', () => {
            expect(Events.TOAST_SHOW).toBe('ui:toast');
            expect(Events.ERROR_SHOW).toBe('ui:error');
        });

        it('should have navigation events defined', () => {
            expect(Events.NAVIGATE).toBe('nav:navigate');
            expect(Events.ROUTE_CHANGED).toBe('nav:changed');
        });
    });
});
