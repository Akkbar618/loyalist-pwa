/**
 * Tests for errorHandler.js
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock translations before importing errorHandler
vi.mock('../public/translations.js', () => ({
    t: (key) => key
}));

// Import after mocking
const { handleFirebaseError, handleAsyncError } = await import('../public/utils/errorHandler.js');

describe('errorHandler', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    describe('handleFirebaseError()', () => {
        it('should handle auth/invalid-login-credentials', () => {
            const error = { code: 'auth/invalid-login-credentials' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Неверный email или пароль');
        });

        it('should handle auth/invalid-email', () => {
            const error = { code: 'auth/invalid-email' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Неверный формат электронной почты');
        });

        it('should handle auth/user-disabled', () => {
            const error = { code: 'auth/user-disabled' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Этот аккаунт был отключен');
        });

        it('should handle auth/user-not-found', () => {
            const error = { code: 'auth/user-not-found' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Пользователь с таким email не найден');
        });

        it('should handle auth/wrong-password', () => {
            const error = { code: 'auth/wrong-password' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Неверный пароль');
        });

        it('should handle auth/email-already-in-use', () => {
            const error = { code: 'auth/email-already-in-use' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Этот email уже используется');
        });

        it('should handle auth/weak-password', () => {
            const error = { code: 'auth/weak-password' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Слишком простой пароль. Используйте не менее 6 символов');
        });

        it('should handle auth/too-many-requests', () => {
            const error = { code: 'auth/too-many-requests' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Слишком много попыток входа. Попробуйте позже');
        });

        it('should handle network-request-failed', () => {
            const error = { code: 'network-request-failed' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Ошибка сети. Проверьте подключение к интернету');
        });

        it('should handle permission-denied', () => {
            const error = { code: 'permission-denied' };
            const result = handleFirebaseError(error);
            expect(result).toBe('У вас нет прав для выполнения этой операции');
        });

        it('should handle unknown error codes', () => {
            const error = { code: 'unknown-error-code' };
            const result = handleFirebaseError(error);
            expect(result).toBe('Произошла ошибка при входе. Проверьте введённые данные');
        });

        it('should log original error', () => {
            const error = { code: 'auth/user-not-found' };
            handleFirebaseError(error);
            expect(console.error).toHaveBeenCalledWith('Original error:', error);
        });
    });

    describe('handleAsyncError()', () => {
        it('should return [result, null] on success', async () => {
            const promise = Promise.resolve('success');
            const [result, error] = await handleAsyncError(promise);

            expect(result).toBe('success');
            expect(error).toBeNull();
        });

        it('should return [null, message] on Firebase error', async () => {
            const firebaseError = { code: 'auth/user-not-found' };
            const promise = Promise.reject(firebaseError);
            const [result, error] = await handleAsyncError(promise);

            expect(result).toBeNull();
            expect(error).toBe('Пользователь с таким email не найден');
        });

        it('should return [null, generic message] on non-Firebase error', async () => {
            const genericError = new Error('Something went wrong');
            const promise = Promise.reject(genericError);
            const [result, error] = await handleAsyncError(promise);

            expect(result).toBeNull();
            expect(error).toBe('Произошла неожиданная ошибка. Попробуйте позже.');
        });

        it('should log error to console', async () => {
            const promise = Promise.reject(new Error('test'));
            await handleAsyncError(promise);

            expect(console.error).toHaveBeenCalled();
        });
    });
});
