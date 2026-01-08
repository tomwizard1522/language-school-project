/**
 * Страница поиска и выбора репетиторов
 */

let allTutors = [];
let selectedTutor = null;

/**
 * Инициализирует страницу репетиторов
 */
async function initTutorsPage() {
    console.log('Инициализация страницы репетиторов');
    
    try {
        // Получаем контейнер для контента
        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error('Контейнер контента не найден');
            return;
        }
        
        // Показываем загрузку
        contentDiv.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
                <p class="mt-2">Загружаем репетиторов...</p>
            </div>
        `;
        
        // Загружаем репетиторов
        const tutors = await APIService.getTutors();
        
        if (!Array.isArray(tutors)) {
            throw new Error('Некорректный ответ от сервера');
        }
        
        allTutors = tutors;
        selectedTutor = null;
        
        console.log(`Загружено ${tutors.length} репетиторов`);
        
        // Отображаем страницу
        renderTutorsPage();
        
    } catch (error) {
        console.error('Ошибка загрузки репетиторов:', error);
        showNotification(`Ошибка загрузки репетиторов: ${error.message}`, 'danger');
    }
}

/**
 * Отображает страницу репетиторов
 */
function renderTutorsPage() {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;
    
    contentDiv.innerHTML = `
        <section class="mb-5">
            <h2 class="text-center mb-4">Поиск репетитора</h2>
            
            <!-- Форма поиска -->
            <div class="row mb-4">
                <div class="col-lg-8 mx-auto">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Критерии поиска</h5>
                            <form id="tutorSearchForm">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Уровень языка</label>
                                        <select class="form-select" id="searchTutorLevel">
                                            <option value="">Все уровни</option>
                                            <option value="Beginner">Начальный</option>
                                            <option value="Intermediate">Средний</option>
                                            <option value="Advanced">Продвинутый</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Минимальный опыт (лет)</label>
                                        <select class="form-select" id="searchTutorExperience">
                                            <option value="0">Любой опыт</option>
                                            <option value="1">1+ год</option>
                                            <option value="3">3+ года</option>
                                            <option value="5">5+ лет</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Максимальная цена (₽/час)</label>
                                        <input type="number" class="form-control" id="searchTutorPrice" 
                                               placeholder="Например: 5000">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label class="form-label">Языки преподавания</label>
                                        <input type="text" class="form-control" id="searchTutorLanguages" 
                                               placeholder="Например: русский, английский">
                                    </div>
                                </div>
                                
                                <div class="mt-3">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="bi bi-search me-2"></i>Найти
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary ms-2" id="resetTutorSearch">
                                        Сбросить
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Результаты поиска -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Найденные репетиторы</h5>
                        </div>
                        <div class="card-body">
                            <div id="tutorsListContainer">
                                <!-- Список репетиторов -->
                            </div>
                            
                            <!-- Выбранный репетитор -->
                            <div id="selectedTutorContainer" class="mt-4" style="display: none;">
                                <div class="card border-primary">
                                    <div class="card-header bg-primary text-white">
                                        <h5 class="mb-0"><i class="bi bi-person-check me-2"></i>Выбранный репетитор</h5>
                                    </div>
                                    <div class="card-body">
                                        <div id="selectedTutorDetails"></div>
                                        <div class="text-end mt-3">
                                            <button class="btn btn-success" id="applyToTutorBtn">
                                                <i class="bi bi-calendar-plus me-2"></i>Записаться на занятие
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Отображаем репетиторов
    displayTutors(allTutors);
    
    // Инициализируем обработчики
    initTutorsEventListeners();
}

/**
 * Отображает список репетиторов
 */
function displayTutors(tutorsToShow = allTutors) {
    const container = document.getElementById('tutorsListContainer');
    if (!container) return;
    
    if (tutorsToShow.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info text-center">
                <h5>Репетиторы не найдены</h5>
                <p>Попробуйте изменить критерии поиска</p>
            </div>
        `;
        return;
    }
    
    let tutorsHtml = '<div class="table-responsive"><table class="table table-hover">';
    
    tutorsHtml += `
        <thead>
            <tr>
                <th>Имя</th>
                <th>Уровень</th>
                <th>Языки</th>
                <th>Опыт</th>
                <th>Стоимость</th>
                <th class="text-end">Действия</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    tutorsToShow.forEach(tutor => {
        const isSelected = selectedTutor && selectedTutor.id === tutor.id;
        const rowClass = isSelected ? 'table-primary' : '';
        
        tutorsHtml += `
            <tr class="${rowClass}" id="tutorRow${tutor.id}">
                <td>
                    <strong>${tutor.name || 'Не указано'}</strong>
                </td>
                <td>
                    <span class="badge ${getLevelBadgeClass(tutor.language_level)}">${tutor.language_level || 'Не указано'}</span>
                </td>
                <td>
                    <small>
                        ${Array.isArray(tutor.languages_offered) 
                            ? tutor.languages_offered.join(', ') 
                            : 'Не указано'}
                    </small>
                </td>
                <td>${tutor.work_experience || 0} лет</td>
                <td>
                    <strong class="text-primary">${tutor.price_per_hour || 0} ₽/час</strong>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm ${isSelected ? 'btn-success' : 'btn-outline-primary'} selectTutorBtn" 
                            data-tutor-id="${tutor.id}">
                        ${isSelected ? '<i class="bi bi-check-circle me-1"></i>Выбран' : 'Выбрать'}
                    </button>
                </td>
            </tr>
        `;
    });
    
    tutorsHtml += '</tbody></table></div>';
    container.innerHTML = tutorsHtml;
}

function getLevelBadgeClass(level) {
    if (!level) return 'bg-secondary';
    
    const levelLower = level.toLowerCase();
    
    if (levelLower.includes('beginner') || levelLower.includes('начальный')) {
        return 'bg-success text-dark'; // зеленый
    } else if (levelLower.includes('intermediate') || levelLower.includes('средний')) {
        return 'bg-warning text-dark'; // желтый
    } else if (levelLower.includes('advanced') || levelLower.includes('продвинутый')) {
        return 'bg-danger'; // красный
    }
    
    return 'bg-info';
}

/**
 * Инициализирует обработчики событий
 */
function initTutorsEventListeners() {
    // Форма поиска
    const searchForm = document.getElementById('tutorSearchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchTutors();
        });
    }
    
    // Сброс поиска
    const resetBtn = document.getElementById('resetTutorSearch');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            document.getElementById('tutorSearchForm').reset();
            selectedTutor = null;
            displayTutors(allTutors);
            hideSelectedTutor();
        });
    }
    
    // Делегирование событий для кнопок выбора
    document.addEventListener('click', function(e) {
        if (e.target.closest('.selectTutorBtn')) {
            const button = e.target.closest('.selectTutorBtn');
            const tutorId = parseInt(button.getAttribute('data-tutor-id'));
            selectTutor(tutorId);
        }
        
        if (e.target.closest('#applyToTutorBtn')) {
            if (selectedTutor) {
                showTutorApplication(selectedTutor);
            }
        }
    });
}

/**
 * Выполняет поиск репетиторов
 */
function searchTutors() {
    const level = document.getElementById('searchTutorLevel').value;
    const experience = parseInt(document.getElementById('searchTutorExperience').value) || 0;
    const maxPrice = document.getElementById('searchTutorPrice').value;
    const languages = document.getElementById('searchTutorLanguages').value.toLowerCase();
    
    const filtered = allTutors.filter(tutor => {
        // Фильтр по уровню
        if (level && tutor.language_level !== level) {
            return false;
        }
        
        // Фильтр по опыту
        if (experience > 0 && (tutor.work_experience || 0) < experience) {
            return false;
        }
        
        // Фильтр по цене
        if (maxPrice && (tutor.price_per_hour || 0) > parseInt(maxPrice)) {
            return false;
        }
        
        // Фильтр по языкам
        if (languages) {
            const searchTerms = languages.split(',').map(term => term.trim());
            const tutorLanguages = Array.isArray(tutor.languages_offered) 
                ? tutor.languages_offered.map(l => l.toLowerCase())
                : [];
            
            const hasAllLanguages = searchTerms.every(term => 
                tutorLanguages.some(lang => lang.includes(term))
            );
            
            if (!hasAllLanguages) {
                return false;
            }
        }
        
        return true;
    });
    
    selectedTutor = null;
    displayTutors(filtered);
    hideSelectedTutor();
}

/**
 * Выбирает репетитора
 */
function selectTutor(tutorId) {
    const tutor = allTutors.find(t => t.id === tutorId);
    if (!tutor) return;
    
    selectedTutor = tutor;
    
    // Обновляем стиль строк
    document.querySelectorAll('#tutorsListContainer tr').forEach(row => {
        row.classList.remove('table-primary');
    });
    
    const selectedRow = document.getElementById(`tutorRow${tutorId}`);
    if (selectedRow) {
        selectedRow.classList.add('table-primary');
    }
    
    // Обновляем кнопки
    document.querySelectorAll('.selectTutorBtn').forEach(btn => {
        const btnTutorId = parseInt(btn.getAttribute('data-tutor-id'));
        if (btnTutorId === tutorId) {
            btn.className = 'btn btn-sm btn-success selectTutorBtn';
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Выбран';
        } else {
            btn.className = 'btn btn-sm btn-outline-primary selectTutorBtn';
            btn.textContent = 'Выбрать';
        }
    });
    
    // Показываем детали выбранного репетитора
    showSelectedTutor(tutor);
}

/**
 * Показывает детали выбранного репетитора
 */
function showSelectedTutor(tutor) {
    const container = document.getElementById('selectedTutorContainer');
    const details = document.getElementById('selectedTutorDetails');
    
    if (!container || !details) return;
    
    details.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h4>${tutor.name || 'Репетитор'}</h4>
                <p><strong>Уровень:</strong> <span class="badge bg-info">${tutor.language_level || 'Не указано'}</span></p>
                <p><strong>Опыт работы:</strong> ${tutor.work_experience || 0} лет</p>
                
                <div class="row mt-3">
                    <div class="col-6">
                        <h6>Языки преподавания:</h6>
                        <ul>
                            ${Array.isArray(tutor.languages_offered) 
                                ? tutor.languages_offered.map(lang => `<li>${lang}</li>`).join('')
                                : '<li>Не указано</li>'}
                        </ul>
                    </div>
                    <div class="col-6">
                        <h6>Другие языки:</h6>
                        <ul>
                            ${Array.isArray(tutor.languages_spoken) 
                                ? tutor.languages_spoken.map(lang => `<li>${lang}</li>`).join('')
                                : '<li>Не указано</li>'}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 class="text-primary">${tutor.price_per_hour || 0} ₽</h3>
                        <p class="text-muted">в час</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.style.display = 'block';
}

/**
 * Скрывает блок выбранного репетитора
 */
function hideSelectedTutor() {
    const container = document.getElementById('selectedTutorContainer');
    if (container) {
        container.style.display = 'none';
    }
}

/**
 * Показывает форму заявки на занятия с репетитором
 */
async function showTutorApplication(tutor) {
    if (!tutor) return;
    
    // Создаем модальное окно
    const modalHtml = `
        <div class="modal fade" id="tutorApplicationModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Заявка на занятия с ${tutor.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="tutorApplicationForm">
                            <input type="hidden" name="tutor_id" value="${tutor.id}">
                            <input type="hidden" name="course_id" value="0">
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Дата занятия *</label>
                                    <input type="date" class="form-control" name="date_start" 
                                           min="${new Date().toISOString().split('T')[0]}" required>
                                </div>
                                
                                <div class="col-md-6">
                                    <label class="form-label">Время занятия *</label>
                                    <select class="form-select" name="time_start" required>
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
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Продолжительность (часов) *</label>
                                    <select class="form-select" name="duration" required>
                                        <option value="">Выберите</option>
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
                                    <label class="form-label">Количество студентов *</label>
                                    <input type="number" class="form-control" name="persons" 
                                           min="1" max="20" value="1" required>
                                </div>
                            </div>
                            
                            <!-- Дополнительные опции -->
                            <div class="card mb-3">
                                <div class="card-header">Дополнительные опции</div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" name="supplementary">
                                                <label class="form-check-label">Дополнительные материалы (+2000 ₽)</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" name="assessment">
                                                <label class="form-check-label">Оценка уровня (+300 ₽)</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" name="personalized">
                                                <label class="form-check-label">Индивидуальные занятия (+1500 ₽/неделя)</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Расчет стоимости -->
                            <div class="card">
                                <div class="card-header">Расчет стоимости</div>
                                <div class="card-body">
                                    <h4 id="tutorCalculatedPrice">0 ₽</h4>
                                    <p class="text-muted small">Стоимость рассчитывается автоматически</p>
                                    <button type="button" class="btn btn-outline-primary btn-sm" id="calculateTutorPrice">
                                        <i class="bi bi-calculator me-1"></i>Рассчитать
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" id="submitTutorApplication">
                            Отправить заявку
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Инициализируем обработчики
    initTutorApplicationForm(tutor);
    
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('tutorApplicationModal'));
    modal.show();
    
    // Удаляем после закрытия
    modalContainer.querySelector('#tutorApplicationModal').addEventListener('hidden.bs.modal', function() {
        modalContainer.remove();
    });
}

/**
 * Инициализирует форму заявки на репетитора
 */
function initTutorApplicationForm(tutor) {
    // Функция расчета стоимости
    function calculateTutorPrice() {
        const form = document.getElementById('tutorApplicationForm');
        if (!form) return;
        
        const dateInput = form.querySelector('input[name="date_start"]');
        const timeSelect = form.querySelector('select[name="time_start"]');
        const durationSelect = form.querySelector('select[name="duration"]');
        const personsInput = form.querySelector('input[name="persons"]');
        const priceElement = document.getElementById('tutorCalculatedPrice');
        
        if (!dateInput || !timeSelect || !durationSelect || !personsInput || !priceElement) {
            return;
        }
        
        const dateStr = dateInput.value;
        const timeStr = timeSelect.value;
        const duration = parseInt(durationSelect.value) || 0;
        const persons = parseInt(personsInput.value) || 1;
        
        if (!dateStr || !timeStr || !duration || !persons) {
            priceElement.textContent = '0 ₽';
            return;
        }
        
        try {
            // Базовая стоимость
            const hourlyRate = tutor.price_per_hour || 0;
            let totalPrice = hourlyRate * duration * persons;
            
            // Доплаты за время
            const hour = parseInt(timeStr.split(':')[0]);
            if (hour >= 9 && hour < 12) {
                totalPrice += 400 * persons;
            } else if (hour >= 18 && hour < 20) {
                totalPrice += 1000 * persons;
            }
            
            // Множитель выходных
            const date = new Date(dateStr);
            const dayOfWeek = date.getDay();
            const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
            if (isWeekend) {
                totalPrice *= 1.5;
            }
            
            // Дополнительные опции
            const supplementary = form.querySelector('input[name="supplementary"]')?.checked;
            const assessment = form.querySelector('input[name="assessment"]')?.checked;
            const personalized = form.querySelector('input[name="personalized"]')?.checked;
            
            if (supplementary) totalPrice += 2000 * persons;
            if (assessment) totalPrice += 300;
            if (personalized) {
                // Индивидуальные занятия: +1500 ₽ за каждую неделю курса
                // Для репетиторов считаем неделю как 5 часов занятий
                const weeks = Math.ceil(duration / 5);
                totalPrice += 1500 * weeks;
            }
            
            // Групповая скидка
            if (persons >= 5) {
                totalPrice *= 0.85; // -15%
            }
            
            // Округляем
            totalPrice = Math.round(totalPrice);
            
            priceElement.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
            
        } catch (error) {
            console.error('Ошибка расчета:', error);
            priceElement.textContent = 'Ошибка расчета';
        }
    }
    
    // Обработчики событий
    const form = document.getElementById('tutorApplicationForm');
    if (form) {
        form.addEventListener('change', calculateTutorPrice);
        form.addEventListener('input', calculateTutorPrice);
    }
    
    const calculateBtn = document.getElementById('calculateTutorPrice');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTutorPrice);
    }
    
    const submitBtn = document.getElementById('submitTutorApplication');
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            await submitTutorApplication(tutor);
        });
    }
    
    // Первоначальный расчет
    setTimeout(calculateTutorPrice, 100);
}

/**
 * Отправляет заявку на занятия с репетитором
 */
async function submitTutorApplication(tutor) {
    try {
        const form = document.getElementById('tutorApplicationForm');
        if (!form) return;
        
        // Собираем данные
        const dateStr = form.querySelector('input[name="date_start"]').value;
        const timeStr = form.querySelector('select[name="time_start"]').value;
        const duration = parseInt(form.querySelector('select[name="duration"]').value);
        const persons = parseInt(form.querySelector('input[name="persons"]').value);
        const priceElement = document.getElementById('tutorCalculatedPrice');
        const totalPrice = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
        
        if (!dateStr || !timeStr || !duration || !persons || !totalPrice || totalPrice === 0) {
            showNotification('Заполните все поля и рассчитайте стоимость', 'warning');
            return;
        }
        
        // Подготавливаем данные заявки
        const orderData = {
            course_id: 0,
            tutor_id: tutor.id,
            date_start: dateStr,
            time_start: timeStr,
            duration: duration,
            persons: persons,
            price: totalPrice,
            early_registration: false,
            group_enrollment: persons >= 5,
            intensive_course: false,
            supplementary: form.querySelector('input[name="supplementary"]')?.checked || false,
            personalized: form.querySelector('input[name="personalized"]')?.checked || false,
            excursions: false,
            assessment: form.querySelector('input[name="assessment"]')?.checked || false,
            interactive: false
        };
        
        console.log('Отправка заявки на репетитора:', orderData);
        
        // Отправляем заявку
        const result = await APIService.createOrder(orderData);
        
        if (result) {
            showNotification('Заявка успешно отправлена!', 'success');
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('tutorApplicationModal'));
            if (modal) {
                modal.hide();
            }
            
            // Сбрасываем выбор репетитора
            selectedTutor = null;
            hideSelectedTutor();
            
        } else {
            throw new Error('Не удалось отправить заявку');
        }
        
    } catch (error) {
        console.error('Ошибка отправки заявки:', error);
        showNotification(`Ошибка: ${error.message}`, 'danger');
    }
}

// Экспортируем функции
window.initTutorsPage = initTutorsPage;