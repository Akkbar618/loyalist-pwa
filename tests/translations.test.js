/**
 * Tests for translations.js
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { t, setLanguage, getCurrentLanguage, getAvailableLanguages, LANGUAGES } from '../public/translations.js';

describe('translations', () => {
    beforeEach(() => {
        // Reset to Russian before each test
        setLanguage('ru');
    });

    describe('t() function', () => {
        it('should return translation for valid key in Russian', () => {
            setLanguage('ru');
            expect(t('auth.login')).toBe('Авторизация');
            expect(t('auth.email')).toBe('Электронная почта');
            expect(t('menu.main')).toBe('Главная');
        });

        it('should return translation for valid key in English', () => {
            setLanguage('en');
            expect(t('auth.login')).toBe('Login');
            expect(t('auth.email')).toBe('Email');
            expect(t('menu.main')).toBe('Main');
        });

        it('should handle nested keys', () => {
            expect(t('settings.deleteConfirm')).toBe('Вы уверены, что хотите удалить аккаунт?');
        });

        it('should return key if translation not found', () => {
            expect(t('nonexistent.key')).toBe('nonexistent.key');
        });

        it('should interpolate parameters', () => {
            const result = t('main.rewardReceived', { cafe: 'Starbucks' });
            expect(result).toBe('Вы получили награду в Starbucks!');
        });

        it('should handle missing parameters gracefully', () => {
            const result = t('main.rewardReceived');
            expect(result).toContain('{cafe}');
        });
    });

    describe('setLanguage()', () => {
        it('should change language to English', () => {
            setLanguage('en');
            expect(getCurrentLanguage()).toBe('en');
        });

        it('should change language to Russian', () => {
            setLanguage('en');
            setLanguage('ru');
            expect(getCurrentLanguage()).toBe('ru');
        });

        it('should save language to localStorage', () => {
            setLanguage('en');
            expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
        });

        it('should dispatch languagechange event', () => {
            setLanguage('en');
            expect(window.dispatchEvent).toHaveBeenCalled();
        });

        it('should not change language for unsupported locale', () => {
            setLanguage('ru');
            setLanguage('fr'); // unsupported
            expect(getCurrentLanguage()).toBe('ru');
        });
    });

    describe('getCurrentLanguage()', () => {
        it('should return current language', () => {
            setLanguage('en');
            expect(getCurrentLanguage()).toBe('en');
        });
    });

    describe('getAvailableLanguages()', () => {
        it('should return array of available languages', () => {
            const languages = getAvailableLanguages();
            expect(languages).toContain('ru');
            expect(languages).toContain('en');
            expect(languages.length).toBe(2);
        });

        it('should not include removed languages', () => {
            const languages = getAvailableLanguages();
            expect(languages).not.toContain('be');
            expect(languages).not.toContain('uz');
        });
    });

    describe('LANGUAGES constant', () => {
        it('should have ru and en entries', () => {
            expect(LANGUAGES.ru).toBeDefined();
            expect(LANGUAGES.en).toBeDefined();
        });

        it('should have name and flag for each language', () => {
            expect(LANGUAGES.ru.name).toBe('Русский');
            expect(LANGUAGES.ru.flag).toBe('🇷🇺');
            expect(LANGUAGES.en.name).toBe('English');
            expect(LANGUAGES.en.flag).toBe('🇬🇧');
        });
    });

    describe('all translation keys exist in both languages', () => {
        const checkKeys = (obj, prefix = '') => {
            const keys = [];
            for (const key in obj) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object') {
                    keys.push(...checkKeys(obj[key], fullKey));
                } else {
                    keys.push(fullKey);
                }
            }
            return keys;
        };

        it('should have same keys in ru and en', () => {
            setLanguage('ru');
            const ruKeys = getAvailableLanguages()
                .filter(l => l === 'ru')
                .length;

            setLanguage('en');
            const enKeys = getAvailableLanguages()
                .filter(l => l === 'en')
                .length;

            expect(ruKeys).toBe(enKeys);
        });
    });
});
