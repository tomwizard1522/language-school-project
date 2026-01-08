/**
 * Личный кабинет пользователя
 * Управление заявками
 */

let allOrders = [];
let currentPage = 1;
const ORDERS_PER_PAGE = 5;

/**
 * Инициализация личного кабинета
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Личный кабинет загружен');
    await loadOrders();
});

/**
 * Загружает заявки пользователя
 */
async function loadOrders() {
    try {
        const ordersContainer = document.getElementById('orders-container');
        if (!ordersContainer) return;
        
        // Показываем загрузку
        ordersContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
                <p class="mt-2">Загружаем ваши заявки...</p>
            </div>
        `;
        
        // Загружаем заявки через API
        const orders = await APIService.getOrders();
        
        if (!Array.isArray(orders)) {
            throw new Error('Некорректный ответ от сервера');
        }
        
        allOrders = orders;
        
        console.log(`Загружено ${orders.length} заявок`);
        
        // Отображаем заявки
        displayOrders();
        
    } catch (error) {
        console.error('Ошибка загрузки заявок:', error);
        showNotification(`Ошибка загрузки заявок: ${error.message}`, 'danger');
        
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) {
            ordersContainer.innerHTML = `
                <div class="alert alert-danger">
                    <h5>Не удалось загрузить заявки</h5>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-primary btn-sm mt-2">Обновить</button>
                </div>
            `;
        }
    }
}

/**
 * Отображает заявки с пагинацией
 */
function displayOrders() {
    const ordersContainer = document.getElementById('orders-container');
    const paginationContainer = document.getElementById('orders-pagination');
    
    if (!ordersContainer || !paginationContainer) return;
    
    // Пагинация
    const totalPages = Math.ceil(allOrders.length / ORDERS_PER_PAGE);
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const currentOrders = allOrders.slice(startIndex, endIndex);
    
    // Если заявок нет
    if (currentOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                <h4>Заявок нет</h4>
                <p class="text-muted">У вас еще нет оформленных заявок</p>
                <a href="index.html" class="btn btn-primary mt-3">
                    <i class="bi bi-arrow-left me-2"></i>Вернуться к курсам
                </a>
            </div>
        `;
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Создаем таблицу заявок
    let tableHtml = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Тип</th>
                        <th scope="col">Дата</th>
                        <th scope="col">Время</th>
                        <th scope="col">Стоимость</th>
                        <th scope="col" class="text-end">Действия</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    currentOrders.forEach((order, index) => {
        const orderNumber = startIndex + index + 1;
        const orderType = order.course_id ? 'Курс' : 'Репетитор';
        const orderTarget = order.course_id ? `Курс #${order.course_id}` : `Репетитор #${order.tutor_id}`;
        
        tableHtml += `
            <tr id="orderRow${order.id}">
                <th scope="row">${orderNumber}</th>
                <td>
                    <span class="badge ${order.course_id ? 'bg-info' : 'bg-warning'}">
                        ${orderType}
                    </span><br>
                    <small>${orderTarget}</small>
                </td>
                <td>${formatDate(order.date_start)}</td>
                <td>${formatTime(order.time_start)}</td>
                <td>
                    <strong class="text-primary">${formatPrice(order.price)}</strong>
                </td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-info view-order-btn" data-order-id="${order.id}">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning edit-order-btn" data-order-id="${order.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger delete-order-btn" data-order-id="${order.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHtml += `
                </tbody>
            </table>
        </div>
    `;
    
    ordersContainer.innerHTML = tableHtml;
    
    // Пагинация
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
    
    // Инициализируем обработчики кнопок
    initOrderButtons();
}

/**
 * Инициализирует обработчики кнопок заявок
 */
function initOrderButtons() {
    // Просмотр заявки
    document.querySelectorAll('.view-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            viewOrderDetails(orderId);
        });
    });
    
    // Редактирование заявки
    document.querySelectorAll('.edit-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            editOrder(orderId);
        });
    });
    
    // Удаление заявки
    document.querySelectorAll('.delete-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            confirmDeleteOrder(orderId);
        });
    });
}

/**
 * Показывает детали заявки
 */
async function viewOrderDetails(orderId) {

    try {
        console.log('Просмотр заявки ID:', orderId);
        
        // Загружаем заявку
        const order = await APIService.getOrderById(orderId);
        
        if (!order) {
            showNotification('Заявка не найдена', 'warning');
            return;
        }
        
        console.log('Данные заявки:', order);
        
        // Определяем тип заявки
        const isCourse = order.course_id && order.course_id > 0;
        const itemType = isCourse ? 'Курс' : 'Репетитор';
        const itemId = isCourse ? order.course_id : order.tutor_id;
        
        // Базовые данные для отображения
        const formattedDate = formatDate(order.date_start) || 'Не указано';
        const formattedTime = formatTime(order.time_start) || 'Не указано';
        const formattedPrice = formatPrice(order.price) || 'Не указано';
        const createdAt = order.created_at ? formatDateTime(order.created_at) : 'Не указано';
        const updatedAt = order.updated_at ? formatDateTime(order.updated_at) : 'Не указано';
        
        // Создаем HTML для модального окна
        const modalHtml = `
            <div class="modal fade" id="orderDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Детали заявки #${order.id}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Основная информация -->
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0">Основная информация</h6>
                                        </div>
                                        <div class="card-body">
                                            <p><strong>Тип заявки:</strong> 
                                                <span class="badge ${isCourse ? 'bg-info' : 'bg-warning'}">
                                                    ${itemType}
                                                </span>
                                            </p>
                                            <p><strong>ID ${itemType}:</strong> ${itemId || 'Не указан'}</p>
                                            <p><strong>Дата начала:</strong> ${formattedDate}</p>
                                            <p><strong>Время начала:</strong> ${formattedTime}</p>
                                            <p><strong>Продолжительность:</strong> ${order.duration || 0} часов</p>
                                            <p><strong>Количество студентов:</strong> ${order.persons || 1}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0">Финансовая информация</h6>
                                        </div>
                                        <div class="card-body">
                                            <p><strong>Стоимость:</strong> 
                                                <span class="text-primary fw-bold fs-5">${formattedPrice}</span>
                                            </p>
                                            <p><strong>Дата создания:</strong> ${createdAt}</p>
                                            <p><strong>Дата обновления:</strong> ${updatedAt}</p>
                                            ${order.student_id ? `
                                                <p><strong>ID студента:</strong> ${order.student_id}</p>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Дополнительные опции -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h6 class="mb-0">Дополнительные опции</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="d-flex align-items-center mb-2">
                                                <div class="form-check form-check-inline me-2">
                                                    <input class="form-check-input" type="checkbox" disabled 
                                                           ${order.early_registration ? 'checked' : ''}>
                                                </div>
                                                <span>Ранняя регистрация (-10%)</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <div class="form-check form-check-inline me-2">
                                                    <input class="form-check-input" type="checkbox" disabled 
                                                           ${order.group_enrollment ? 'checked' : ''}>
                                                </div>
                                                <span>Групповая запись (-15%)</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <div class="form-check form-check-inline me-2">
                                                    <input class="form-check-input" type="checkbox" disabled 
                                                           ${order.supplementary ? 'checked' : ''}>
                                                </div>
                                                <span>Дополнительные материалы (+2000 ₽)</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <div class="form-check form-check-inline me-2">
                                                    <input class="form-check-input" type="checkbox" disabled 
                                                           ${order.assessment ? 'checked' : ''}>
                                                </div>
                                                <span>Оценка уровня (+300 ₽)</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex align-items-center mb-2">
                                                <div class="form-check form-check-inline me-2">
                                                    <input class="form-check-input" type="checkbox" disabled 
                                                           ${order.intensive_course ? 'checked' : ''}>
                                                </div>
                                                <span>Интенсивный курс (+20%)</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <div class="form-check form-check-inline me-2">
                                                    <input class="form-check-input" type="checkbox" disabled 
                                                           ${order.personalized ? 'checked' : ''}>
                                                </div>
                                                <span>Индивидуальные занятия (+1500 ₽/неделя)</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <div class="form-check form-check-inline me-2">
                                                    <input class="form-check-input" type="checkbox" disabled 
                                                           ${order.excursions ? 'checked' : ''}>
                                                </div>
                                                <span>Культурные экскурсии (+25%)</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <div class="form-check form-check-inline me-2">
                                                    <input class="form-check-input" type="checkbox" disabled 
                                                           ${order.interactive ? 'checked' : ''}>
                                                </div>
                                                <span>Интерактивная платформа (×1.5)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Расчеты -->
                            <div class="alert alert-info">
                                <h6><i class="bi bi-calculator me-2"></i>Информация о расчетах</h6>
                                <p class="mb-1">Базовая стоимость с учетом всех опций: ${formattedPrice}</p>
                                <p class="mb-0">Все дополнительные опции учтены в финальной стоимости</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-2"></i>Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно в DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Показываем модальное окно
        const modalElement = document.getElementById('orderDetailsModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Удаляем модальное окно после закрытия
        modalElement.addEventListener('hidden.bs.modal', function() {
            modalContainer.remove();
        });
        
    } catch (error) {
        console.error('Ошибка загрузки деталей заявки:', error);
        showNotification(`Ошибка: ${error.message}`, 'danger');
        
        // Показываем простое модальное окно с ошибкой
        const errorModalHtml = `
            <div class="modal fade" id="errorModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-danger">Ошибка</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger">
                                <i class="bi bi-exclamation-triangle me-2"></i>
                                Не удалось загрузить детали заявки
                            </div>
                            <p><strong>Причина:</strong> ${error.message}</p>
                            <p>Попробуйте обновить страницу и повторить попытку.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const errorContainer = document.createElement('div');
        errorContainer.innerHTML = errorModalHtml;
        document.body.appendChild(errorContainer);
        
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
        
        document.getElementById('errorModal').addEventListener('hidden.bs.modal', function() {
            errorContainer.remove();
        });
    }
}

/**
 * Редактирует заявку
 */
async function editOrder(orderId) {
    try {
        const order = await APIService.getOrderById(orderId);
        
        if (!order) {
            showNotification('Заявка не найдена', 'warning');
            return;
        }
        
        // Создаем модальное окно редактирования
        const modalHtml = `
            <div class="modal fade" id="editOrderModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Редактирование заявки #${order.id}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editOrderForm">
                                <input type="hidden" id="editOrderId" value="${order.id}">
                                
                                <div class="mb-3">
                                    <label class="form-label">Дата *</label>
                                    <input type="date" class="form-control" id="editDate" 
                                           value="${order.date_start}" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Время *</label>
                                    <input type="time" class="form-control" id="editTime" 
                                           value="${order.time_start}" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Количество студентов *</label>
                                    <input type="number" class="form-control" id="editPersons" 
                                           min="1" max="20" value="${order.persons}" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Продолжительность (часов) *</label>
                                    <input type="number" class="form-control" id="editDuration" 
                                           min="1" max="40" value="${order.duration}" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="button" class="btn btn-primary" id="saveEditOrderBtn">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Обработчик сохранения
        document.getElementById('saveEditOrderBtn').addEventListener('click', async function() {
            await saveEditedOrder(order);
        });
        
        // Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
        modal.show();
        
        // Удаляем после закрытия
        modalContainer.querySelector('#editOrderModal').addEventListener('hidden.bs.modal', function() {
            modalContainer.remove();
        });
        
    } catch (error) {
        console.error('Ошибка загрузки заявки для редактирования:', error);
        showNotification('Не удалось загрузить заявку для редактирования', 'danger');
    }
}

/**
 * Сохраняет отредактированную заявку
 */
async function saveEditedOrder(originalOrder) {
    try {
        const orderId = document.getElementById('editOrderId').value;
        const date = document.getElementById('editDate').value;
        const time = document.getElementById('editTime').value;
        const persons = parseInt(document.getElementById('editPersons').value);
        const duration = parseInt(document.getElementById('editDuration').value);
        
        if (!date || !time || !persons || !duration) {
            showNotification('Заполните все поля', 'warning');
            return;
        }
        
        // Обновляем данные (только основные поля)
        const updatedData = {
            date_start: date,
            time_start: time,
            persons: persons,
            duration: duration
        };
        
        // Отправляем обновление
        const result = await APIService.updateOrder(orderId, updatedData);
        
        if (result) {
            showNotification('Заявка успешно обновлена!', 'success');
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('editOrderModal'));
            if (modal) {
                modal.hide();
            }
            
            // Обновляем список заявок
            await loadOrders();
            
        } else {
            throw new Error('Не удалось обновить заявку');
        }
        
    } catch (error) {
        console.error('Ошибка обновления заявки:', error);
        showNotification(`Ошибка: ${error.message}`, 'danger');
    }
}

/**
 * Подтверждает удаление заявки
 */
function confirmDeleteOrder(orderId) {
    // Создаем модальное окно подтверждения
    const confirmHtml = `
        <div class="modal fade" id="confirmDeleteModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Подтверждение удаления</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            Вы уверены, что хотите удалить заявку?
                        </div>
                        <p>Это действие нельзя отменить.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn" data-order-id="${orderId}">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = confirmHtml;
    document.body.appendChild(modalContainer);
    
    // Обработчик подтверждения удаления
    document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
        const orderIdToDelete = this.getAttribute('data-order-id');
        await deleteOrder(orderIdToDelete);
        
        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        if (modal) {
            modal.hide();
        }
    });
    
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
    
    // Удаляем после закрытия
    modalContainer.querySelector('#confirmDeleteModal').addEventListener('hidden.bs.modal', function() {
        modalContainer.remove();
    });
}

/**
 * Удаляет заявку
 */
async function deleteOrder(orderId) {
    try {
        const result = await APIService.deleteOrder(orderId);
        
        if (result) {
            showNotification('Заявка успешно удалена!', 'success');
            
            // Удаляем заявку из локального списка
            allOrders = allOrders.filter(order => order.id !== parseInt(orderId));
            
            // Пересчитываем текущую страницу
            const totalPages = Math.ceil(allOrders.length / ORDERS_PER_PAGE);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
            
            // Обновляем отображение
            displayOrders();
            
        } else {
            throw new Error('Не удалось удалить заявку');
        }
        
    } catch (error) {
        console.error('Ошибка удаления заявки:', error);
        showNotification(`Ошибка: ${error.message}`, 'danger');
    }
}

// Экспортируем функции
window.loadOrders = loadOrders;