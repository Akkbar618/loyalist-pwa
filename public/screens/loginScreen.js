// loginScreen.js
import { t } from '../translations.js';

export function showLoginScreen(container, { onLogin, onNavigateRegister, onNavigateReset }) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen';

  screen.innerHTML = `
    <h2>${t('auth.login')}</h2>
    <form id="login-form" class="login-form" autocomplete="on">
      <div class="input-group">
        <div class="input-container">
          <input 
            type="email" 
            id="login-email" 
            name="email"
            required 
            autocomplete="email"
            placeholder=" "
            aria-label="${t('auth.email')}" 
          />
          <label for="login-email" class="label">${t('auth.email')}</label>
        </div>
      </div>
      <div class="input-group">
        <div class="input-container">
          <input 
            type="password" 
            id="login-password" 
            name="current-password"
            required 
            autocomplete="current-password"
            placeholder=" "
            aria-label="${t('auth.password')}" 
          />
          <label for="login-password" class="label">${t('auth.password')}</label>
        </div>
      </div>
      <button type="submit" id="login-button" class="btn">
        <span>${t('auth.loginButton')}</span>
      </button>
      <div class="links">
        <div>
          ${t('auth.noAccount')}
          <span id="to-register" role="button" tabindex="0">
            ${t('auth.register')}
          </span>
        </div>
        <div>
          ${t('auth.forgotPassword')}
          <span id="forgot-link" role="button" tabindex="0">
            ${t('auth.restore')}
          </span>
        </div>
      </div>
    </form>
  `;

  container.appendChild(screen);

  const loginForm = screen.querySelector('#login-form');
  const loginEmail = screen.querySelector('#login-email');
  const loginPassword = screen.querySelector('#login-password');
  const toRegister = screen.querySelector('#to-register');
  const forgotLink = screen.querySelector('#forgot-link');

  // Добавляем обработку отправки формы
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    onLogin(email, password);
  });

  // Добавляем поддержку клавиатурной навигации
  toRegister.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigateRegister();
    }
  });

  forgotLink.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigateReset();
    }
  });

  // Добавляем обработчики кликов
  toRegister.addEventListener('click', () => {
    onNavigateRegister();
  });

  forgotLink.addEventListener('click', () => {
    onNavigateReset();
  });

  // Добавляем анимацию при фокусе на полях ввода
  const inputs = screen.querySelectorAll('input');
  const submitBtn = screen.querySelector('#login-button');
  inputs.forEach((input, idx) => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        } else {
          submitBtn.click();
        }
      }
    });
  });
}