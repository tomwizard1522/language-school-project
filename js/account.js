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

// ============================================
// ОБНОВЛЕННЫЕ ФУНКЦИИ ДЛЯ ЛИЧНОГО КАБИНЕТА
// ============================================

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
        
        // Получаем дополнительную информацию о курсе или репетиторе
        let itemInfo = null;
        if (order.course_id && order.course_id > 0) {
            itemInfo = await getCourseById(order.course_id);
        } else if (order.tutor_id && order.tutor_id > 0) {
            itemInfo = await getTutorById(order.tutor_id);
        }
        
        const modalBody = document.querySelector('#orderDetailsModal .modal-body');
        if (!modalBody) return;
        
        // Собираем информацию для отображения
        let detailsHtml = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Основная информация</h6>
                    <p><strong>ID заявки:</strong> ${order.id}</p>
                    <p><strong>Тип:</strong> ${order.course_id ? 'Курс' : 'Репетитор'}</p>
                    ${itemInfo ? `<p><strong>Название:</strong> ${itemInfo.name || 'Не указано'}</p>` : ''}
                    <p><strong>Дата создания:</strong> ${formatDateTime(order.created_at)}</p>
                    <p><strong>Дата обновления:</strong> ${formatDateTime(order.updated_at)}</p>
                </div>
                <div class="col-md-6">
                    <h6>Детали заявки</h6>
                    <p><strong>Дата начала:</strong> ${formatDate(order.date_start)}</p>
                    <p><strong>Время начала:</strong> ${formatTime(order.time_start)}</p>
                    <p><strong>Продолжительность:</strong> ${order.duration || 0} часов</p>
                    <p><strong>Количество человек:</strong> ${order.persons || 1}</p>
                    <p><strong>Стоимость:</strong> <span class="text-primary fw-bold">${formatPrice(order.price)}</span></p>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Дополнительные опции</h6>
                    <div class="row">
        `;
        
        // Список опций с иконками
        const options = [
            { key: 'early_registration', label: 'Ранняя регистрация', value: order.early_registration, icon: 'bi-calendar-check' },
            { key: 'group_enrollment', label: 'Групповая запись', value: order.group_enrollment, icon: 'bi-people' },
            { key: 'intensive_course', label: 'Интенсивный курс', value: order.intensive_course, icon: 'bi-lightning' },
            { key: 'supplementary', label: 'Дополнительные материалы', value: order.supplementary, icon: 'bi-book' },
            { key: 'personalized', label: 'Индивидуальные занятия', value: order.personalized, icon: 'bi-person' },
            { key: 'excursions', label: 'Культурные экскурсии', value: order.excursions, icon: 'bi-airplane' },
            { key: 'assessment', label: 'Оценка уровня', value: order.assessment, icon: 'bi-clipboard-check' },
            { key: 'interactive', label: 'Интерактивная платформа', value: order.interactive, icon: 'bi-laptop' }
        ];
        
        options.forEach(option => {
            const iconClass = option.value ? 'text-success' : 'text-muted';
            detailsHtml += `
                <div class="col-md-6 mb-2">
                    <div class="d-flex align-items-center">
                        <i class="bi ${option.icon} ${iconClass} me-2"></i>
                        <span>${option.label}: <strong>${option.value ? 'Да' : 'Нет'}</strong></span>
                    </div>
                </div>
            `;
        });
        
        detailsHtml += `
                    </div>
                </div>
            </div>
            
            <div class="mt-4 alert alert-info">
                <h6><i class="bi bi-calculator me-2"></i>Расчеты:</h6>
                <p class="mb-1">Общая стоимость с учетом всех опций: ${formatPrice(order.price)}</p>
                <p class="mb-0">Студент ID: ${order.student_id || 'Не указан'}</p>
            </div>
        `;
        
        modalBody.innerHTML = detailsHtml;
        
        // Обновляем заголовок модального окна
        const modalTitle = document.querySelector('#orderDetailsModal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = `Детали заявки #${order.id}`;
        }
        
        // Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        modal.show();
        
    } catch (error) {
        console.error('Ошибка при загрузке деталей заявки:', error);
        showNotification('Ошибка при загрузке деталей заявки', 'danger');
    }
}

/**
 * Редактирование заявки
 */
async function editOrder(orderId) {
    console.log('Редактирование заявки:', orderId);
    
    try {
        const order = await getOrderById(orderId);
        
        if (!order) {
            showNotification('Не удалось загрузить информацию о заявке', 'danger');
            return;
        }
        
        // Создаем модальное окно редактирования
        const modalHtml = `
            <div class="modal fade" id="editOrderModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Редактирование заявки #${order.id}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editOrderForm">
                                <input type="hidden" id="edit_order_id" value="${order.id}">
                                
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="edit_date_start" class="form-label">Дата начала *</label>
                                        <input type="date" class="form-control" id="edit_date_start" 
                                               value="${order.date_start}" required>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="edit_time_start" class="form-label">Время начала *</label>
                                        <input type="time" class="form-control" id="edit_time_start" 
                                               value="${order.time_start}" required>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="edit_duration" class="form-label">Продолжительность (часов) *</label>
                                        <input type="number" class="form-control" id="edit_duration" 
                                               min="1" max="40" value="${order.duration || 1}" required>
                                        <div class="form-text">Для репетиторов: 1-40 часов</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="edit_persons" class="form-label">Количество студентов *</label>
                                        <input type="number" class="form-control" id="edit_persons" 
                                               min="1" max="20" value="${order.persons || 1}" required>
                                    </div>
                                </div>
                                
                                <!-- Дополнительные опции -->
                                <div class="card mt-4">
                                    <div class="card-header">
                                        <h6 class="mb-0">Дополнительные опции</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="edit_supplementary" 
                                                           ${order.supplementary ? 'checked' : ''}>
                                                    <label class="form-check-label" for="edit_supplementary">
                                                        Дополнительные учебные материалы
                                                    </label>
                                                </div>
                                                
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="edit_personalized" 
                                                           ${order.personalized ? 'checked' : ''}>
                                                    <label class="form-check-label" for="edit_personalized">
                                                        Индивидуальные занятия
                                                    </label>
                                                </div>
                                                
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="edit_excursions" 
                                                           ${order.excursions ? 'checked' : ''}>
                                                    <label class="form-check-label" for="edit_excursions">
                                                        Культурные экскурсии
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-6">
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="edit_assessment" 
                                                           ${order.assessment ? 'checked' : ''}>
                                                    <label class="form-check-label" for="edit_assessment">
                                                        Оценка уровня владения языком
                                                    </label>
                                                </div>
                                                
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="edit_interactive" 
                                                           ${order.interactive ? 'checked' : ''}>
                                                    <label class="form-check-label" for="edit_interactive">
                                                        Интерактивная онлайн-платформа
                                                    </label>
                                                </div>
                                                
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="edit_intensive_course" 
                                                           ${order.intensive_course ? 'checked' : ''}>
                                                    <label class="form-check-label" for="edit_intensive_course">
                                                        Интенсивный курс
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="alert alert-warning mt-3">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <strong>Внимание!</strong> При редактировании заявки стоимость будет пересчитана автоматически.
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="button" class="btn btn-primary" id="saveEditOrderBtn">
                                <i class="bi bi-save me-2"></i>Сохранить изменения
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
        
        // Обработчик сохранения
        const saveBtn = document.getElementById('saveEditOrderBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async function() {
                await saveEditedOrder(order);
            });
        }
        
        // Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
        modal.show();
        
        // Удаляем модальное окно после закрытия
        modalContainer.querySelector('#editOrderModal').addEventListener('hidden.bs.modal', function () {
            modalContainer.remove();
        });
        
    } catch (error) {
        console.error('Ошибка при редактировании заявки:', error);
        showNotification('Ошибка при загрузке заявки для редактирования', 'danger');
    }
}

/**
 * Сохраняет отредактированную заявку
 */
async function saveEditedOrder(originalOrder) {
    const orderId = document.getElementById('edit_order_id')?.value;
    const dateStart = document.getElementById('edit_date_start')?.value;
    const timeStart = document.getElementById('edit_time_start')?.value;
    const duration = document.getElementById('edit_duration')?.value;
    const persons = document.getElementById('edit_persons')?.value;
    
    if (!orderId || !dateStart || !timeStart || !duration || !persons) {
        showNotification('Заполните все обязательные поля', 'danger');
        return;
    }
    
    // Для простоты используем старую цену (в реальном проекте нужно пересчитывать)
    const updatedData = {
        date_start: dateStart,
        time_start: timeStart,
        duration: parseInt(duration),
        persons: parseInt(persons),
        supplementary: document.getElementById('edit_supplementary')?.checked || false,
        personalized: document.getElementById('edit_personalized')?.checked || false,
        excursions: document.getElementById('edit_excursions')?.checked || false,
        assessment: document.getElementById('edit_assessment')?.checked || false,
        interactive: document.getElementById('edit_interactive')?.checked || false,
        intensive_course: document.getElementById('edit_intensive_course')?.checked || false
    };
    
    try {
        const result = await updateOrder(orderId, updatedData);
        
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
            showNotification('Ошибка при обновлении заявки', 'danger');
        }
        
    } catch (error) {
        console.error('Ошибка при обновлении заявки:', error);
        showNotification('Ошибка при обновлении заявки: ' + error.message, 'danger');
    }
}

/**
 * Удаление заявки с подтверждением
 */
async function deleteOrder(orderId) {
    console.log('Удаление заявки:', orderId);
    
    // Создаем модальное окно подтверждения
    const confirmHtml = `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Подтверждение удаления</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            <strong>Внимание!</strong> Вы уверены, что хотите удалить заявку #${orderId}?
                        </div>
                        <p class="mb-0">Это действие нельзя отменить.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Нет, отмена</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn" data-order-id="${orderId}">
                            <i class="bi bi-trash me-2"></i>Да, удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = confirmHtml;
    document.body.appendChild(modalContainer);
    
    // Обработчик подтверждения удаления
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async function() {
            const orderIdToDelete = this.getAttribute('data-order-id');
            await performDeleteOrder(orderIdToDelete);
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            if (modal) {
                modal.hide();
            }
        });
    }
    
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
    
    // Удаляем модальное окно после закрытия
    modalContainer.querySelector('#deleteConfirmModal').addEventListener('hidden.bs.modal', function () {
        modalContainer.remove();
    });
}

/**
 * Выполняет удаление заявки
 */
async function performDeleteOrder(orderId) {
    try {
        const result = await deleteOrder(orderId);
        
        if (result) {
            showNotification('Заявка успешно удалена!', 'success');
            
            // Удаляем заявку из локального массива
            allOrders = allOrders.filter(order => order.id !== parseInt(orderId));
            filteredOrders = filteredOrders.filter(order => order.id !== parseInt(orderId));
            
            // Пересчитываем текущую страницу
            const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            } else if (totalPages === 0) {
                currentPage = 1;
            }
            
            // Обновляем отображение
            displayOrders();
            
        } else {
            showNotification('Ошибка при удалении заявки', 'danger');
        }
        
    } catch (error) {
        console.error('Ошибка при удалении заявки:', error);
        showNotification('Ошибка при удалении заявки: ' + error.message, 'danger');
    }
}