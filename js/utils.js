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
 * Форматирует дату и время
 * @param {string} dateTimeString - Строка с датой и временем
 * @returns {string} Отформатированная дата и время
 */
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'Не указано';
    
    try {
        const date = new Date(dateTimeString);
        
        if (isNaN(date.getTime())) {
            return dateTimeString;
        }
        
        return date.toLocaleDateString('ru-RU', {
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
 * Форматирует время
 * @param {string} timeString - Строка с временем
 * @returns {string} Отформатированное время
 */
function formatTime(timeString) {
    if (!timeString) return 'Не указано';
    
    try {
        const [hours, minutes] = timeString.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (error) {
        console.warn('Ошибка форматирования времени:', error);
        return timeString;
    }
}

/**
 * Форматирует стоимость с разделителями тысяч
 * @param {number} price - Стоимость
 * @returns {string} Отформатированная стоимость
 */
function formatPrice(price) {
    if (!price && price !== 0) return 'Не указано';
    
    try {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    } catch (error) {
        console.warn('Ошибка форматирования цены:', error);
        return price + ' ₽';
    }
}

/**
 * Обрезает длинный текст и добавляет троеточие
 * @param {string} text - Исходный текст
 * @param {number} maxLength - Максимальная длина
 * @returns {string} Обрезанный текст
 */
function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
}

/**
 * Создает всплывающую подсказку (tooltip) для длинного текста
 * @param {HTMLElement} element - Элемент для добавления tooltip
 * @param {string} fullText - Полный текст
 */
function addTooltip(element, fullText) {
    if (!element || !fullText) return;
    
    element.setAttribute('data-bs-toggle', 'tooltip');
    element.setAttribute('data-bs-placement', 'top');
    element.setAttribute('title', fullText);
    
    // Инициализация tooltip при необходимости
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        new bootstrap.Tooltip(element);
    }
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
 * Создает элемент пагинации Bootstrap
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
    prevLink.innerHTML = '&laquo; <span class="d-none d-sm-inline">Назад</span>';
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
    
    // Первая страница, если нужно
    if (startPage > 1) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        const firstLink = document.createElement('a');
        firstLink.className = 'page-link';
        firstLink.href = '#';
        firstLink.textContent = '1';
        firstLink.addEventListener('click', (e) => {
            e.preventDefault();
            onPageChange(1);
        });
        firstLi.appendChild(firstLink);
        ul.appendChild(firstLi);
        
        if (startPage > 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            const ellipsisSpan = document.createElement('span');
            ellipsisSpan.className = 'page-link';
            ellipsisSpan.textContent = '...';
            ellipsisLi.appendChild(ellipsisSpan);
            ul.appendChild(ellipsisLi);
        }
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
    
    // Последняя страница, если нужно
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            const ellipsisSpan = document.createElement('span');
            ellipsisSpan.className = 'page-link';
            ellipsisSpan.textContent = '...';
            ellipsisLi.appendChild(ellipsisSpan);
            ul.appendChild(ellipsisLi);
        }
        
        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        const lastLink = document.createElement('a');
        lastLink.className = 'page-link';
        lastLink.href = '#';
        lastLink.textContent = totalPages;
        lastLink.addEventListener('click', (e) => {
            e.preventDefault();
            onPageChange(totalPages);
        });
        lastLi.appendChild(lastLink);
        ul.appendChild(lastLi);
    }
    
    // Кнопка "Вперед"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.innerHTML = '<span class="d-none d-sm-inline">Вперед</span> &raquo;';
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
 * Загружает данные с API с обработкой ошибок
 * @param {string} url - URL API
 * @param {Object} options - Опции для fetch
 * @returns {Promise} Promise с данными
 */
async function fetchData(url, options = {}) {
    try {
        console.log('Запрос к API:', url);
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка API:', response.status, errorText);
            
            let errorMessage = `HTTP ошибка: ${response.status}`;
            
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {
                // Не JSON ответ
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Ответ API:', data);
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        
        // Более информативные уведомления
        let userMessage = 'Ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
        
        if (error.message.includes('Failed to fetch')) {
            userMessage = 'Нет соединения с сервером. Проверьте подключение к интернету.';
        } else if (error.message.includes('авторизации')) {
            userMessage = 'Ошибка авторизации. Проверьте API ключ.';
        }
        
        showNotification(userMessage, 'danger');
        return null;
    }
}

// Экспорт функций для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        formatDate,
        formatDateTime,
        formatTime,
        formatPrice,
        truncateText,
        addTooltip,
        isEmpty,
        createPagination,
        fetchData
    };
}