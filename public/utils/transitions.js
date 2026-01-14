/**
 * Page Transitions - Smooth screen transitions
 */

/**
 * Animate element entrance
 * @param {HTMLElement} element 
 * @param {string} animation - 'enter' | 'slide-in-right' | 'slide-in-left' | 'fade'
 * @returns {Promise}
 */
export function animateIn(element, animation = 'enter') {
    return new Promise(resolve => {
        const classMap = {
            'enter': 'screen-enter',
            'slide-in-right': 'slide-in-right',
            'slide-in-left': 'slide-in-left',
            'fade': 'screen-enter'
        };

        const className = classMap[animation] || 'screen-enter';
        element.classList.add(className);

        const handleEnd = () => {
            element.removeEventListener('animationend', handleEnd);
            resolve();
        };

        element.addEventListener('animationend', handleEnd);
    });
}

/**
 * Animate element exit
 * @param {HTMLElement} element 
 * @returns {Promise}
 */
export function animateOut(element) {
    return new Promise(resolve => {
        element.classList.add('screen-exit');

        const handleEnd = () => {
            element.removeEventListener('animationend', handleEnd);
            element.classList.remove('screen-exit');
            resolve();
        };

        element.addEventListener('animationend', handleEnd);
    });
}

/**
 * Transition between two screens
 * @param {HTMLElement} container - Parent container
 * @param {HTMLElement} newContent - New content to show
 * @param {string} direction - 'forward' | 'back'
 */
export async function transitionScreen(container, newContent, direction = 'forward') {
    const currentContent = container.firstElementChild;

    if (currentContent) {
        await animateOut(currentContent);
        currentContent.remove();
    }

    container.appendChild(newContent);

    const animation = direction === 'forward' ? 'slide-in-right' : 'slide-in-left';
    await animateIn(newContent, animation);
}

/**
 * Add stagger animation to children
 * @param {HTMLElement} parent 
 * @param {string} childSelector 
 */
export function staggerChildren(parent, childSelector = ':scope > *') {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, index) => {
        child.classList.add('stagger-item');
        child.style.animationDelay = `${index * 0.05}s`;
    });
}

/**
 * Add hover lift effect to element
 * @param {HTMLElement} element 
 */
export function addHoverLift(element) {
    element.classList.add('hover-lift');
}

/**
 * Add button press effect to element
 * @param {HTMLElement} button 
 */
export function addPressEffect(button) {
    button.classList.add('btn-press', 'ripple');
}
