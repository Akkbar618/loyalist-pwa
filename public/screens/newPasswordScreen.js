// newPasswordScreen.js
import { updatePassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { showError } from "../components/errorMessage.js";
import { t } from '../translations.js';

export function showNewPasswordScreen(container, { onChangePasswordSuccess, onNavigateLogin, onNavigateBackToSettings, user }) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen';
  
  const modalId = 'password-changed-modal';

  screen.innerHTML = `
    <h2>${t('newPassword.title')}</h2>
    <p>${t('newPassword.description')}</p>
    <div class="input-group">
      <div class="input-container">
        <input type="password" id="new-pass" required aria-label="${t('newPassword.newPassword')}" />
        <label for="new-pass" class="label">${t('newPassword.newPassword')}</label>
        <div class="underline"></div>
      </div>
    </div>
    <div class="input-group">
      <div class="input-container">
        <input type="password" id="confirm-pass" required aria-label="${t('newPassword.confirmPassword')}" />
        <label for="confirm-pass" class="label">${t('newPassword.confirmPassword')}</label>
        <div class="underline"></div>
      </div>
    </div>
    <button id="restore-password-btn" class="btn">${t('newPassword.restore')}</button>
    <button id="cancel-btn" class="btn" style="background:#ccc; color:#000; margin-top:10px;">${t('newPassword.cancel')}</button>
    <div class="footer-text" style="margin-top:20px; text-align:center;">
      ${t('newPassword.haveAccount')}
      <span id="to-login" style="cursor:pointer; text-decoration:underline; color:#e1e1e1;">${t('newPassword.login')}</span>
    </div>

    <div id="${modalId}" class="modal-overlay" style="display:none;">
      <div class="modal-content">
        <h3>${t('newPassword.success')}</h3>
        <p>${t('newPassword.successMessage')}</p>
        <button id="go-to-auth" class="btn">${t('newPassword.goToAuth')}</button>
      </div>
    </div>
  `;

  container.appendChild(screen);

  const restoreBtn = screen.querySelector('#restore-password-btn');
  const newPassInput = screen.querySelector('#new-pass');
  const confirmPassInput = screen.querySelector('#confirm-pass');
  const toLogin = screen.querySelector('#to-login');
  const modalOverlay = screen.querySelector('#' + modalId);
  const goToAuth = screen.querySelector('#go-to-auth');
  const cancelBtn = screen.querySelector('#cancel-btn');

  restoreBtn.addEventListener('click', async () => {
    const newPass = newPassInput.value.trim();
    const confirmPass = confirmPassInput.value.trim();
    if (newPass.length < 8) {
      showError(t('errors.passwordLength'));
      return;
    }
    if (newPass !== confirmPass) {
      showError(t('errors.passwordMismatch'));
      return;
    }
    try {
      await updatePassword(user, newPass);
      if (onChangePasswordSuccess) onChangePasswordSuccess();
      modalOverlay.style.display = 'flex';
    } catch (e) {
      showError(t('errors.passwordChangeError') + e.message);
    }
  });

  toLogin.addEventListener('click', () => {
    onNavigateLogin();
  });

  goToAuth.addEventListener('click', () => {
    onNavigateLogin();
  });

  cancelBtn.addEventListener('click', () => {
    if (onNavigateBackToSettings) onNavigateBackToSettings();
  });
}