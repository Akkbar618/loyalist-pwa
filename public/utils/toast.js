// toast.js
// Универсальная система toast уведомлений

export function showToast(message, type = 'info', duration = 2500) {
    let toast = document.getElementById('custom-toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        
        // Базовые стили
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '18px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            opacity: '0',
            pointerEvents: 'none',
            transition: 'opacity 0.3s, bottom 0.3s',
            zIndex: '9999',
            maxWidth: '90vw',
            textAlign: 'center'
        });
        
        document.body.appendChild(toast);
    }
    
    // Очистить предыдущий таймер
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Установить цвета в зависимости от типа
    let backgroundColor, textColor;
    switch (type) {
        case 'success':
            backgroundColor = '#10B981';
            textColor = '#FFFFFF';
            break;
        case 'error':
            backgroundColor = '#EF4444';
            textColor = '#FFFFFF';
            break;
        case 'warning':
            backgroundColor = '#F59E0B';
            textColor = '#FFFFFF';
            break;
        default: // info
            backgroundColor = 'var(--surface-1, #222)';
            textColor = 'var(--text-primary, #fff)';
    }
    
    // Применить стили и контент
    toast.style.background = backgroundColor;
    toast.style.color = textColor;
    toast.textContent = message;
    
    // Показать toast
    toast.style.opacity = '1';
    toast.style.bottom = '48px';
    
    // Скрыть через заданное время
    toast.timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '32px';
    }, duration);
}

// Удобные методы для разных типов
export const toast = {
    info: (message, duration) => showToast(message, 'info', duration),
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration)
}; 