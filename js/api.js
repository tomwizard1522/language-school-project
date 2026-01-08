/**
 * API для Language School Project
 */

const API_BASE_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru';
const API_KEY = '85a17069-b9fd-4069-b624-0419fcc4a309';

// Используем прокси для GitHub Pages
const USE_CORS_PROXY = window.location.hostname.includes('github.io');
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

/**
 * Вспомогательная функция для создания URL
 */
function createApiUrl(endpoint) {
    let url = `${API_BASE_URL}${endpoint}`;
    
    // Добавляем API ключ
    const separator = url.includes('?') ? '&' : '?';
    url += `${separator}api_key=${API_KEY}`;
    
    // Если на GitHub Pages, используем прокси
    if (USE_CORS_PROXY) {
        url = CORS_PROXY + encodeURIComponent(url);
    }
    
    return url;
}

/**
 * Базовый запрос к API с обработкой ошибок
 */
async function apiRequest(url, options = {}) {
    try {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });
        
        console.log(`API ${options.method || 'GET'} ${url}:`, response.status);
        
        if (!response.ok) {
            let errorText = await response.text();
            let errorMessage = `HTTP ${response.status}`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                if (errorText) errorMessage = errorText;
            }
            
            throw new Error(errorMessage);
        }
        
        if (response.status === 204) {
            return { success: true };
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('API Request Error:', error);
        
        // Более информативные сообщения об ошибках
        let userMessage = 'Ошибка подключения к серверу';
        
        if (error.message.includes('Failed to fetch')) {
            userMessage = 'Нет соединения с сервером. Проверьте подключение к интернету.';
        } else if (error.message.includes('CORS')) {
            userMessage = 'Проблема с доступом к API. Пожалуйста, откройте сайт локально.';
        }
        
        // Показываем уведомление только если функция доступна
        if (typeof showNotification === 'function') {
            showNotification(userMessage, 'danger');
        } else {
            console.warn('showNotification not available:', userMessage);
        }
        
        throw error;
    }
}

// Остальные функции остаются без изменений...
async function getCourses() {
    const url = createApiUrl('/api/courses');
    return await apiRequest(url);
}

async function getCourseById(courseId) {
    const url = createApiUrl(`/api/courses/${courseId}`);
    return await apiRequest(url);
}

async function getTutors() {
    const url = createApiUrl('/api/tutors');
    return await apiRequest(url);
}

async function getTutorById(tutorId) {
    const url = createApiUrl(`/api/tutors/${tutorId}`);
    return await apiRequest(url);
}

async function getOrders() {
    const url = createApiUrl('/api/orders');
    return await apiRequest(url);
}

async function getOrderById(orderId) {
    const url = createApiUrl(`/api/orders/${orderId}`);
    return await apiRequest(url);
}

async function createOrder(orderData) {
    const url = createApiUrl('/api/orders');
    
    return await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
}

async function updateOrder(orderId, orderData) {
    const url = createApiUrl(`/api/orders/${orderId}`);
    
    return await apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(orderData)
    });
}

async function deleteOrder(orderId) {
    const url = createApiUrl(`/api/orders/${orderId}`);
    return await apiRequest(url, { method: 'DELETE' });
}

// Экспорт всех функций
window.APIService = {
    getCourses,
    getCourseById,
    getTutors,
    getTutorById,
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};