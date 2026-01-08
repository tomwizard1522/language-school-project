/**
 * Вспомогательные функции для проекта
 */

/**
 * Показывает уведомление
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success, danger, warning, info)
 * @param {number} duration - Длительность показа в миллисекундах
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
    notification.className = `alert ${alertClass} alert-dismissible fade show notification`;
    notification.role = 'alert';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
    `;
    
    notificationArea.appendChild(notification);
    
    // Автоматическое скрытие через указанное время
    if (duration > 0) {
        setTimeout(() => {
            const notificationToRemove = document.getElementById(notificationId);
            if (notificationToRemove) {
                notificationToRemove.remove();
            }
        }, duration);
    }
}

/**
 * Форматирует дату в читаемый формат
 * @param {string} dateString - Строка с датой
 * @returns {string} Отформатированная дата
 */
function formatDate(dateString) {
    if (!dateString) return 'Не указано';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return dateString;
    }
    
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Форматирует время
 * @param {string} timeString - Строка с временем
 * @returns {string} Отформатированное время
 */
function formatTime(timeString) {
    if (!timeString) return 'Не указано';
    
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

/**
 * Форматирует стоимость с разделителями тысяч
 * @param {number} price - Стоимость
 * @returns {string} Отформатированная стоимость
 */
function formatPrice(price) {
    if (!price && price !== 0) return 'Не указано';
    
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

/**
 * Проверяет, является ли значение пустым
 * @param {*} value - Значение для проверки
 * @returns {boolean} true если значение пустое
 */
function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
}

/**
 * Создает элемент пагинации
 * @param {number} currentPage - Текущая страница
 * @param {number} totalPages - Всего страниц
 * @param {Function} onPageChange - Функция обратного вызова при смене страницы
 * @returns {HTMLElement} Элемент пагинации
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
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
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

/**
 * Загружает данные с API
 * @param {string} url - URL API
 * @param {Object} options - Опции для fetch
 * @returns {Promise} Promise с данными
 */
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        showNotification('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.', 'danger');
        return null;
    }
}

// Экспорт функций для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        formatDate,
        formatTime,
        formatPrice,
        isEmpty,
        createPagination,
        fetchData
    };
}