/**
 * Главная страница Language School
 * Работа с курсами и оформление заявок
 */

// Глобальные переменные
let allCourses = [];
let currentCoursesPage = 1;
const COURSES_PER_PAGE = 10;

/**
 * Загружает курсы и отображает их
 */
async function loadCourses() {
    try {
        console.log('Загрузка курсов...');
        
        const contentDiv = document.getElementById('content');
        if (!contentDiv) return;
        
        // Показываем загрузку
        contentDiv.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
                <p class="mt-2">Загружаем курсы...</p>
            </div>
        `;
        
        // Загружаем курсы через API
        const courses = await APIService.getCourses();
        
        if (!Array.isArray(courses)) {
            throw new Error('Некорректный ответ от сервера');
        }
        
        allCourses = courses;
        
        console.log(`Загружено ${courses.length} курсов`);
        
        // Отображаем контент
        renderMainContent();
        
        // Инициализируем поиск
        initSearch();
        
    } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
        showNotification(`Ошибка загрузки курсов: ${error.message}`, 'danger');
        
        // Показываем fallback контент
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Не удалось загрузить курсы</h4>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-primary mt-2">Обновить страницу</button>
                </div>
            `;
        }
    }
}

/**
 * Отображает главный контент
 */
function renderMainContent() {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;
    
    contentDiv.innerHTML = `
        <!-- О школе -->
        <section id="about" class="mb-5">
            <h2 class="text-center mb-4">О нашей языковой школе</h2>
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">Language Master</h3>
                            <p class="card-text">
                                Наша миссия — предоставлять качественное образование всем, кто заинтересован в изучении иностранных языков. 
                                Мы предлагаем разнообразные курсы для всех уровней подготовки.
                            </p>
                            <p class="card-text">
                                С 2014 года мы обучили более 5000 студентов, которые теперь свободно говорят на иностранных языках 
                                и используют их в работе и путешествиях.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Преимущества -->
        <section id="advantages" class="mb-5">
            <h2 class="text-center mb-4">Преимущества изучения иностранного языка</h2>
            <div class="row g-4">
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="bi bi-globe display-4 text-primary mb-3"></i>
                            <h5 class="card-title">Международное общение</h5>
                            <p class="card-text">Общайтесь с людьми по всему миру</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="bi bi-briefcase display-4 text-primary mb-3"></i>
                            <h5 class="card-title">Карьерный рост</h5>
                            <p class="card-text">Новые возможности на рынке труда</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="bi bi-airplane display-4 text-primary mb-3"></i>
                            <h5 class="card-title">Путешествия</h5>
                            <p class="card-text">Свободное общение в поездках</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="bi bi-cpu display-4 text-primary mb-3"></i>
                            <h5 class="card-title">Развитие мозга</h5>
                            <p class="card-text">Улучшение памяти и мышления</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Курсы -->
        <section id="courses" class="mb-5">
            <h2 class="text-center mb-4">Наши курсы</h2>
            
            <!-- Поиск курсов -->
            <div class="row mb-4">
                <div class="col-md-8 mx-auto">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Поиск курсов</h5>
                            <form id="search-course-form">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <input type="text" class="form-control" id="search-name" 
                                               placeholder="Название курса">
                                    </div>
                                    <div class="col-md-6">
                                        <select class="form-select" id="search-level">
                                            <option value="">Все уровни</option>
                                            <option value="Beginner">Начальный</option>
                                            <option value="Intermediate">Средний</option>
                                            <option value="Advanced">Продвинутый</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="bi bi-search me-2"></i>Найти
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary ms-2" id="reset-search">
                                        Сбросить
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Список курсов -->
            <div id="courses-container">
                <!-- Курсы будут загружены здесь -->
            </div>
            
            <!-- Пагинация -->
            <nav id="courses-pagination" class="mt-4"></nav>
        </section>
        
        <!-- Репетиторы -->
        <section id="tutors" class="mb-5">
            <h2 class="text-center mb-4">Наши репетиторы</h2>
            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div class="card">
                        <div class="card-body text-center">
                            <i class="bi bi-people display-4 text-muted mb-3"></i>
                            <h5>Ищите индивидуального преподавателя?</h5>
                            <p>Воспользуйтесь поиском репетиторов</p>
                            <a href="#" class="btn btn-primary" id="find-tutor-btn">
                                <i class="bi bi-search me-2"></i>Найти репетитора
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Отображаем курсы
    displayCourses(allCourses);
    
    // Инициализируем обработчики
    initCourseEventListeners();
}

/**
 * Отображает курсы с пагинацией
 */
function displayCourses(coursesToShow = allCourses) {
    const container = document.getElementById('courses-container');
    const pagination = document.getElementById('courses-pagination');
    
    if (!container || !pagination) return;
    
    // Пагинация
    const totalPages = Math.ceil(coursesToShow.length / COURSES_PER_PAGE);
    const startIndex = (currentCoursesPage - 1) * COURSES_PER_PAGE;
    const endIndex = startIndex + COURSES_PER_PAGE;
    const currentCourses = coursesToShow.slice(startIndex, endIndex);
    
    // Отображаем курсы
    if (currentCourses.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info text-center">
                <h5>Курсы не найдены</h5>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        pagination.innerHTML = '';
        return;
    }
    
    let coursesHtml = '<div class="row g-4">';
    
    currentCourses.forEach(course => {
        coursesHtml += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${course.name || 'Курс'}</h5>
                        <p class="card-text">
                            <small class="text-muted">
                                <i class="bi bi-person me-1"></i>
                                ${course.teacher || 'Преподаватель не указан'}
                            </small>
                        </p>
                        <p class="card-text">
                            <span class="badge ${getLevelBadgeClass(course.level)}">${course.level || 'Не указано'}</span>
                        </p>
                        <p class="card-text">
                            <i class="bi bi-clock me-1"></i>
                            ${course.total_length || 0} недель
                        </p>
                        <p class="card-text">
                            <i class="bi bi-cash me-1"></i>
                            <strong>${course.course_fee_per_hour || 0} ₽/час</strong>
                        </p>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline-info view-course-details" 
                                    data-course-id="${course.id}">
                                <i class="bi bi-info-circle me-1"></i>Подробнее
                            </button>
                            <button class="btn btn-sm btn-primary ms-2 apply-for-course" 
                                    data-course-id="${course.id}">
                                <i class="bi bi-pencil-square me-1"></i>Записаться
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    coursesHtml += '</div>';
    container.innerHTML = coursesHtml;
    
    // Пагинация Bootstrap
    pagination.innerHTML = '';
    if (totalPages > 1) {
        const paginationHtml = `
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentCoursesPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentCoursesPage - 1}">Назад</a>
                </li>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `
                <li class="page-item ${i === currentCoursesPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        paginationHtml += `
                <li class="page-item ${currentCoursesPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentCoursesPage + 1}">Вперед</a>
                </li>
            </ul>
        `;
        
        pagination.innerHTML = paginationHtml;
    }
}

function getLevelBadgeClass(level) {
    if (!level) return 'bg-secondary';
    
    const levelLower = level.toLowerCase();
    
    if (levelLower.includes('beginner') || levelLower.includes('начальный')) {
        return 'bg-success'; // зеленый
    } else if (levelLower.includes('intermediate') || levelLower.includes('средний')) {
        return 'bg-warning'; // желтый
    } else if (levelLower.includes('advanced') || levelLower.includes('продвинутый')) {
        return 'bg-danger'; // красный
    }
    
    return 'bg-info';
}

/**
 * Инициализирует поиск курсов
 */
function initSearch() {
    const searchForm = document.getElementById('search-course-form');
    const resetBtn = document.getElementById('reset-search');
    
    if (!searchForm || !resetBtn) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchName = document.getElementById('search-name').value.toLowerCase();
        const searchLevel = document.getElementById('search-level').value;
        
        const filtered = allCourses.filter(course => {
            const matchesName = !searchName || 
                (course.name && course.name.toLowerCase().includes(searchName));
            
            const matchesLevel = !searchLevel || 
                (course.level === searchLevel);
            
            return matchesName && matchesLevel;
        });
        
        currentCoursesPage = 1;
        displayCourses(filtered);
    });
    
    resetBtn.addEventListener('click', function() {
        searchForm.reset();
        currentCoursesPage = 1;
        displayCourses(allCourses);
    });
}

/**
 * Инициализирует обработчики событий для курсов
 */
function initCourseEventListeners() {
    // Делегирование событий
    document.addEventListener('click', async function(e) {
        // Пагинация
        if (e.target.closest('.page-link')) {
            e.preventDefault();
            const page = parseInt(e.target.getAttribute('data-page'));
            if (page && page !== currentCoursesPage) {
                currentCoursesPage = page;
                displayCourses(allCourses);
                document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Просмотр деталей курса
        if (e.target.closest('.view-course-details')) {
            const button = e.target.closest('.view-course-details');
            const courseId = button.getAttribute('data-course-id');
            await showCourseDetails(courseId);
        }
        
        // Запись на курс
        if (e.target.closest('.apply-for-course')) {
            const button = e.target.closest('.apply-for-course');
            const courseId = button.getAttribute('data-course-id');
            await showCourseApplication(courseId);
        }
        
        // Поиск репетиторов
        if (e.target.closest('#find-tutor-btn')) {
            e.preventDefault();
            loadTutorsPage();
        }
    });
    const scrollToContactsBtn = document.getElementById('scroll-to-contacts-btn');
    if (scrollToContactsBtn) {
        scrollToContactsBtn.addEventListener('click', function() {
            const contactsSection = document.getElementById('footer-contacts');
            if (contactsSection) {
                contactsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Обработчик для ссылки в навигации (делегирование)
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href="#footer-contacts"]') || 
            e.target.closest('a[href="#footer-contacts"]')) {
            e.preventDefault();
            const contactsSection = document.getElementById('footer-contacts');
            if (contactsSection) {
                contactsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

/**
 * Показывает детали курса
 */
async function showCourseDetails(courseId) {
    try {
        const course = await APIService.getCourseById(courseId);
        
        if (!course) {
            showNotification('Курс не найден', 'warning');
            return;
        }
        
        // Создаем модальное окно
        const modalHtml = `
            <div class="modal fade" id="courseDetailsModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${course.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Преподаватель:</strong> ${course.teacher || 'Не указан'}</p>
                            <p><strong>Уровень:</strong> <span class="badge ${getLevelBadgeClass(course.level)}">${course.level}</span></p>
                            <p><strong>Продолжительность:</strong> ${course.total_length} недель</p>
                            <p><strong>Часов в неделю:</strong> ${course.week_length} часов</p>
                            <p><strong>Стоимость:</strong> ${course.course_fee_per_hour} ₽/час</p>
                            
                            ${course.description ? `
                                <hr>
                                <h6>Описание</h6>
                                <p>${course.description}</p>
                            ` : ''}
                            
                            ${course.start_dates && course.start_dates.length > 0 ? `
                                <hr>
                                <h6>Даты начала курса</h6>
                                <ul>
                                    ${course.start_dates.slice(0, 5).map(date => 
                                        `<li>${formatDateTime(date)}</li>`
                                    ).join('')}
                                    ${course.start_dates.length > 5 ? 
                                        `<li>... и еще ${course.start_dates.length - 5} дат</li>` : ''
                                    }
                                </ul>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            <button type="button" class="btn btn-primary" onclick="showCourseApplication(${courseId})">
                                Записаться на курс
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
        const modal = new bootstrap.Modal(document.getElementById('courseDetailsModal'));
        modal.show();
        
        // Удаляем после закрытия
        modalContainer.querySelector('#courseDetailsModal').addEventListener('hidden.bs.modal', function() {
            modalContainer.remove();
        });
        
    } catch (error) {
        console.error('Ошибка загрузки курса:', error);
        showNotification('Не удалось загрузить информацию о курсе', 'danger');
    }
}

/**
 * Показывает форму заявки на курс
 */
async function showCourseApplication(courseId) {
    try {
        const course = await APIService.getCourseById(courseId);
        
        if (!course) {
            showNotification('Курс не найден', 'warning');
            return;
        }
        
        // Форматируем даты для select
        const dateOptions = course.start_dates && Array.isArray(course.start_dates) 
            ? course.start_dates.map(date => {
                try {
                    const d = new Date(date);
                    const dateStr = d.toISOString().split('T')[0];
                    const timeStr = d.toTimeString().split(' ')[0].substring(0, 5);
                    return `<option value="${dateStr}T${timeStr}">${formatDateTime(date)}</option>`;
                } catch (e) {
                    return `<option value="${date}">${date}</option>`;
                }
            }).join('')
            : '<option value="">Нет доступных дат</option>';
        
        // Создаем модальное окно
        const modalHtml = `
            <div class="modal fade" id="courseApplicationModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Заявка на курс: ${course.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="courseApplicationForm">
                                <input type="hidden" name="course_id" value="${course.id}">
                                <input type="hidden" name="tutor_id" value="0">
                                
                                <div class="mb-3">
                                    <label class="form-label">Дата и время начала *</label>
                                    <select class="form-select" name="date_time" required>
                                        <option value="">Выберите дату и время</option>
                                        ${dateOptions}
                                    </select>
                                </div>
                                
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Количество студентов *</label>
                                        <input type="number" class="form-control" name="persons" 
                                               min="1" max="20" value="1" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Продолжительность</label>
                                        <input type="text" class="form-control" 
                                               value="${course.total_length} недель" readonly>
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
                                                    <input class="form-check-input" type="checkbox" name="interactive">
                                                    <label class="form-check-label">Интерактивная платформа (×1.5)</label>
                                                </div>
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" name="excursions">
                                                    <label class="form-check-label">Культурные экскурсии (+25%)</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Расчет стоимости -->
                                <div class="card">
                                    <div class="card-header">Расчет стоимости</div>
                                    <div class="card-body">
                                        <h4 id="calculatedPrice">0 ₽</h4>
                                        <p class="text-muted small">Стоимость рассчитывается автоматически</p>
                                        <button type="button" class="btn btn-outline-primary btn-sm" id="calculatePrice">
                                            <i class="bi bi-calculator me-1"></i>Рассчитать
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="button" class="btn btn-primary" id="submitCourseApplication">
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
        initCourseApplicationForm(course);
        
        // Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('courseApplicationModal'));
        modal.show();
        
        // Удаляем после закрытия
        modalContainer.querySelector('#courseApplicationModal').addEventListener('hidden.bs.modal', function() {
            modalContainer.remove();
        });
        
    } catch (error) {
        console.error('Ошибка загрузки курса:', error);
        showNotification('Не удалось загрузить информацию о курсе', 'danger');
    }
}

/**
 * Инициализирует форму заявки на курс
 */
function initCourseApplicationForm(course) {
    // Функция расчета стоимости
    function calculatePrice() {
        const form = document.getElementById('courseApplicationForm');
        if (!form) return;
        
        const dateTimeSelect = form.querySelector('select[name="date_time"]');
        const personsInput = form.querySelector('input[name="persons"]');
        const priceElement = document.getElementById('calculatedPrice');
        
        if (!dateTimeSelect || !personsInput || !priceElement) return;
        
        const selectedDateTime = dateTimeSelect.value;
        const persons = parseInt(personsInput.value) || 1;
        
        if (!selectedDateTime) {
            priceElement.textContent = '0 ₽';
            return;
        }
        
        try {
            // Парсим дату и время
            const [dateStr, timeStr] = selectedDateTime.split('T');
            const date = new Date(selectedDateTime);
            
            // Базовая стоимость
            const hoursPerWeek = course.week_length || 0;
            const totalWeeks = course.total_length || 0;
            const totalHours = hoursPerWeek * totalWeeks;
            const hourlyRate = course.course_fee_per_hour || 0;
            
            let totalPrice = hourlyRate * totalHours * persons;
            
            // Множитель выходных
            const dayOfWeek = date.getDay();
            const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
            if (isWeekend) {
                totalPrice *= 1.5;
            }
            
            // Доплаты за время
            const hour = parseInt(timeStr.split(':')[0]);
            if (hour >= 9 && hour < 12) {
                totalPrice += 400 * persons;
            } else if (hour >= 18 && hour < 20) {
                totalPrice += 1000 * persons;
            }
            
            // Дополнительные опции
            const supplementary = form.querySelector('input[name="supplementary"]')?.checked;
            const assessment = form.querySelector('input[name="assessment"]')?.checked;
            const interactive = form.querySelector('input[name="interactive"]')?.checked;
            const excursions = form.querySelector('input[name="excursions"]')?.checked;
            
            if (supplementary) totalPrice += 2000 * persons;
            if (assessment) totalPrice += 300;
            if (interactive) totalPrice *= 1.5;
            if (excursions) totalPrice *= 1.25;
            
            // Ранняя регистрация (за 30 дней)
            const today = new Date();
            const courseDate = new Date(dateStr);
            const daysDiff = Math.ceil((courseDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysDiff >= 30) {
                totalPrice *= 0.9; // -10%
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
    const form = document.getElementById('courseApplicationForm');
    if (form) {
        form.addEventListener('change', calculatePrice);
        form.addEventListener('input', calculatePrice);
    }
    
    const calculateBtn = document.getElementById('calculatePrice');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePrice);
    }
    
    const submitBtn = document.getElementById('submitCourseApplication');
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            await submitCourseApplication(course);
        });
    }
    
    // Первоначальный расчет
    setTimeout(calculatePrice, 100);
}

/**
 * Отправляет заявку на курс
 */
async function submitCourseApplication(course) {
    try {
        const form = document.getElementById('courseApplicationForm');
        if (!form) return;
        
        // Собираем данные
        const dateTime = form.querySelector('select[name="date_time"]').value;
        const persons = parseInt(form.querySelector('input[name="persons"]').value);
        const priceElement = document.getElementById('calculatedPrice');
        const totalPrice = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
        
        if (!dateTime || !persons || !totalPrice || totalPrice === 0) {
            showNotification('Заполните все поля и рассчитайте стоимость', 'warning');
            return;
        }
        
        // Парсим дату и время
        const [dateStr, timeStr] = dateTime.split('T');
        
        // Проверяем раннюю регистрацию
        const today = new Date();
        const courseDate = new Date(dateStr);
        const daysDiff = Math.ceil((courseDate - today) / (1000 * 60 * 60 * 24));
        const earlyRegistration = daysDiff >= 30;
        
        // Подготавливаем данные заявки
        const orderData = {
            course_id: course.id,
            tutor_id: 0,
            date_start: dateStr,
            time_start: timeStr,
            duration: (course.total_length || 0) * (course.week_length || 0),
            persons: persons,
            price: totalPrice,
            early_registration: earlyRegistration,
            group_enrollment: persons >= 5,
            intensive_course: false,
            supplementary: form.querySelector('input[name="supplementary"]')?.checked || false,
            personalized: false,
            excursions: form.querySelector('input[name="excursions"]')?.checked || false,
            assessment: form.querySelector('input[name="assessment"]')?.checked || false,
            interactive: form.querySelector('input[name="interactive"]')?.checked || false
        };
        
        console.log('Отправка заявки:', orderData);
        
        // Отправляем заявку
        const result = await APIService.createOrder(orderData);
        
        if (result) {
            showNotification('Заявка успешно отправлена!', 'success');
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('courseApplicationModal'));
            if (modal) {
                modal.hide();
            }
            
        } else {
            throw new Error('Не удалось отправить заявку');
        }
        
    } catch (error) {
        console.error('Ошибка отправки заявки:', error);
        showNotification(`Ошибка: ${error.message}`, 'danger');
    }
}

/**
 * Загружает страницу репетиторов
 */
async function loadTutorsPage() {
    // Если скрипт репетиторов не загружен, загружаем его
    if (typeof initTutorsPage !== 'function') {
        const script = document.createElement('script');
        script.src = 'js/tutors.js';
        script.onload = function() {
            initTutorsPage();
        };
        document.head.appendChild(script);
    } else {
        initTutorsPage();
    }
}

/**
 * Показывает уведомление
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) return;
    
    const alertClass = `alert-${type}`;
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    notificationArea.appendChild(notification);
    
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
}

/**
 * Форматирует дату и время
 */
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'Не указано';
    
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateTimeString;
    }
}

/**
 * Инициализация главной страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Главная страница загружена');
    loadCourses();
});

// Экспортируем функции для использования извне
window.showCourseApplication = showCourseApplication;