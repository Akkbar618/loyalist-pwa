// errorHandler.js
import { t } from '../translations.js';

/**
 * Преобразует ошибку Firebase в понятное пользователю сообщение
 * @param {Error} error - объект ошибки Firebase
 * @returns {string} Сообщение об ошибке на русском языке
 */
export function handleFirebaseError(error) {
    // Логируем оригинальную ошибку для отладки
    console.error('Original error:', error);
    
    // Firebase возвращает ошибки в формате 'auth/error-code'
    let errorMessage;
    
    switch (error.code) {
        // Ошибки аутентификации
        case 'auth/invalid-login-credentials':
            errorMessage = 'Неверный email или пароль';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Неверный формат электронной почты';
            break;
        case 'auth/user-disabled':
            errorMessage = 'Этот аккаунт был отключен';
            break;
        case 'auth/user-not-found':
            errorMessage = 'Пользователь с таким email не найден';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Неверный пароль';
            break;
        case 'auth/invalid-credential':
            errorMessage = 'Неверный email или пароль';
            break;
        case 'auth/email-already-in-use':
            errorMessage = 'Этот email уже используется';
            break;
        case 'auth/weak-password':
            errorMessage = 'Слишком простой пароль. Используйте не менее 6 символов';
            break;
        case 'auth/operation-not-allowed':
            errorMessage = 'Операция не разрешена';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Слишком много попыток входа. Попробуйте позже';
            break;
        case 'auth/requires-recent-login':
            errorMessage = 'Для этой операции требуется повторный вход в систему';
            break;
            
        // Ошибки Firestore
        case 'permission-denied':
            errorMessage = 'У вас нет прав для выполнения этой операции';
            break;
        case 'not-found':
            errorMessage = 'Запрашиваемые данные не найдены';
            break;
        case 'already-exists':
            errorMessage = 'Документ уже существует';
            break;
        
        // Сетевые ошибки
        case 'network-request-failed':
            errorMessage = 'Ошибка сети. Проверьте подключение к интернету';
            break;
            
        default:
            // Для неизвестных ошибок показываем общее сообщение
            console.warn('Необработанный код ошибки Firebase:', error.code);
            errorMessage = 'Произошла ошибка при входе. Проверьте введённые данные';
            break;
    }
    
    return errorMessage;
}

/**
 * Обработчик ошибок для асинхронных операций
 * @param {Promise} promise - промис для обработки
 * @returns {Promise} - промис с результатом или обработанной ошибкой
 */
export async function handleAsyncError(promise) {
    try {
        const result = await promise;
        return [result, null];
    } catch (error) {
        // Логируем ошибку для отладки
        console.error('Async operation failed:', error);
        
        // Проверяем, что это Firebase ошибка
        if (error && error.code) {
            const errorMessage = handleFirebaseError(error);
            return [null, errorMessage];
        }
        
        // Для других типов ошибок
        return [null, 'Произошла неожиданная ошибка. Попробуйте позже.'];
    }
}