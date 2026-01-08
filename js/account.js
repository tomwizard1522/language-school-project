/**
 * Скрипт для страницы личного кабинета
 */

// Глобальные переменные для хранения данных
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
const ORDERS_PER_PAGE = 5; // По заданию: 5 заявок на страницу

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Страница личного кабинета загружена');
    
    // Показываем информационное уведомление
    showNotification('Загружаем ваши заявки...', 'info', 3000);
    
    // Загружаем заявки
    await loadOrders();
    
    // Инициализируем обработчики событий
    initAccountEventListeners();
});

/**
 * Загружает заявки пользователя
 */
async function loadOrders() {
    const ordersContainer = document.getElementById('orders-container');
    
    if (!ordersContainer) {
        console.error('Контейнер для заявок не найден');
        return;
    }
    
    try {
        // Получаем заявки из API
        const orders = await getOrders();
        
        if (!orders) {
            showNotification('Не удалось загрузить заявки', 'danger');
            ordersContainer.innerHTML = `
                <div class="alert alert-danger text-center">
                    <h5>Ошибка при загрузке заявок</h5>
                    <p>Пожалуйста, попробуйте обновить страницу</p>
                </div>
            `;
            return;
        }
        
        allOrders = orders;
        filteredOrders = [...allOrders];
        
        // Отображаем заявки
        displayOrders();
        
        if (orders.length === 0) {
            showNotification('У вас пока нет заявок', 'info', 3000);
        } else {
            showNotification(`Загружено ${orders.length} заявок`, 'success', 3000);
        }
        
    } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
        
        ordersContainer.innerHTML = `
            <div class="alert alert-danger text-center">
                <h5>Ошибка при загрузке заявок</h5>
                <p>${error.message || 'Неизвестная ошибка'}</p>
            </div>
        `;
    }
}

/**
 * Отображает заявки с пагинацией
 */
function displayOrders() {
    const ordersContainer = document.getElementById('orders-container');
    const paginationContainer = document.getElementById('orders-pagination');
    
    if (!ordersContainer || !paginationContainer) return;
    
    // Рассчитываем пагинацию
    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);
    
    // Очищаем контейнер
    ordersContainer.innerHTML = '';
    
    // Если заявок нет
    if (currentOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                <h4>Заявок не найдено</h4>
                <p class="text-muted">У вас пока нет оформленных заявок</p>
                <a href="index.html" class="btn btn-primary mt-3">
                    <i class="bi bi-arrow-left me-2"></i>Вернуться к курсам
                </a>
            </div>
        `;
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Создаем таблицу
    const table = document.createElement('table');
    table.className = 'table table-hover';
    table.innerHTML = `
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Курс/Репетитор</th>
                <th scope="col">Дата</th>
                <th scope="col">Время</th>
                <th scope="col">Стоимость</th>
                <th scope="col" class="text-end">Действия</th>
            </tr>
        </thead>
        <tbody>
            <!-- Строки будут добавлены ниже -->
        </tbody>
    `;
    
    const tbody = table.querySelector('tbody');
    
    // Заполняем таблицу данными
    currentOrders.forEach((order, index) => {
        const orderNumber = startIndex + index + 1;
        
        let courseOrTutor = 'Не указано';
        if (order.course_id && order.course_id > 0) {
            courseOrTutor = `Курс #${order.course_id}`;
        } else if (order.tutor_id && order.tutor_id > 0) {
            courseOrTutor = `Репетитор #${order.tutor_id}`;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${orderNumber}</th>
            <td>${courseOrTutor}</td>
            <td>${formatDate(order.date_start) || 'Не указано'}</td>
            <td>${formatTime(order.time_start) || 'Не указано'}</td>
            <td><strong>${formatPrice(order.price) || 'Не указано'}</strong></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-info view-order-btn" data-order-id="${order.id}">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning ms-1 edit-order-btn" data-order-id="${order.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger ms-1 delete-order-btn" data-order-id="${order.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    ordersContainer.appendChild(table);
    
    // Создаем пагинацию
    paginationContainer.innerHTML = '';
    if (totalPages > 1) {
        const pagination = createPagination(currentPage, totalPages, (page) => {
            currentPage = page;
            displayOrders();
        });
        
        if (pagination) {
            paginationContainer.appendChild(pagination);
        }
    }
}

/**
 * Инициализирует обработчики событий для личного кабинета
 */
function initAccountEventListeners() {
    // Обработчики для кнопок будут добавлены в следующем этапе
    console.log('Обработчики личного кабинета инициализированы');
    
    // Делегирование событий для динамически созданных кнопок
    document.addEventListener('click', function(e) {
        // Кнопка "Подробнее"
        if (e.target.closest('.view-order-btn')) {
            const button = e.target.closest('.view-order-btn');
            const orderId = button.getAttribute('data-order-id');
            viewOrderDetails(orderId);
        }
        
        // Кнопка "Изменить"
        if (e.target.closest('.edit-order-btn')) {
            const button = e.target.closest('.edit-order-btn');
            const orderId = button.getAttribute('data-order-id');
            editOrder(orderId);
        }
        
        // Кнопка "Удалить"
        if (e.target.closest('.delete-order-btn')) {
            const button = e.target.closest('.delete-order-btn');
            const orderId = button.getAttribute('data-order-id');
            deleteOrder(orderId);
        }
    });
}

/**
 * Показывает детали заявки в модальном окне
 * @param {number} orderId - ID заявки
 */
async function viewOrderDetails(orderId) {
    console.log('Просмотр заявки:', orderId);
    
    try {
        const order = await getOrderById(orderId);
        
        if (!order) {
            showNotification('Не удалось загрузить информацию о заявке', 'danger');
            return;
        }
        
        const modalBody = document.querySelector('#orderDetailsModal .modal-body');
        if (!modalBody) return;
        
        // Собираем информацию для отображения
        let detailsHtml = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Основная информация</h6>
                    <p><strong>ID заявки:</strong> ${order.id}</p>
                    <p><strong>Дата создания:</strong> ${formatDateTime(order.created_at)}</p>
                    <p><strong>Дата обновления:</strong> ${formatDateTime(order.updated_at)}</p>
                </div>
                <div class="col-md-6">
                    <h6>Детали заявки</h6>
                    <p><strong>Дата начала:</strong> ${formatDate(order.date_start)}</p>
                    <p><strong>Время начала:</strong> ${formatTime(order.time_start)}</p>
                    <p><strong>Продолжительность:</strong> ${order.duration || 0} часов</p>
                    <p><strong>Количество человек:</strong> ${order.persons || 1}</p>
                    <p><strong>Стоимость:</strong> ${formatPrice(order.price)}</p>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Дополнительные опции</h6>
                    <div class="row">
        `;
        
        // Список опций
        const options = [
            { key: 'early_registration', label: 'Ранняя регистрация', value: order.early_registration },
            { key: 'group_enrollment', label: 'Групповая запись', value: order.group_enrollment },
            { key: 'intensive_course', label: 'Интенсивный курс', value: order.intensive_course },
            { key: 'supplementary', label: 'Дополнительные материалы', value: order.supplementary },
            { key: 'personalized', label: 'Индивидуальные занятия', value: order.personalized },
            { key: 'excursions', label: 'Культурные экскурсии', value: order.excursions },
            { key: 'assessment', label: 'Оценка уровня', value: order.assessment },
            { key: 'interactive', label: 'Интерактивная платформа', value: order.interactive }
        ];
        
        options.forEach(option => {
            detailsHtml += `
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" disabled ${option.value ? 'checked' : ''}>
                        <label class="form-check-label">${option.label}</label>
                    </div>
                </div>
            `;
        });
        
        detailsHtml += `
                    </div>
                </div>
            </div>
            
            <div class="mt-4 alert alert-info">
                <h6>Расчеты:</h6>
                <p class="mb-1">Базовая стоимость с учетом всех опций: ${formatPrice(order.price)}</p>
                <p class="mb-0">Студент ID: ${order.student_id || 'Не указан'}</p>
            </div>
        `;
        
        modalBody.innerHTML = detailsHtml;
        
        // Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        modal.show();
        
    } catch (error) {
        console.error('Ошибка при загрузке деталей заявки:', error);
        showNotification('Ошибка при загрузке деталей заявки', 'danger');
    }
}

/**
 * Редактирование заявки (заглушка для следующего этапа)
 */
async function editOrder(orderId) {
    console.log('Редактирование заявки:', orderId);
    showNotification('Функция редактирования будет реализована в следующем этапе', 'info');
}

/**
 * Удаление заявки (заглушка для следующего этапа)
 */
async function deleteOrder(orderId) {
    console.log('Удаление заявки:', orderId);
    showNotification('Функция удаления будет реализована в следующем этапе', 'info');
}