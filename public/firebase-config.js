// firebase-config.js
// Использует переменные окружения из .env файлов
// Для локальной разработки: скопируйте .env.example в .env.local и заполните значения

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Проверка конфигурации в development
if (import.meta.env.DEV) {
    const missingKeys = Object.entries(firebaseConfig)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missingKeys.length > 0) {
        console.warn(
            '⚠️ Firebase config missing keys:',
            missingKeys.join(', '),
            '\n📋 Copy .env.example to .env.local and fill in your Firebase credentials'
        );
    }
}