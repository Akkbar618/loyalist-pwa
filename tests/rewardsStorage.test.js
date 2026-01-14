/**
 * Tests for rewardsStorage.js
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRewardsStorage } from '../public/utils/rewardsStorage.js';

describe('rewardsStorage', () => {
    const userId = 'test-user-123';
    let storage;

    beforeEach(() => {
        localStorage.clear();
        storage = createRewardsStorage(userId);
    });

    describe('createRewardsStorage()', () => {
        it('should create storage instance for user', () => {
            expect(storage).toBeDefined();
            expect(storage.getAll).toBeDefined();
            expect(storage.isShown).toBeDefined();
            expect(storage.markAsShown).toBeDefined();
            expect(storage.clear).toBeDefined();
        });
    });

    describe('getAll()', () => {
        it('should return empty object when no rewards stored', () => {
            expect(storage.getAll()).toEqual({});
        });

        it('should return stored rewards', () => {
            storage.markAsShown('cafe-1', 1234567890);
            const all = storage.getAll();
            expect(all['cafe-1']).toContain(1234567890);
        });
    });

    describe('isShown()', () => {
        it('should return false for not shown reward', () => {
            expect(storage.isShown('cafe-1', 1234567890)).toBe(false);
        });

        it('should return true for shown reward', () => {
            storage.markAsShown('cafe-1', 1234567890);
            expect(storage.isShown('cafe-1', 1234567890)).toBe(true);
        });

        it('should return false for different timestamp same cafe', () => {
            storage.markAsShown('cafe-1', 1234567890);
            expect(storage.isShown('cafe-1', 9999999999)).toBe(false);
        });

        it('should return false for different cafe same timestamp', () => {
            storage.markAsShown('cafe-1', 1234567890);
            expect(storage.isShown('cafe-2', 1234567890)).toBe(false);
        });
    });

    describe('markAsShown()', () => {
        it('should mark reward as shown', () => {
            storage.markAsShown('cafe-1', 1234567890);
            expect(storage.isShown('cafe-1', 1234567890)).toBe(true);
        });

        it('should store multiple rewards for same cafe', () => {
            storage.markAsShown('cafe-1', 1111111111);
            storage.markAsShown('cafe-1', 2222222222);

            expect(storage.isShown('cafe-1', 1111111111)).toBe(true);
            expect(storage.isShown('cafe-1', 2222222222)).toBe(true);
        });

        it('should store rewards for multiple cafes', () => {
            storage.markAsShown('cafe-1', 1111111111);
            storage.markAsShown('cafe-2', 2222222222);

            expect(storage.isShown('cafe-1', 1111111111)).toBe(true);
            expect(storage.isShown('cafe-2', 2222222222)).toBe(true);
        });

        it('should not duplicate same reward', () => {
            storage.markAsShown('cafe-1', 1234567890);
            storage.markAsShown('cafe-1', 1234567890);

            const all = storage.getAll();
            expect(all['cafe-1'].length).toBe(1);
        });

        it('should call localStorage.setItem', () => {
            storage.markAsShown('cafe-1', 1234567890);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });

    describe('clear()', () => {
        it('should remove all rewards', () => {
            storage.markAsShown('cafe-1', 1234567890);
            storage.markAsShown('cafe-2', 9999999999);

            storage.clear();

            expect(storage.getAll()).toEqual({});
        });

        it('should call localStorage.removeItem', () => {
            storage.clear();
            expect(localStorage.removeItem).toHaveBeenCalledWith(`shown_rewards_${userId}`);
        });
    });

    describe('user isolation', () => {
        it('should isolate rewards between different users', () => {
            const storage1 = createRewardsStorage('user-1');
            const storage2 = createRewardsStorage('user-2');

            storage1.markAsShown('cafe-1', 1234567890);

            expect(storage1.isShown('cafe-1', 1234567890)).toBe(true);
            expect(storage2.isShown('cafe-1', 1234567890)).toBe(false);
        });
    });
});
