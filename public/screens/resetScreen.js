// resetScreen.js
import { t } from '../translations.js';

export function showResetScreen(container, { onReset, onNavigateLogin }) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen';

  screen.innerHTML = `
    <h2>${t('resetPassword.title')}</h2>
    <p>${t('resetPassword.description')}</p>
    <div class="input-group">
      <div class="input-container">
        <input type="email" id="reset-email" required placeholder=" " aria-label="${t('resetPassword.email')}" />
        <label for="reset-email" class="label">${t('resetPassword.email')}</label>
        <div class="underline"></div>
      </div>
    </div>
    <button id="reset-button" class="btn">${t('resetPassword.getCode')}</button>
    <div class="footer-text" style="margin-top:20px; text-align:center;">
      ${t('resetPassword.rememberPassword')}
      <span id="to-login-from-reset" style="cursor:pointer; text-decoration:underline; color:#e1e1e1;">
        ${t('resetPassword.login')}
      </span>
    </div>
  `;

  container.appendChild(screen);

  const resetButton = screen.querySelector('#reset-button');
  const resetEmail = screen.querySelector('#reset-email');
  const toLoginFromReset = screen.querySelector('#to-login-from-reset');

  // Добавляю обработку Enter для перехода по полям и отправки
  const inputs = screen.querySelectorAll('input');
  inputs.forEach((input, idx) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        } else {
          resetButton.click();
        }
      }
    });
  });

  resetButton.addEventListener('click', () => {
    onReset(resetEmail.value.trim());
  });

  toLoginFromReset.addEventListener('click', () => {
    onNavigateLogin();
  });
}