import { t, getCurrentLanguage, setLanguage } from '../translations.js';
import { renderNavigation } from '../components/navigation.js';
import { showToast } from '../utils/toast.js';

export function showSettingsScreen(container, { user, onChangePassword, onDeleteAccount, onLogout, onNavigateMain }) {
  container.innerHTML = '';
  renderNavigation({
    onNavigateMain,
    onNavigateSettings: () => { },
    onNavigateLogout: onLogout
  });
  const screen = document.createElement('div');
  screen.className = 'screen';

  const currentLang = getCurrentLanguage();

  screen.innerHTML = `
    <style>
      .settings-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }

      .settings-section {
        background: var(--screen-background);
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 30px;
      }

      /* Improved Headings Hierarchy */
      .settings-title {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 30px;
        color: var(--text-color);
      }

      .section-title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--text-color);
        display: flex;
        align-items: center;
      }

      .subsection-title {
        font-size: 18px;
        font-weight: 500;
        margin: 15px 0;
        color: var(--text-color);
      }

      /* Profile Section */
      .profile-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .email-display {
        font-size: 16px;
        color: var(--text-color);
      }

      .change-email-btn {
        padding: 8px 15px;
        border: 1px solid var(--button-background);
        border-radius: 6px;
        background: transparent;
        color: var(--text-color);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .change-email-btn:hover {
        background: var(--button-background);
      }

      .theme-icon {
        width: 20px;
        height: 20px;
        fill: var(--text-color);
      }

      .buttons-row {
        display: flex;
        gap: 15px;
        margin-top: 20px;
      }

      .settings-button {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .settings-button.primary {
        background: var(--button-background);
        color: var(--button-text-color);
      }

      .settings-button.primary:hover {
        background: var(--button-hover-background);
        color: var(--button-hover-text-color);
      }

      .settings-button.danger {
        background: #DC2626;
        color: white;
      }

      .settings-button.danger:hover {
        background: #B91C1C;
      }

      /* Improved Language Selector */
      .select {
        width: fit-content;
        cursor: pointer;
        position: relative;
        transition: 300ms;
        color: var(--text-color);
        overflow: hidden;
      }

      .selected {
        background-color: var(--button-background);
        padding: 12px 15px;
        margin-bottom: 3px;
        border-radius: 8px;
        position: relative;
        z-index: 2;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 180px;
      }

      [data-theme="dark"] .selected {
        background-color: #2a2f3b;
      }

      .arrow {
        position: relative;
        right: 0px;
        height: 10px;
        transform: rotate(-90deg);
        width: 25px;
        fill: var(--text-color);
        z-index: 2;
        transition: 300ms;
      }

      .options {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        padding: 5px;
        background-color: var(--button-background);
        position: relative;
        top: -100px;
        opacity: 0;
        transition: 300ms;
      }

      [data-theme="dark"] .options {
        background-color: #2a2f3b;
      }

      .select:hover > .options {
        opacity: 1;
        top: 0;
      }

      .select:hover > .selected .arrow {
        transform: rotate(0deg);
      }

      .option {
        border-radius: 6px;
        padding: 10px 15px;
        transition: 300ms;
        background-color: var(--button-background);
        width: 180px;
        font-size: 15px;
      }

      [data-theme="dark"] .option {
        background-color: #2a2f3b;
      }

      .option:hover {
        background-color: var(--button-hover-background);
        color: var(--button-hover-text-color);
      }

      [data-theme="dark"] .option:hover {
        background-color: #323741;
      }

      .options input[type="radio"] {
        display: none;
      }

      .options label {
        display: inline-block;
      }

      .options label::before {
        content: attr(data-txt);
      }

      .options input[type="radio"]:checked + label {
        display: none;
      }

      /* Delete Account Modal */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-card {
        background: var(--screen-background);
        border-radius: 12px;
        padding: 25px;
        max-width: 400px;
        width: 90%;
      }

      .modal-header {
        text-align: center;
        margin-bottom: 20px;
      }

      .warning-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto 15px;
        padding: 10px;
        background: #FEE2E2;
        border-radius: 50%;
        color: #DC2626;
      }

      .modal-title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 10px;
        color: var(--text-color);
      }

      .modal-message {
        color: #666;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 25px;
      }

      .modal-buttons {
        display: flex;
        gap: 10px;
      }

      .modal-button {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .modal-button.confirm {
        background: #DC2626;
        color: white;
      }

      .modal-button.confirm:hover {
        background: #B91C1C;
      }

      .modal-button.cancel {
        background: var(--button-background);
        color: var(--button-text-color);
      }

      .modal-button.cancel:hover {
        background: var(--button-hover-background);
      }

      .theme-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0;
      }

      .theme-label {
        font-size: 16px;
        color: var(--text-color);
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
      }

      input:checked + .slider {
        background-color: var(--button-background);
      }

      input:checked + .slider:before {
        transform: translateX(26px);
      }

      .slider.round {
        border-radius: 34px;
      }

      .slider.round:before {
        border-radius: 50%;
      }
    </style>

    <div class="settings-container">
      <h1 class="settings-title">${t('settings.title')}</h1>

      <div class="settings-section">
        <h2 class="section-title">
          <svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          ${t('settings.profile')}
        </h2>
        <div class="profile-info">
          <div class="email-display">
            <strong>${t('settings.emailLabel')}:</strong> ${user.email || t('settings.noEmail')}
          </div>
          <button class="change-email-btn">
            ${t('settings.changeEmail')}
          </button>
        </div>
        
        <div class="buttons-row">
          <button class="settings-button primary" id="change-password-btn">
            ${t('settings.changePassword')}
          </button>
          <button class="settings-button danger" id="delete-account-btn">
            ${t('settings.deleteAccount')}
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">
          <svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          ${t('settings.appearance')}
        </h2>
        <div class="theme-toggle">
          <span class="theme-label">${t('settings.darkTheme')}</span>
          <label class="switch">
            <input type="checkbox" id="theme-toggle" ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">
          <svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M8 12h8"/>
            <path d="m8 16 1.5-1.5c.5-.5 1-1 1.5-1.5"/>
            <path d="m16 16-1.5-1.5c-.5-.5-1-1-1.5-1.5"/>
          </svg>
          ${t('settings.language')}
        </h2>
        <div class="select">
          <div class="selected">
            ${currentLang === 'ru' ? 'Русский' : currentLang === 'en' ? 'English' : currentLang === 'be' ? 'Беларуская' : 'O\'zbek'}
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" class="arrow">
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
            </svg>
          </div>
          <div class="options">
            <div title="Русский">
              <input id="ru" name="language" type="radio" ${currentLang === 'ru' ? 'checked' : ''} />
              <label class="option" for="ru" data-txt="Русский"></label>
            </div>
            <div title="English">
              <input id="en" name="language" type="radio" ${currentLang === 'en' ? 'checked' : ''} />
              <label class="option" for="en" data-txt="English"></label>
            </div>
            <div title="Беларуская">
              <input id="be" name="language" type="radio" ${currentLang === 'be' ? 'checked' : ''} />
              <label class="option" for="be" data-txt="Беларуская"></label>
            </div>
            <div title="O'zbek">
              <input id="uz" name="language" type="radio" ${currentLang === 'uz' ? 'checked' : ''} />
              <label class="option" for="uz" data-txt="O'zbek"></label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div class="modal-overlay" id="delete-modal">
      <div class="modal-card">
        <div class="modal-header">
          <div class="warning-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="modal-title">${t('settings.deleteAccount')}</h3>
          <p class="modal-message">${t('settings.deleteConfirm')}</p>
        </div>
        <div class="modal-buttons">
          <button class="modal-button cancel" id="cancel-delete">
            ${t('common.cancel')}
          </button>
          <button class="modal-button confirm" id="confirm-delete">
            ${t('settings.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  `;

  container.appendChild(screen);

  // Event Handlers
  const deleteAccountBtn = screen.querySelector('#delete-account-btn');
  const changePasswordBtn = screen.querySelector('#change-password-btn');
  const changeEmailBtn = screen.querySelector('.change-email-btn');
  const deleteModal = screen.querySelector('#delete-modal');
  const cancelDeleteBtn = screen.querySelector('#cancel-delete');
  const confirmDeleteBtn = screen.querySelector('#confirm-delete');
  const languageInputs = screen.querySelectorAll('input[name="language"]');
  const themeToggle = screen.querySelector('#theme-toggle');

  changePasswordBtn.addEventListener('click', onChangePassword);

  changeEmailBtn.addEventListener('click', () => {
    showToast('Функция изменения email скоро будет доступна!', 'info');
  });

  deleteAccountBtn.addEventListener('click', () => {
    deleteModal.style.display = 'flex';
  });

  cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });

  confirmDeleteBtn.addEventListener('click', () => {
    onDeleteAccount();
    deleteModal.style.display = 'none';
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.style.display = 'none';
    }
  });

  // Theme toggle handler
  themeToggle.addEventListener('change', () => {
    const isDark = themeToggle.checked;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Language change handler
  languageInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        const newLang = e.target.id;
        setLanguage(newLang);
        window.dispatchEvent(new Event('languagechange'));
        showSettingsScreen(container, { user, onChangePassword, onDeleteAccount, onLogout, onNavigateMain });
      }
    });
  });
}