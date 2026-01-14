/**
 * Tests for security utilities
 */
import { describe, it, expect } from 'vitest';
import {
    sanitizeHTML,
    isValidEmail,
    validatePassword,
    sanitizeInput,
    isValidInteger,
    createRateLimiter
} from '../../public/utils/security.js';

describe('Security Utils', () => {

    describe('sanitizeHTML', () => {
        it('should escape HTML special characters', () => {
            expect(sanitizeHTML('<script>')).toBe('&lt;script&gt;');
            expect(sanitizeHTML('a & b')).toBe('a &amp; b');
            expect(sanitizeHTML('"quotes"')).toBe('&quot;quotes&quot;');
            expect(sanitizeHTML("'single'")).toBe('&#x27;single&#x27;');
        });

        it('should return empty string for non-strings', () => {
            expect(sanitizeHTML(null)).toBe('');
            expect(sanitizeHTML(undefined)).toBe('');
            expect(sanitizeHTML(123)).toBe('');
            expect(sanitizeHTML({})).toBe('');
        });

        it('should handle normal text unchanged', () => {
            expect(sanitizeHTML('Hello World')).toBe('Hello World');
        });

        it('should escape XSS attack vectors', () => {
            const xss = '<img src=x onerror=alert(1)>';
            expect(sanitizeHTML(xss)).not.toContain('<img');
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.org')).toBe(true);
            expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
        });

        it('should reject invalid emails', () => {
            expect(isValidEmail('')).toBe(false);
            expect(isValidEmail('notanemail')).toBe(false);
            expect(isValidEmail('@nodomain.com')).toBe(false);
            expect(isValidEmail('no@domain')).toBe(false);
            expect(isValidEmail('spaces in@email.com')).toBe(false);
        });

        it('should reject non-strings', () => {
            expect(isValidEmail(null)).toBe(false);
            expect(isValidEmail(123)).toBe(false);
            expect(isValidEmail({})).toBe(false);
        });

        it('should reject overly long emails', () => {
            const longEmail = 'a'.repeat(250) + '@test.com';
            expect(isValidEmail(longEmail)).toBe(false);
        });
    });

    describe('validatePassword', () => {
        it('should accept valid passwords', () => {
            const result = validatePassword('password123');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject short passwords', () => {
            const result = validatePassword('short');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password must be at least 8 characters');
        });

        it('should reject long passwords', () => {
            const result = validatePassword('a'.repeat(130));
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password must be less than 128 characters');
        });

        it('should reject non-strings', () => {
            const result = validatePassword(null);
            expect(result.isValid).toBe(false);
        });

        it('should accept minimum length password', () => {
            const result = validatePassword('12345678');
            expect(result.isValid).toBe(true);
        });
    });

    describe('sanitizeInput', () => {
        it('should trim whitespace', () => {
            expect(sanitizeInput('  hello  ')).toBe('hello');
        });

        it('should remove control characters', () => {
            expect(sanitizeInput('hello\x00world')).toBe('helloworld');
            expect(sanitizeInput('test\x1F')).toBe('test');
        });

        it('should limit length', () => {
            const longString = 'a'.repeat(2000);
            expect(sanitizeInput(longString).length).toBe(1000);
        });

        it('should return empty string for non-strings', () => {
            expect(sanitizeInput(null)).toBe('');
            expect(sanitizeInput(undefined)).toBe('');
        });
    });

    describe('isValidInteger', () => {
        it('should validate integers', () => {
            expect(isValidInteger(5)).toBe(true);
            expect(isValidInteger(0)).toBe(true);
            expect(isValidInteger(-10)).toBe(true);
        });

        it('should reject non-integers', () => {
            expect(isValidInteger(3.14)).toBe(false);
            expect(isValidInteger('5')).toBe(false);
            expect(isValidInteger(null)).toBe(false);
            expect(isValidInteger(NaN)).toBe(false);
        });

        it('should respect min/max bounds', () => {
            expect(isValidInteger(5, { min: 0, max: 10 })).toBe(true);
            expect(isValidInteger(-1, { min: 0 })).toBe(false);
            expect(isValidInteger(15, { max: 10 })).toBe(false);
        });
    });

    describe('createRateLimiter', () => {
        it('should allow calls within limit', () => {
            const limiter = createRateLimiter(3, 1000);

            expect(limiter()).toBe(true);
            expect(limiter()).toBe(true);
            expect(limiter()).toBe(true);
        });

        it('should block calls exceeding limit', () => {
            const limiter = createRateLimiter(2, 1000);

            limiter();
            limiter();

            expect(limiter()).toBe(false);
        });

        it('should reset after interval', async () => {
            const limiter = createRateLimiter(1, 50);

            limiter();
            expect(limiter()).toBe(false);

            await new Promise(r => setTimeout(r, 60));

            expect(limiter()).toBe(true);
        });
    });
});
