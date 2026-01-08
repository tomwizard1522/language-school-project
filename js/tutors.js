/**
 * Скрипт для работы с репетиторами
 */

let allTutors = [];
let filteredTutors = [];
let selectedTutorId = null;

/**
 * Инициализирует страницу поиска репетиторов
 */
async function initTutorsPage() {
    console.log('Инициализация страницы репетиторов');
    
    showNotification('Загружаем список репетиторов...', 'info', 2000);
    
    try {
        const tutors = await getTutors();
        
        if (!tutors || tutors.length === 0) {
            showNotification('Репетиторы временно недоступны', 'warning');
            allTutors = [];
            filteredTutors = [];
            return;
        }
        
        allTutors = tutors;
        filteredTutors = [...allTutors];
        
        showNotification(`Загружено ${tutors.length} репетиторов`, 'success', 2000);
        
        // Рендерим страницу поиска репетиторов
        renderTutorsSearchPage();
        
        // Инициализируем обработчики
        initTutorsEventListeners();
        
    } catch (error) {
        console.error('Ошибка при загрузке репетиторов:', error);
        showNotification('Ошибка при загрузке репетиторов', 'danger');
    }
}

/**
 * Рендерит страницу поиска репетиторов
 */
function renderTutorsSearchPage() {
    const contentDiv = document.getElementById('content');
    
    if (!contentDiv) return;
    
    contentDiv.innerHTML = `
        <!-- Поиск репетиторов -->
        <section id="tutors-search" class="mb-5">
            <h2 class="text-center mb-4">Найдите репетитора</h2>
            
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <!-- Форма поиска -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">Критерии поиска</h5>
                            <form id="search-tutor-form">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="tutor-language-level" class="form-label">Уровень языка</label>
                                        <select class="form-select" id="tutor-language-level">
                                            <option value="">Все уровни</option>
                                            <option value="Beginner">Начальный</option>
                                            <option value="Intermediate">Средний</option>
                                            <option value="Advanced">Продвинутый</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="tutor-experience" class="form-label">Опыт работы (лет)</label>
                                        <select class="form-select" id="tutor-experience">
                                            <option value="">Любой опыт</option>
                                            <option value="1">1+ год</option>
                                            <option value="3">3+ года</option>
                                            <option value="5">5+ лет</option>
                                            <option value="10">10+ лет</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-12">
                                        <label for="tutor-languages" class="form-label">Языки преподавания</label>
                                        <input type="text" class="form-control" id="tutor-languages" 
                                               placeholder="Например: русский, английский">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="tutor-price-min" class="form-label">Минимальная цена (₽/час)</label>
                                        <input type="number" class="form-control" id="tutor-price-min" 
                                               placeholder="0" min="0">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="tutor-price-max" class="form-label">Максимальная цена (₽/час)</label>
                                        <input type="number" class="form-control" id="tutor-price-max" 
                                               placeholder="10000" min="0">
                                    </div>
                                </div>
                                
                                <div class="mt-4">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="bi bi-search me-2"></i>Найти репетитора
                                    </button>
                                    <button type="button" id="reset-tutor-search" class="btn btn-outline-secondary ms-2">
                                        <i class="bi bi-arrow-clockwise me-2"></i>Сбросить
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Результаты поиска -->
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Найденные репетиторы</h5>
                        </div>
                        <div class="card-body">
                            <div id="tutors-results-info" class="alert alert-light mb-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span>
                                        <i class="bi bi-info-circle me-2"></i>
                                        Найдено репетиторов: <strong id="tutors-count">${filteredTutors.length}</strong>
                                    </span>
                                    <button class="btn btn-sm btn-outline-primary" id="show-tutor-application-btn" style="display: none;">
                                        <i class="bi bi-person-check me-1"></i>Оформить заявку
                                    </button>
                                </div>
                            </div>
                            
                            <div id="tutors-list">
                                <!-- Список репетиторов будет загружен здесь -->
                            </div>
                            
                            <div id="selected-tutor-details" class="mt-4" style="display: none;">
                                <!-- Детали выбранного репетитора -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Отображаем список репетиторов
    displayTutorsList();
}

/**
 * Отображает список репетиторов
 */
function displayTutorsList() {
    const tutorsList = document.getElementById('tutors-list');
    const tutorsCount = document.getElementById('tutors-count');
    
    if (!tutorsList || !tutorsCount) return;
    
    tutorsCount.textContent = filteredTutors.length;
    
    if (filteredTutors.length === 0) {
        tutorsList.innerHTML = `
            <div class="alert alert-info text-center">
                <h5>Репетиторы не найдены</h5>
                <p>Попробуйте изменить критерии поиска</p>
            </div>
        `;
        return;
    }
    
    // Создаем таблицу репетиторов
    let tableHtml = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Фото</th>
                        <th scope="col">Имя</th>
                        <th scope="col">Уровень</th>
                        <th scope="col">Языки</th>
                        <th scope="col">Опыт</th>
                        <th scope="col">Стоимость</th>
                        <th scope="col" class="text-end">Выбор</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredTutors.forEach(tutor => {
        const isSelected = selectedTutorId === tutor.id;
        const rowClass = isSelected ? 'table-primary' : '';
        
        tableHtml += `
            <tr class="${rowClass}" id="tutor-row-${tutor.id}">
                <td>
                    <div class="avatar-placeholder" style="width: 40px; height: 40px; background-color: #e9ecef; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="bi bi-person-fill text-secondary"></i>
                    </div>
                </td>
                <td>
                    <strong>${tutor.name || 'Не указано'}</strong>
                </td>
                <td>
                    <span class="badge bg-info">${tutor.language_level || 'Не указано'}</span>
                </td>
                <td>
                    <small>${(tutor.languages_offered || []).slice(0, 2).join(', ')}</small>
                </td>
                <td>
                    ${tutor.work_experience || 0} лет
                </td>
                <td>
                    <strong class="text-primary">${formatPrice(tutor.price_per_hour || 0)}/час</strong>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm ${isSelected ? 'btn-success' : 'btn-outline-primary'} select-tutor-btn" 
                            data-tutor-id="${tutor.id}">
                        ${isSelected ? '<i class="bi bi-check-circle me-1"></i>Выбран' : 'Выбрать'}
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableHtml += `
                </tbody>
            </table>
        </div>
    `;
    
    tutorsList.innerHTML = tableHtml;
    
    // Показываем кнопку оформления заявки если репетитор выбран
    const applicationBtn = document.getElementById('show-tutor-application-btn');
    if (applicationBtn) {
        applicationBtn.style.display = selectedTutorId ? 'block' : 'none';
    }
}

/**
 * Инициализирует обработчики событий для страницы репетиторов
 */
function initTutorsEventListeners() {
    const searchForm = document.getElementById('search-tutor-form');
    const resetBtn = document.getElementById('reset-tutor-search');
    const applicationBtn = document.getElementById('show-tutor-application-btn');
    
    // Форма поиска
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchTutors();
        });
    }
    
    // Кнопка сброса
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetTutorsSearch();
        });
    }
    
    // Кнопка оформления заявки
    if (applicationBtn) {
        applicationBtn.addEventListener('click', function() {
            showTutorApplicationModal();
        });
    }
    
    // Делегирование событий для кнопок выбора репетитора
    document.addEventListener('click', function(e) {
        if (e.target.closest('.select-tutor-btn')) {
            const button = e.target.closest('.select-tutor-btn');
            const tutorId = parseInt(button.getAttribute('data-tutor-id'));
            selectTutor(tutorId);
        }
    });
    
    // Реальный поиск при изменении полей
    document.querySelectorAll('#search-tutor-form input, #search-tutor-form select').forEach(element => {
        element.addEventListener('input', function() {
            searchTutors();
        });
        
        element.addEventListener('change', function() {
            searchTutors();
        });
    });
}

/**
 * Выполняет поиск репетиторов по критериям
 */
function searchTutors() {
    const levelSelect = document.getElementById('tutor-language-level');
    const experienceSelect = document.getElementById('tutor-experience');
    const languagesInput = document.getElementById('tutor-languages');
    const priceMinInput = document.getElementById('tutor-price-min');
    const priceMaxInput = document.getElementById('tutor-price-max');
    
    const searchLevel = levelSelect ? levelSelect.value : '';
    const searchExperience = experienceSelect ? experienceSelect.value : '';
    const searchLanguages = languagesInput ? languagesInput.value.toLowerCase() : '';
    const priceMin = priceMinInput ? parseInt(priceMinInput.value) || 0 : 0;
    const priceMax = priceMaxInput ? parseInt(priceMaxInput.value) || Infinity : Infinity;
    
    // Фильтруем репетиторов
    filteredTutors = allTutors.filter(tutor => {
        // Фильтр по уровню
        if (searchLevel && tutor.language_level !== searchLevel) {
            return false;
        }
        
        // Фильтр по опыту
        if (searchExperience && tutor.work_experience < parseInt(searchExperience)) {
            return false;
        }
        
        // Фильтр по языкам
        if (searchLanguages) {
            const searchTerms = searchLanguages.split(',').map(term => term.trim());
            const tutorLanguages = [...(tutor.languages_offered || []), ...(tutor.languages_spoken || [])]
                .map(lang => lang.toLowerCase());
            
            const hasAllLanguages = searchTerms.every(term => 
                tutorLanguages.some(lang => lang.includes(term))
            );
            
            if (!hasAllLanguages) {
                return false;
            }
        }
        
        // Фильтр по цене
        const tutorPrice = tutor.price_per_hour || 0;
        if (tutorPrice < priceMin || tutorPrice > priceMax) {
            return false;
        }
        
        return true;
    });
    
    // Сбрасываем выбранного репетитора при новом поиске
    selectedTutorId = null;
    
    // Обновляем отображение
    displayTutorsList();
    updateSelectedTutorDetails();
}

/**
 * Сбрасывает фильтры поиска репетиторов
 */
function resetTutorsSearch() {
    const searchForm = document.getElementById('search-tutor-form');
    
    if (searchForm) {
        searchForm.reset();
    }
    
    filteredTutors = [...allTutors];
    selectedTutorId = null;
    
    displayTutorsList();
    updateSelectedTutorDetails();
    
    showNotification('Фильтры поиска сброшены', 'info', 2000);
}

/**
 * Выбирает репетитора
 */
function selectTutor(tutorId) {
    selectedTutorId = tutorId;
    
    // Обновляем выделение в таблице
    document.querySelectorAll('#tutors-list tr').forEach(row => {
        row.classList.remove('table-primary');
    });
    
    const selectedRow = document.getElementById(`tutor-row-${tutorId}`);
    if (selectedRow) {
        selectedRow.classList.add('table-primary');
    }
    
    // Обновляем кнопки выбора
    document.querySelectorAll('.select-tutor-btn').forEach(button => {
        const buttonTutorId = parseInt(button.getAttribute('data-tutor-id'));
        
        if (buttonTutorId === tutorId) {
            button.className = 'btn btn-sm btn-success select-tutor-btn';
            button.innerHTML = '<i class="bi bi-check-circle me-1"></i>Выбран';
        } else {
            button.className = 'btn btn-sm btn-outline-primary select-tutor-btn';
            button.textContent = 'Выбрать';
        }
    });
    
    // Показываем кнопку оформления заявки
    const applicationBtn = document.getElementById('show-tutor-application-btn');
    if (applicationBtn) {
        applicationBtn.style.display = 'block';
    }
    
    // Обновляем детали выбранного репетитора
    updateSelectedTutorDetails();
    
    showNotification('Репетитор выбран', 'success', 2000);
}

/**
 * Обновляет отображение деталей выбранного репетитора
 */
function updateSelectedTutorDetails() {
    const detailsContainer = document.getElementById('selected-tutor-details');
    
    if (!detailsContainer) return;
    
    if (!selectedTutorId) {
        detailsContainer.style.display = 'none';
        return;
    }
    
    const selectedTutor = allTutors.find(tutor => tutor.id === selectedTutorId);
    
    if (!selectedTutor) {
        detailsContainer.style.display = 'none';
        return;
    }
    
    detailsContainer.style.display = 'block';
    detailsContainer.innerHTML = `
        <div class="card border-primary">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-person-check me-2"></i>Выбранный репетитор</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <h4>${selectedTutor.name || 'Не указано'}</h4>
                        <p class="text-muted">
                            <i class="bi bi-award me-2"></i>
                            Уровень: <span class="badge bg-info">${selectedTutor.language_level || 'Не указано'}</span>
                        </p>
                        
                        <div class="row mt-3">
                            <div class="col-6">
                                <h6>Языки преподавания:</h6>
                                <ul class="list-unstyled">
                                    ${(selectedTutor.languages_offered || []).map(lang => 
                                        `<li><i class="bi bi-check-circle text-success me-2"></i>${lang}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                            <div class="col-6">
                                <h6>Другие языки:</h6>
                                <ul class="list-unstyled">
                                    ${(selectedTutor.languages_spoken || []).map(lang => 
                                        `<li><i class="bi bi-chat-dots text-muted me-2"></i>${lang}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h5 class="card-title">${formatPrice(selectedTutor.price_per_hour || 0)}</h5>
                                <p class="card-text">в час</p>
                                <p class="text-muted small mb-3">Опыт: ${selectedTutor.work_experience || 0} лет</p>
                                <button class="btn btn-primary w-100" id="book-tutor-btn">
                                    <i class="bi bi-calendar-plus me-2"></i>Забронировать занятие
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем обработчик для кнопки бронирования
    const bookBtn = document.getElementById('book-tutor-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', function() {
            showTutorApplicationModal();
        });
    }
}

/**
 * Показывает модальное окно оформления заявки на занятия с репетитором
 */
async function showTutorApplicationModal() {
    if (!selectedTutorId) {
        showNotification('Сначала выберите репетитора', 'warning');
        return;
    }
    
    const selectedTutor = allTutors.find(tutor => tutor.id === selectedTutorId);
    
    if (!selectedTutor) {
        showNotification('Информация о репетиторе не найдена', 'danger');
        return;
    }
    
    // Создаем модальное окно
    const modalHtml = `
        <div class="modal fade" id="tutorApplicationModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Заявка на занятия с репетитором</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="tutorApplicationForm">
                            <input type="hidden" id="tutor_id" value="${selectedTutor.id}">
                            <input type="hidden" id="course_id" value="0">
                            
                            <!-- Информация о репетиторе -->
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <h6>${selectedTutor.name}</h6>
                                            <p class="mb-1"><strong>Уровень:</strong> ${selectedTutor.language_level}</p>
                                            <p class="mb-1"><strong>Опыт:</strong> ${selectedTutor.work_experience} лет</p>
                                            <p class="mb-0"><strong>Стоимость:</strong> ${formatPrice(selectedTutor.price_per_hour)}/час</p>
                                        </div>
                                        <div class="col-md-4 text-end">
                                            <h4 class="text-primary" id="tutor-total-price">0 ₽</h4>
                                            <p class="text-muted small">Итоговая стоимость</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Поля формы -->
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="tutor-date-start" class="form-label">Дата первого занятия *</label>
                                    <input type="date" class="form-control" id="tutor-date-start" 
                                           min="${new Date().toISOString().split('T')[0]}" required>
                                </div>
                                
                                <div class="col-md-6">
                                    <label for="tutor-time-start" class="form-label">Время занятия *</label>
                                    <select class="form-select" id="tutor-time-start" required>
                                        <option value="">Выберите время</option>
                                        <option value="09:00">09:00</option>
                                        <option value="10:00">10:00</option>
                                        <option value="11:00">11:00</option>
                                        <option value="12:00">12:00</option>
                                        <option value="13:00">13:00</option>
                                        <option value="14:00">14:00</option>
                                        <option value="15:00">15:00</option>
                                        <option value="16:00">16:00</option>
                                        <option value="17:00">17:00</option>
                                        <option value="18:00">18:00</option>
                                        <option value="19:00">19:00</option>
                                        <option value="20:00">20:00</option>
                                    </select>
                                </div>
                                
                                <div class="col-md-6">
                                    <label for="tutor-duration" class="form-label">Продолжительность (часов) *</label>
                                    <select class="form-select" id="tutor-duration" required>
                                        <option value="">Выберите продолжительность</option>
                                        <option value="1">1 час</option>
                                        <option value="2">2 часа</option>
                                        <option value="3">3 часа</option>
                                        <option value="4">4 часа</option>
                                        <option value="5">5 часов</option>
                                        <option value="10">10 часов</option>
                                        <option value="20">20 часов</option>
                                        <option value="30">30 часов</option>
                                        <option value="40">40 часов</option>
                                    </select>
                                </div>
                                
                                <div class="col-md-6">
                                    <label for="tutor-persons" class="form-label">Количество студентов *</label>
                                    <input type="number" class="form-control" id="tutor-persons" 
                                           min="1" max="20" value="1" required>
                                    <div class="form-text">От 1 до 20 человек</div>
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
                                                <input class="form-check-input" type="checkbox" id="tutor-assessment">
                                                <label class="form-check-label" for="tutor-assessment">
                                                    Оценка уровня владения языком (+300 ₽)
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="tutor-supplementary">
                                                <label class="form-check-label" for="tutor-supplementary">
                                                    Дополнительные материалы (+2000 ₽ на человека)
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="alert alert-info mt-3">
                                        <h6 class="alert-heading">Автоматические скидки:</h6>
                                        <p class="mb-0">• Групповая запись (5+ человек) → -15%</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" id="submitTutorApplicationBtn" disabled>
                            <i class="bi bi-check-circle me-2"></i>Отправить заявку
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
    
    // Инициализируем обработчики
    initTutorApplicationForm(selectedTutor);
    
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('tutorApplicationModal'));
    modal.show();
    
    // Удаляем модальное окно после закрытия
    modalContainer.querySelector('#tutorApplicationModal').addEventListener('hidden.bs.modal', function () {
        modalContainer.remove();
    });
}

/**
 * Инициализирует форму заявки на занятия с репетитором
 */
function initTutorApplicationForm(tutor) {
    const dateInput = document.getElementById('tutor-date-start');
    const timeSelect = document.getElementById('tutor-time-start');
    const durationSelect = document.getElementById('tutor-duration');
    const personsInput = document.getElementById('tutor-persons');
    const submitBtn = document.getElementById('submitTutorApplicationBtn');
    
    // Функция для расчета стоимости
    const calculateTutorPrice = () => {
        const date = dateInput?.value;
        const time = timeSelect?.value;
        const duration = parseInt(durationSelect?.value) || 0;
        const persons = parseInt(personsInput?.value) || 1;
        const totalPriceElement = document.getElementById('tutor-total-price');
        
        if (!date || !time || !duration || !persons) {
            if (totalPriceElement) totalPriceElement.textContent = '0 ₽';
            if (submitBtn) submitBtn.disabled = true;
            return;
        }
        
        // Базовая стоимость
        const hourlyRate = tutor.price_per_hour || 0;
        let totalPrice = hourlyRate * duration * persons;
        
        // Доплаты за время
        const hour = parseInt(time.split(':')[0]);
        let timeSurcharge = 0;
        
        if (hour >= 9 && hour < 12) {
            timeSurcharge = 400 * persons;
        } else if (hour >= 18 && hour < 20) {
            timeSurcharge = 1000 * persons;
        }
        
        totalPrice += timeSurcharge;
        
        // Дополнительные опции
        if (document.getElementById('tutor-assessment')?.checked) {
            totalPrice += 300;
        }
        
        if (document.getElementById('tutor-supplementary')?.checked) {
            totalPrice += 2000 * persons;
        }
        
        // Скидка за групповую запись
        if (persons >= 5) {
            totalPrice *= 0.85; // -15%
        }
        
        // Округляем
        totalPrice = Math.round(totalPrice);
        
        // Обновляем отображение
        if (totalPriceElement) {
            totalPriceElement.textContent = formatPrice(totalPrice);
        }
        
        // Активируем кнопку
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    };
    
    // Обработчики событий для расчета
    [dateInput, timeSelect, durationSelect, personsInput].forEach(element => {
        if (element) {
            element.addEventListener('change', calculateTutorPrice);
        }
    });
    
    // Чекбоксы
    document.querySelectorAll('#tutorApplicationForm input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculateTutorPrice);
    });
    
    // Обработка отправки формы
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            await submitTutorApplication(tutor);
        });
    }
    
    // Автоматический расчет при загрузке
    setTimeout(calculateTutorPrice, 100);
}

/**
 * Отправляет заявку на занятия с репетитором
 */
async function submitTutorApplication(tutor) {
    const tutorId = document.getElementById('tutor_id')?.value;
    const dateStart = document.getElementById('tutor-date-start')?.value;
    const timeStart = document.getElementById('tutor-time-start')?.value;
    const duration = document.getElementById('tutor-duration')?.value;
    const persons = document.getElementById('tutor-persons')?.value;
    const totalPrice = document.getElementById('tutor-total-price')?.textContent;
    
    if (!tutorId || !dateStart || !timeStart || !duration || !persons) {
        showNotification('Заполните все обязательные поля', 'danger');
        return;
    }
    
    // Преобразуем цену из формата "1 234 ₽" в число
    const priceNumber = parseInt(totalPrice.replace(/[^\d]/g, ''));
    
    // Собираем данные заявки
    const orderData = {
        course_id: 0,
        tutor_id: parseInt(tutorId),
        date_start: dateStart,
        time_start: timeStart,
        duration: parseInt(duration),
        persons: parseInt(persons),
        price: priceNumber,
        early_registration: false, // Для репетиторов не применяется
        group_enrollment: parseInt(persons) >= 5,
        intensive_course: false,
        supplementary: document.getElementById('tutor-supplementary')?.checked || false,
        personalized: false,
        excursions: false,
        assessment: document.getElementById('tutor-assessment')?.checked || false,
        interactive: false
    };
    
    console.log('Отправка заявки на репетитора:', orderData);
    
    try {
        const result = await createOrder(orderData);
        
        if (result) {
            showNotification('Заявка на занятия с репетитором успешно отправлена!', 'success');
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('tutorApplicationModal'));
            if (modal) {
                modal.hide();
            }
            
            // Сбрасываем выбор репетитора
            selectedTutorId = null;
            
            // Обновляем отображение
            displayTutorsList();
            updateSelectedTutorDetails();
            
        } else {
            showNotification('Ошибка при отправке заявки', 'danger');
        }
        
    } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        showNotification('Ошибка при отправке заявки: ' + error.message, 'danger');
    }
}