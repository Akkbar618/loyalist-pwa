/**
 * Translations Module
 * Supported languages: Russian (ru), English (en)
 */

const translations = {
  ru: {
    auth: {
      login: "Авторизация",
      email: "Электронная почта",
      password: "Пароль",
      loginButton: "Войти",
      noAccount: "Нет аккаунта?",
      register: "Зарегистрироваться",
      forgotPassword: "Забыли пароль?",
      restore: "Восстановить"
    },
    registration: {
      title: "Регистрация",
      username: "Имя пользователя",
      email: "Электронная почта",
      password: "Пароль (не менее 8 символов)",
      confirmPassword: "Подтверждение пароля",
      createAccount: "Создать аккаунт",
      haveAccount: "Уже есть аккаунт?",
      login: "Войти"
    },
    resetPassword: {
      title: "Забыли пароль?",
      description: "Не беда! Введите свою электронную почту, и мы отправим вам письмо для сброса пароля.",
      email: "Электронная почта",
      getCode: "Получить код",
      rememberPassword: "Помните пароль?",
      login: "Войти",
      success: "Письмо отправлено!"
    },
    newPassword: {
      title: "Восстановить пароль",
      description: "Придумайте новый пароль, чтобы восстановить доступ к вашему аккаунту.",
      newPassword: "не менее 8 символов",
      confirmPassword: "повторите пароль",
      restore: "Восстановить пароль",
      cancel: "Отмена",
      haveAccount: "Уже есть аккаунт?",
      login: "Войти",
      success: "Пароль изменён",
      successMessage: "Ваш пароль был успешно изменён.",
      goToAuth: "Перейти к авторизации"
    },
    main: {
      hello: "Привет",
      yourQR: "Ваш QR-код",
      noPoints: "У вас пока нет накопленных баллов",
      lastUpdate: "Последнее обновление",
      rewards: "Получено наград",
      of: "из",
      congratulations: "Поздравляем! 🎉",
      rewardReceived: "Вы получили награду в {cafe}!",
      great: "Супер!"
    },
    menu: {
      main: "Главная",
      settings: "Настройки",
      logout: "Выйти"
    },
    settings: {
      title: "Настройки",
      profile: "Профиль",
      changePassword: "Изменить пароль",
      deleteAccount: "Удалить аккаунт",
      language: "Язык",
      emailLabel: "Email",
      noEmail: "Нет email",
      changeEmail: "Изменить email",
      deleteConfirm: "Вы уверены, что хотите удалить аккаунт?",
      deleteWarning: "Все ваши данные будут безвозвратно удалены. Это действие нельзя отменить.",
      appearance: "Внешний вид",
      darkTheme: "Тёмная тема",
      accountDeleted: "Аккаунт удалён"
    },
    common: {
      cancel: "Отмена",
      save: "Сохранить",
      delete: "Удалить",
      confirm: "Подтвердить"
    },
    errors: {
      fillAllFields: "Пожалуйста, заполните все поля.",
      passwordLength: "Пароль должен быть не менее 8 символов.",
      passwordMismatch: "Пароли не совпадают!",
      passwordChangeError: "Ошибка при смене пароля",
      loginError: "Ошибка входа",
      registrationError: "Ошибка регистрации",
      resetError: "Ошибка сброса пароля",
      deleteError: "Ошибка удаления аккаунта",
      invalidEmail: "Неверный email",
      userNotFound: "Пользователь не найден",
      wrongPassword: "Неверный пароль",
      emailInUse: "Email уже используется",
      networkError: "Ошибка сети. Проверьте подключение.",
      unknownError: "Произошла ошибка. Попробуйте ещё раз."
    }
  },

  en: {
    auth: {
      login: "Login",
      email: "Email",
      password: "Password",
      loginButton: "Sign In",
      noAccount: "No account?",
      register: "Sign Up",
      forgotPassword: "Forgot password?",
      restore: "Reset"
    },
    registration: {
      title: "Sign Up",
      username: "Username",
      email: "Email",
      password: "Password (min 8 characters)",
      confirmPassword: "Confirm Password",
      createAccount: "Create Account",
      haveAccount: "Already have an account?",
      login: "Sign In"
    },
    resetPassword: {
      title: "Forgot Password?",
      description: "No worries! Enter your email and we'll send you a password reset link.",
      email: "Email",
      getCode: "Get Code",
      rememberPassword: "Remember password?",
      login: "Sign In",
      success: "Email sent!"
    },
    newPassword: {
      title: "Reset Password",
      description: "Create a new password to restore access to your account.",
      newPassword: "min 8 characters",
      confirmPassword: "repeat password",
      restore: "Reset Password",
      cancel: "Cancel",
      haveAccount: "Already have an account?",
      login: "Sign In",
      success: "Password Changed",
      successMessage: "Your password has been successfully changed.",
      goToAuth: "Go to Login"
    },
    main: {
      hello: "Hello",
      yourQR: "Your QR Code",
      noPoints: "You don't have any points yet",
      lastUpdate: "Last update",
      rewards: "Rewards received",
      of: "of",
      congratulations: "Congratulations! 🎉",
      rewardReceived: "You received a reward at {cafe}!",
      great: "Great!"
    },
    menu: {
      main: "Main",
      settings: "Settings",
      logout: "Logout"
    },
    settings: {
      title: "Settings",
      profile: "Profile",
      changePassword: "Change Password",
      deleteAccount: "Delete Account",
      language: "Language",
      emailLabel: "Email",
      noEmail: "No email",
      changeEmail: "Change email",
      deleteConfirm: "Are you sure you want to delete your account?",
      deleteWarning: "All your data will be permanently deleted. This action cannot be undone.",
      appearance: "Appearance",
      darkTheme: "Dark Theme",
      accountDeleted: "Account deleted"
    },
    common: {
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      confirm: "Confirm"
    },
    errors: {
      fillAllFields: "Please fill in all fields.",
      passwordLength: "Password must be at least 8 characters long.",
      passwordMismatch: "Passwords don't match!",
      passwordChangeError: "Password change error",
      loginError: "Login error",
      registrationError: "Registration error",
      resetError: "Password reset error",
      deleteError: "Account deletion error",
      invalidEmail: "Invalid email",
      userNotFound: "User not found",
      wrongPassword: "Wrong password",
      emailInUse: "Email already in use",
      networkError: "Network error. Check your connection.",
      unknownError: "An error occurred. Please try again."
    }
  }
};

// Available languages for UI
export const LANGUAGES = {
  ru: { name: 'Русский', flag: '🇷🇺' },
  en: { name: 'English', flag: '🇬🇧' }
};

// Default language
const DEFAULT_LANGUAGE = 'ru';

// Current language
let currentLanguage = localStorage.getItem('language') || DEFAULT_LANGUAGE;

// Validate language exists, fallback to default
if (!translations[currentLanguage]) {
  currentLanguage = DEFAULT_LANGUAGE;
  localStorage.setItem('language', DEFAULT_LANGUAGE);
}

/**
 * Get translation by key path (e.g., 'auth.login')
 * @param {string} key - Dot-separated key path
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} Translated string or key if not found
 */
export function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations[currentLanguage];

  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && value[fallbackKey] !== undefined) {
          value = value[fallbackKey];
        } else {
          console.warn(`Translation not found for key: ${key}`);
          return key;
        }
      }
      break;
    }
  }

  // Handle string interpolation {param}
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? params[paramName] : match;
    });
  }

  return value;
}

/**
 * Change current language
 * @param {string} lang - Language code ('ru' or 'en')
 */
export function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new Event('languagechange'));
  } else {
    console.warn(`Language "${lang}" not supported. Available: ${Object.keys(translations).join(', ')}`);
  }
}

/**
 * Get current language code
 * @returns {string}
 */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Get list of available languages
 * @returns {string[]}
 */
export function getAvailableLanguages() {
  return Object.keys(translations);
}