/**
 * Test Setup - Enhanced mocks for browser APIs
 */

import { vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        get length() {
            return Object.keys(store).length;
        },
        key: vi.fn((i) => Object.keys(store)[i] || null)
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
});

// Ensure document.documentElement exists with setAttribute
if (typeof document !== 'undefined' && document.documentElement) {
    // jsdom should handle this, but ensure it has setAttribute
    if (!document.documentElement.setAttribute) {
        document.documentElement.setAttribute = vi.fn();
    }
    if (!document.documentElement.getAttribute) {
        document.documentElement.getAttribute = vi.fn(() => 'light');
    }
}

// Mock window.location if needed
if (typeof window !== 'undefined' && !window.location.hash) {
    Object.defineProperty(window, 'location', {
        value: {
            ...window.location,
            hash: '',
            href: 'http://localhost/'
        },
        writable: true
    });
}

// Reset mocks before each test
beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();

    // Reset hash
    if (typeof window !== 'undefined') {
        window.location.hash = '';
    }
});
