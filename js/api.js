/**
 * API для Language School Project
 */

const API_BASE_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru';
const API_KEY = '85a17069-b9fd-4069-b624-0419fcc4a309';

/**
 * Вспомогательная функция для создания URL с авторизацией
 */
function createApiUrl(endpoint) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    return url.toString();
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
                // Если ответ не JSON, используем текст как есть
                if (errorText) errorMessage = errorText;
            }
            
            throw new Error(errorMessage);
        }
        
        // Если ответ 204 No Content (например, при удалении)
        if (response.status === 204) {
            return { success: true };
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * ПОЛУЧИТЬ СПИСОК КУРСОВ
 * GET /api/courses
 */
async function getCourses() {
    const url = createApiUrl('/api/courses');
    return await apiRequest(url);
}

/**
 * ПОЛУЧИТЬ КУРС ПО ID
 * GET /api/courses/{id}
 */
async function getCourseById(courseId) {
    const url = createApiUrl(`/api/courses/${courseId}`);
    return await apiRequest(url);
}

/**
 * ПОЛУЧИТЬ СПИСОК РЕПЕТИТОРОВ
 * GET /api/tutors
 */
async function getTutors() {
    const url = createApiUrl('/api/tutors');
    return await apiRequest(url);
}

/**
 * ПОЛУЧИТЬ РЕПЕТИТОРА ПО ID
 * GET /api/tutors/{id}
 */
async function getTutorById(tutorId) {
    const url = createApiUrl(`/api/tutors/${tutorId}`);
    return await apiRequest(url);
}

/**
 * ПОЛУЧИТЬ СПИСОК ЗАЯВОК
 * GET /api/orders
 */
async function getOrders() {
    const url = createApiUrl('/api/orders');
    return await apiRequest(url);
}

/**
 * ПОЛУЧИТЬ ЗАЯВКУ ПО ID
 * GET /api/orders/{id}
 */
async function getOrderById(orderId) {
    const url = createApiUrl(`/api/orders/${orderId}`);
    return await apiRequest(url);
}

/**
 * СОЗДАТЬ ЗАЯВКУ
 * POST /api/orders
 */
async function createOrder(orderData) {
    const url = createApiUrl('/api/orders');
    
    // Проверяем обязательные поля
    const requiredFields = ['date_start', 'time_start', 'duration', 'persons', 'price'];
    const missingFields = requiredFields.filter(field => !orderData[field] && orderData[field] !== 0);
    
    if (missingFields.length > 0) {
        throw new Error(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
    }
    
    // Преобразуем boolean поля (должны быть всегда)
    const booleanFields = [
        'early_registration', 'group_enrollment', 'intensive_course',
        'supplementary', 'personalized', 'excursions', 'assessment', 'interactive'
    ];
    
    booleanFields.forEach(field => {
        if (orderData[field] === undefined) {
            orderData[field] = false;
        }
    });
    
    // Убедимся, что tutor_id или course_id установлены
    if (!orderData.tutor_id && !orderData.course_id) {
        throw new Error('Должен быть указан либо tutor_id, либо course_id');
    }
    
    return await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
}

/**
 * ОБНОВИТЬ ЗАЯВКУ
 * PUT /api/orders/{id}
 */
async function updateOrder(orderId, orderData) {
    const url = createApiUrl(`/api/orders/${orderId}`);
    
    // При PUT запросе передаем только изменяемые поля
    const updateData = {};
    
    // Копируем только те поля, которые есть в orderData
    const allowedFields = [
        'date_start', 'time_start', 'duration', 'persons', 'price',
        'early_registration', 'group_enrollment', 'intensive_course',
        'supplementary', 'personalized', 'excursions', 'assessment', 'interactive'
    ];
    
    allowedFields.forEach(field => {
        if (orderData[field] !== undefined) {
            updateData[field] = orderData[field];
        }
    });
    
    return await apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(updateData)
    });
}

/**
 * УДАЛИТЬ ЗАЯВКУ
 * DELETE /api/orders/{id}
 */
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