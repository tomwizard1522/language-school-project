/**
 * Конфигурация API для проекта
 */

const API_BASE_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru';
const API_KEY = '85a17069-b9fd-4069-b624-0419fcc4a309';

// Добавляем проверку авторизации для всех запросов
function getAuthUrl(baseUrl) {
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
}

/**
 * Получить список курсов
 * @returns {Promise} Promise с массивом курсов
 */
async function getCourses() {
    const url = getAuthUrl(`${API_BASE_URL}/api/courses`);
    return await fetchData(url);
}

/**
 * Получить информацию о курсе по ID
 * @param {number} courseId - ID курса
 * @returns {Promise} Promise с информацией о курсе
 */
async function getCourseById(courseId) {
    const url = getAuthUrl(`${API_BASE_URL}/api/courses/${courseId}`);
    return await fetchData(url);
}

/**
 * Получить список репетиторов
 * @returns {Promise} Promise с массивом репетиторов
 */
async function getTutors() {
    const url = getAuthUrl(`${API_BASE_URL}/api/tutors`);
    return await fetchData(url);
}

/**
 * Получить информацию о репетиторе по ID
 * @param {number} tutorId - ID репетитора
 * @returns {Promise} Promise с информацией о репетитора
 */
async function getTutorById(tutorId) {
    const url = getAuthUrl(`${API_BASE_URL}/api/tutors/${tutorId}`);
    return await fetchData(url);
}

/**
 * Получить список заявок пользователя
 * @returns {Promise} Promise с массивом заявок
 */
async function getOrders() {
    const url = getAuthUrl(`${API_BASE_URL}/api/orders`);
    return await fetchData(url);
}

/**
 * Получить информацию о заявке по ID
 * @param {number} orderId - ID заявки
 * @returns {Promise} Promise с информацией о заявке
 */
async function getOrderById(orderId) {
    const url = getAuthUrl(`${API_BASE_URL}/api/orders/${orderId}`);
    return await fetchData(url);
}

/**
 * Создать новую заявку
 * @param {Object} orderData - Данные заявки
 * @returns {Promise} Promise с созданной заявкой
 */
async function createOrder(orderData) {
    const url = getAuthUrl(`${API_BASE_URL}/api/orders`);
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    };
    
    return await fetchData(url, options);
}

/**
 * Обновить существующую заявку
 * @param {number} orderId - ID заявки
 * @param {Object} orderData - Обновленные данные заявки
 * @returns {Promise} Promise с обновленной заявкой
 */
async function updateOrder(orderId, orderData) {
    const url = getAuthUrl(`${API_BASE_URL}/api/orders/${orderId}`);
    
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    };
    
    return await fetchData(url, options);
}

/**
 * Удалить заявку
 * @param {number} orderId - ID заявки
 * @returns {Promise} Promise с результатом удаления
 */
async function deleteOrder(orderId) {
    const url = getAuthUrl(`${API_BASE_URL}/api/orders/${orderId}`);
    
    const options = {
        method: 'DELETE'
    };
    
    return await fetchData(url, options);
}

// Экспорт функций API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
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
}