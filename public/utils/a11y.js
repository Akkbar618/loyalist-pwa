/**
 * Accessibility Utilities
 * ARIA helpers, focus management, keyboard navigation
 */

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' | 'assertive'
 */
export function announce(message, priority = 'polite') {
    let announcer = document.getElementById('a11y-announcer');

    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
    }

    // Clear and set message (triggers announcement)
    announcer.textContent = '';
    announcer.setAttribute('aria-live', priority);

    // Small delay ensures announcement
    setTimeout(() => {
        announcer.textContent = message;
    }, 100);
}

/**
 * Trap focus within an element (for modals)
 * @param {HTMLElement} element - Container element
 * @returns {Function} Cleanup function
 */
export function trapFocus(element) {
    const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusables = element.querySelectorAll(focusableSelectors);
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];

    const previouslyFocused = document.activeElement;

    const handleKeydown = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable?.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable?.focus();
            }
        }
    };

    element.addEventListener('keydown', handleKeydown);
    firstFocusable?.focus();

    // Return cleanup function
    return () => {
        element.removeEventListener('keydown', handleKeydown);
        previouslyFocused?.focus();
    };
}

/**
 * Make element keyboard navigable (arrow keys)
 * @param {HTMLElement} container - Container with navigable items
 * @param {string} itemSelector - Selector for navigable items
 * @param {Object} options - Configuration options
 */
export function enableArrowNavigation(container, itemSelector, options = {}) {
    const {
        wrap = true,
        horizontal = true,
        vertical = true,
        onSelect = null
    } = options;

    const handleKeydown = (e) => {
        const items = Array.from(container.querySelectorAll(itemSelector));
        const currentIndex = items.indexOf(document.activeElement);

        if (currentIndex === -1) return;

        let nextIndex = currentIndex;

        if (horizontal && e.key === 'ArrowRight') {
            nextIndex = currentIndex + 1;
        } else if (horizontal && e.key === 'ArrowLeft') {
            nextIndex = currentIndex - 1;
        } else if (vertical && e.key === 'ArrowDown') {
            nextIndex = currentIndex + 1;
        } else if (vertical && e.key === 'ArrowUp') {
            nextIndex = currentIndex - 1;
        } else if (e.key === 'Home') {
            nextIndex = 0;
        } else if (e.key === 'End') {
            nextIndex = items.length - 1;
        } else if (e.key === 'Enter' || e.key === ' ') {
            if (onSelect) {
                e.preventDefault();
                onSelect(items[currentIndex], currentIndex);
            }
            return;
        } else {
            return;
        }

        e.preventDefault();

        if (wrap) {
            nextIndex = (nextIndex + items.length) % items.length;
        } else {
            nextIndex = Math.max(0, Math.min(nextIndex, items.length - 1));
        }

        items[nextIndex]?.focus();
    };

    container.addEventListener('keydown', handleKeydown);

    // Add tabindex to items
    const items = container.querySelectorAll(itemSelector);
    items.forEach((item, index) => {
        item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });

    return () => {
        container.removeEventListener('keydown', handleKeydown);
    };
}

/**
 * Set ARIA attributes on element
 * @param {HTMLElement} element 
 * @param {Object} attributes - ARIA attributes without 'aria-' prefix
 */
export function setAria(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(`aria-${key}`, value);
    });
}

/**
 * Create accessible button
 * @param {Object} options 
 * @returns {HTMLButtonElement}
 */
export function createAccessibleButton(options = {}) {
    const {
        text,
        onClick,
        icon = null,
        ariaLabel = null,
        className = 'btn'
    } = options;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;

    if (icon && !text) {
        // Icon-only button needs aria-label
        button.innerHTML = icon;
        button.setAttribute('aria-label', ariaLabel || 'Button');
    } else {
        button.textContent = text;
        if (ariaLabel) {
            button.setAttribute('aria-label', ariaLabel);
        }
    }

    if (onClick) {
        button.addEventListener('click', onClick);
    }

    return button;
}

/**
 * Handle Escape key to close element
 * @param {HTMLElement} element 
 * @param {Function} onClose 
 * @returns {Function} Cleanup function
 */
export function handleEscapeKey(element, onClose) {
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    element.addEventListener('keydown', handleKeydown);

    return () => {
        element.removeEventListener('keydown', handleKeydown);
    };
}

/**
 * Add loading state to button
 * @param {HTMLButtonElement} button 
 * @param {boolean} isLoading 
 */
export function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="loading-spinner" style="width:20px;height:20px;"></span>';
    } else {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }
}

/**
 * Create accessible form field with label
 * @param {Object} options 
 * @returns {HTMLElement}
 */
export function createFormField(options) {
    const {
        type = 'text',
        name,
        label,
        required = false,
        placeholder = ' ',
        errorId = null
    } = options;

    const container = document.createElement('div');
    container.className = 'input-container';

    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.id = name;
    input.placeholder = placeholder;
    input.required = required;
    input.setAttribute('aria-required', required);

    if (errorId) {
        input.setAttribute('aria-describedby', errorId);
    }

    const labelEl = document.createElement('label');
    labelEl.className = 'label';
    labelEl.htmlFor = name;
    labelEl.textContent = label;

    container.appendChild(input);
    container.appendChild(labelEl);

    return container;
}

/**
 * Update live region with error message
 * @param {string} errorId - ID of error element
 * @param {string} message - Error message
 */
export function showFieldError(errorId, message) {
    let errorEl = document.getElementById(errorId);

    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = errorId;
        errorEl.className = 'field-error';
        errorEl.setAttribute('aria-live', 'polite');
        errorEl.setAttribute('role', 'alert');
    }

    errorEl.textContent = message;
    announce(message, 'assertive');
}
