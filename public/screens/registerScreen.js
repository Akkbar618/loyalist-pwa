// registerScreen.js
import { t } from '../translations.js';

export function showRegisterScreen(container, { onRegister, onNavigateLogin }) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen';

  screen.innerHTML = `
    <h2>${t('registration.title')}</h2>
    <form id="register-form" class="register-form" autocomplete="on">
      <div class="input-group">
        <div class="input-container">
          <input 
            type="text" 
            id="register-name" 
            name="username"
            required 
            autocomplete="username"
            placeholder=" "
            aria-label="${t('registration.username')}" 
          />
          <label for="register-name" class="label">${t('registration.username')}</label>
        </div>
      </div>
      <div class="input-group">
        <div class="input-container">
          <input 
            type="email" 
            id="register-email" 
            name="email"
            required 
            autocomplete="email"
            placeholder=" "
            aria-label="${t('registration.email')}" 
          />
          <label for="register-email" class="label">${t('registration.email')}</label>
        </div>
      </div>
      <div class="input-group">
        <div class="input-container">
          <input 
            type="password" 
            id="register-password" 
            name="new-password"
            required 
            autocomplete="new-password"
            placeholder=" "
            aria-label="${t('registration.password')}" 
          />
          <label for="register-password" class="label">${t('registration.password')}</label>
        </div>
      </div>
      <div class="input-group">
        <div class="input-container">
          <input 
            type="password" 
            id="register-password-confirm" 
            name="new-password"
            required 
            autocomplete="new-password"
            placeholder=" "
            aria-label="${t('registration.confirmPassword')}" 
          />
          <label for="register-password-confirm" class="label">${t('registration.confirmPassword')}</label>
        </div>
      </div>
      <button type="submit" id="register-button" class="btn">
        <span>${t('registration.createAccount')}</span>
      </button>
      <div class="links">
        <div>
          ${t('registration.haveAccount')}
          <span id="to-login-from-register" role="button" tabindex="0">
            ${t('registration.login')}
          </span>
        </div>
      </div>
    </form>
  `;

  container.appendChild(screen);

  const registerForm = screen.querySelector('#register-form');
  const registerName = screen.querySelector('#register-name');
  const registerEmail = screen.querySelector('#register-email');
  const registerPassword = screen.querySelector('#register-password');
  const registerPasswordConfirm = screen.querySelector('#register-password-confirm');
  const toLoginFromRegister = screen.querySelector('#to-login-from-register');

  // Добавляем обработку отправки формы
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    onRegister(
      registerName.value.trim(),
      registerEmail.value.trim(),
      registerPassword.value.trim(),
      registerPasswordConfirm.value.trim()
    );
  });

  // Добавляем поддержку клавиатурной навигации
  toLoginFromRegister.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigateLogin();
    }
  });

  // Добавляем обработчик клика
  toLoginFromRegister.addEventListener('click', () => {
    onNavigateLogin();
  });

  // Добавляем анимацию при фокусе на полях ввода
  const inputs = screen.querySelectorAll('input');
  const submitBtn = screen.querySelector('#register-button');
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

  // Добавляем валидацию паролей в реальном времени
  registerPasswordConfirm.addEventListener('input', () => {
    if (registerPassword.value !== registerPasswordConfirm.value) {
      registerPasswordConfirm.setCustomValidity(t('errors.passwordMismatch'));
    } else {
      registerPasswordConfirm.setCustomValidity('');
    }
  });

  registerPassword.addEventListener('input', () => {
    if (registerPassword.value.length < 6) {
      registerPassword.setCustomValidity(t('errors.passwordLength'));
    } else {
      registerPassword.setCustomValidity('');
    }
    // Обновляем валидацию подтверждения пароля
    if (registerPasswordConfirm.value) {
      if (registerPassword.value !== registerPasswordConfirm.value) {
        registerPasswordConfirm.setCustomValidity(t('errors.passwordMismatch'));
      } else {
        registerPasswordConfirm.setCustomValidity('');
      }
    }
  });
}