/**
 * Утилитарные функции для проекта
 */

/**
 * Форматирует дату в русском формате (дд.мм.гггг)
 */
function formatDate(dateString) {
    if (!dateString) return 'Не указано';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        console.warn('Ошибка форматирования даты:', error);
        return dateString;
    }
}

/**
 * Форматирует время (чч:мм)
 */
function formatTime(timeString) {
    if (!timeString) return 'Не указано';
    
    try {
        // Если время в формате "14:00:00", берем только часы и минуты
        if (timeString.includes(':')) {
            const parts = timeString.split(':');
            if (parts.length >= 2) {
                const hours = parts[0].padStart(2, '0');
                const minutes = parts[1].padStart(2, '0');
                return `${hours}:${minutes}`;
            }
        }
        return timeString;
    } catch (error) {
        console.warn('Ошибка форматирования времени:', error);
        return timeString;
    }
}

/**
 * Форматирует дату и время
 */
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'Не указано';
    
    try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) {
            return dateTimeString;
        }
        
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.warn('Ошибка форматирования даты и времени:', error);
        return dateTimeString;
    }
}

/**
 * Форматирует цену в русский формат
 */
function formatPrice(price) {
    if (price === undefined || price === null) return 'Не указано';
    
    try {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    } catch (error) {
        console.warn('Ошибка форматирования цены:', error);
        return `${price} ₽`;
    }
}

/**
 * Обрезает текст и добавляет троеточие
 */
function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Показывает уведомление
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) {
        console.warn('Область для уведомлений не найдена');
        return;
    }
    
    const alertClass = `alert-${type}`;
    const notificationId = 'notification-' + Date.now();
    
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `alert ${alertClass} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
    `;
    
    notificationArea.appendChild(notification);
    
    // Автоматическое скрытие
    if (duration > 0) {
        setTimeout(() => {
            const notif = document.getElementById(notificationId);
            if (notif) {
                notif.remove();
            }
        }, duration);
    }
}

/**
 * Создает пагинацию Bootstrap
 */
function createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return null;
    
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Навигация по страницам');
    
    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';
    
    // Кнопка "Назад"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    const prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = '#';
    prevLink.textContent = 'Назад';
    prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    });
    prevLi.appendChild(prevLink);
    ul.appendChild(prevLi);
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            onPageChange(i);
        });
        pageLi.appendChild(pageLink);
        ul.appendChild(pageLi);
    }
    
    // Кнопка "Вперед"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.textContent = 'Вперед';
    nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });
    nextLi.appendChild(nextLink);
    ul.appendChild(nextLi);
    
    nav.appendChild(ul);
    return nav;
}

// Экспорт функций в глобальную область видимости
window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatDateTime = formatDateTime;
window.formatPrice = formatPrice;
window.truncateText = truncateText;
window.showNotification = showNotification;
window.createPagination = createPagination;