/**
 * Navigation Component - Unified burger menu for the app
 * Replaces duplicate implementations in app.js and mainScreen.js
 */

import { t } from '../translations.js';

let currentCleanup = null;

/**
 * Renders the burger menu and side navigation
 * @param {Object} callbacks - Navigation callbacks
 * @param {Function} callbacks.onNavigateMain - Called when Main is clicked
 * @param {Function} callbacks.onNavigateSettings - Called when Settings is clicked
 * @param {Function} callbacks.onNavigateLogout - Called when Logout is clicked
 */
export function renderNavigation({ onNavigateMain, onNavigateSettings, onNavigateLogout }) {
    // Cleanup previous instance
    cleanupNavigation();

    // Create burger button
    const burger = document.createElement('div');
    burger.className = 'burger';
    burger.id = 'burger-menu';
    burger.tabIndex = 0;
    burger.setAttribute('aria-label', t('menu.main'));
    burger.setAttribute('role', 'button');
    burger.innerHTML = '<span></span><span></span><span></span>';

    // Create side menu
    const sideMenu = document.createElement('nav');
    sideMenu.className = 'side-menu';
    sideMenu.id = 'side-menu';
    sideMenu.setAttribute('aria-label', t('menu.main'));
    sideMenu.innerHTML = `
    <ul>
      <li id="menu-main">${t('menu.main')}</li>
      <li id="menu-settings">${t('menu.settings')}</li>
      <li id="menu-logout">${t('menu.logout')}</li>
    </ul>
  `;

    document.body.appendChild(burger);
    document.body.appendChild(sideMenu);

    // Toggle menu
    const toggleMenu = () => {
        burger.classList.toggle('open');
        sideMenu.classList.toggle('open');
    };

    const closeMenu = () => {
        burger.classList.remove('open');
        sideMenu.classList.remove('open');
    };

    // Event handlers
    const handleBurgerClick = () => toggleMenu();

    const handleOutsideClick = (e) => {
        if (!sideMenu.contains(e.target) && !burger.contains(e.target)) {
            closeMenu();
        }
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    };

    const handleMainClick = () => {
        if (onNavigateMain) onNavigateMain();
        closeMenu();
    };

    const handleSettingsClick = () => {
        if (onNavigateSettings) onNavigateSettings();
        closeMenu();
    };

    const handleLogoutClick = () => {
        if (onNavigateLogout) onNavigateLogout();
        closeMenu();
    };

    // Attach event listeners
    burger.addEventListener('click', handleBurgerClick);
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);
    sideMenu.querySelector('#menu-main').addEventListener('click', handleMainClick);
    sideMenu.querySelector('#menu-settings').addEventListener('click', handleSettingsClick);
    sideMenu.querySelector('#menu-logout').addEventListener('click', handleLogoutClick);

    // Store cleanup function
    currentCleanup = () => {
        burger.removeEventListener('click', handleBurgerClick);
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleKeydown);
        burger.remove();
        sideMenu.remove();
    };

    // Update menu on language change
    const handleLanguageChange = () => {
        const mainItem = sideMenu.querySelector('#menu-main');
        const settingsItem = sideMenu.querySelector('#menu-settings');
        const logoutItem = sideMenu.querySelector('#menu-logout');

        if (mainItem) mainItem.textContent = t('menu.main');
        if (settingsItem) settingsItem.textContent = t('menu.settings');
        if (logoutItem) logoutItem.textContent = t('menu.logout');
    };

    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
        window.removeEventListener('languagechange', handleLanguageChange);
        cleanupNavigation();
    };
}

/**
 * Removes the navigation menu from DOM and cleans up event listeners
 */
export function cleanupNavigation() {
    if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
    } else {
        // Fallback cleanup for old menu elements
        const burger = document.getElementById('burger-menu');
        if (burger) burger.remove();
        const sideMenu = document.getElementById('side-menu');
        if (sideMenu) sideMenu.remove();
    }
}
