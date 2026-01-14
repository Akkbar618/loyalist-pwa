/**
 * Skeleton Loader Component
 * Creates loading placeholders for content
 */

/**
 * Create a skeleton element
 * @param {string} type - 'text' | 'title' | 'avatar' | 'card' | 'button'
 * @returns {HTMLElement}
 */
export function createSkeleton(type = 'text') {
    const skeleton = document.createElement('div');
    skeleton.className = `skeleton skeleton-${type}`;
    skeleton.setAttribute('aria-hidden', 'true');
    return skeleton;
}

/**
 * Create a skeleton screen with multiple elements
 * @param {Object} config - Configuration object
 * @param {boolean} config.showTitle - Show title skeleton
 * @param {number} config.textLines - Number of text lines
 * @param {boolean} config.showButton - Show button skeleton
 * @param {boolean} config.showAvatar - Show avatar skeleton
 * @returns {HTMLElement}
 */
export function createSkeletonScreen(config = {}) {
    const {
        showTitle = true,
        textLines = 3,
        showButton = true,
        showAvatar = false
    } = config;

    const container = document.createElement('div');
    container.className = 'skeleton-screen';
    container.setAttribute('role', 'progressbar');
    container.setAttribute('aria-busy', 'true');
    container.setAttribute('aria-label', 'Loading...');

    if (showAvatar) {
        container.appendChild(createSkeleton('avatar'));
    }

    if (showTitle) {
        container.appendChild(createSkeleton('title'));
    }

    for (let i = 0; i < textLines; i++) {
        const line = createSkeleton('text');
        // Last line is shorter
        if (i === textLines - 1) {
            line.style.width = '60%';
        }
        container.appendChild(line);
    }

    if (showButton) {
        container.appendChild(createSkeleton('button'));
    }

    return container;
}

/**
 * Create a card skeleton
 * @returns {HTMLElement}
 */
export function createCardSkeleton() {
    const card = document.createElement('div');
    card.className = 'skeleton skeleton-card';
    card.setAttribute('aria-hidden', 'true');

    const content = document.createElement('div');
    content.style.padding = '16px';

    content.appendChild(createSkeleton('title'));
    content.appendChild(createSkeleton('text'));
    content.appendChild(createSkeleton('text'));

    card.appendChild(content);
    return card;
}

/**
 * Replace element with skeleton and return function to restore
 * @param {HTMLElement} element - Element to replace
 * @param {string} type - Skeleton type
 * @returns {Function} Restore function
 */
export function showSkeleton(element, type = 'text') {
    const skeleton = createSkeleton(type);
    const parent = element.parentNode;
    const nextSibling = element.nextSibling;

    parent.replaceChild(skeleton, element);

    return () => {
        if (skeleton.parentNode) {
            parent.replaceChild(element, skeleton);
        } else if (nextSibling) {
            parent.insertBefore(element, nextSibling);
        } else {
            parent.appendChild(element);
        }
    };
}
