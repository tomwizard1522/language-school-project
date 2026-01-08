/**
 * Основной скрипт для главной страницы
 */

// Глобальные переменные
let allCourses = [];
let filteredCourses = [];
let currentCoursesPage = 1;
const COURSES_PER_PAGE = 10; // По заданию: 10 курсов на страницу

document.addEventListener('DOMContentLoaded', async function() {
    // Инициализация страницы
    console.log('Главная страница загружена');
    
    // Показываем информационное уведомление
    showNotification('Добро пожаловать в Language Master! Загружаем курсы...', 'info', 3000);
    
    // Загружаем данные курсов
    await loadCourses();
    
    // Инициализируем другие компоненты
    initEventListeners();
    
    // Инициализация tooltip'ов Bootstrap
    initBootstrapTooltips();
});

/**
 * Инициализирует tooltip'ы Bootstrap
 */
function initBootstrapTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Загружает и отображает курсы
 */
async function loadCourses() {
    const contentDiv = document.getElementById('content');
    
    if (!contentDiv) {
        console.error('Контейнер для контента не найден');
        return;
    }
    
    try {
        // Получаем курсы из API
        const courses = await getCourses();
        
        if (!courses) {
            showNotification('Не удалось загрузить курсы. Проверьте подключение к интернету и API ключ.', 'danger');
            renderErrorContent();
            return;
        }
        
        if (courses.length === 0) {
            showNotification('Курсы временно недоступны', 'warning');
        } else {
            showNotification(`Загружено ${courses.length} курсов`, 'success', 3000);
        }
        
        allCourses = courses;
        filteredCourses = [...allCourses];
        
        // Отображаем основной контент
        renderMainContent();
        
        // Отображаем курсы
        displayCourses();
        
    } catch (error) {
        console.error('Ошибка при загрузке курсов:', error);
        renderErrorContent(error.message);
    }
}

/**
 * Отображает контент при ошибке загрузки
 */
function renderErrorContent(errorMessage = '') {
    const contentDiv = document.getElementById('content');
    
    contentDiv.innerHTML = `
        <section class="text-center py-5">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="alert alert-danger">
                        <h4 class="alert-heading">Ошибка загрузки данных</h4>
                        <p>Не удалось загрузить информацию о курсах. Пожалуйста, попробуйте позже.</p>
                        ${errorMessage ? `<hr><p class="mb-0"><small>${errorMessage}</small></p>` : ''}
                    </div>
                    
                    <!-- Блок преимуществ (статические данные) -->
                    <div class="mt-5">
                        <h2 class="mb-4">Преимущества изучения иностранного языка</h2>
                        <div class="row g-4">
                            <div class="col-md-6 col-lg-3">
                                <div class="card h-100 course-card">
                                    <div class="card-body text-center">
                                        <i class="bi bi-globe display-4 text-primary mb-3"></i>
                                        <h5 class="card-title">Международное общение</h5>
                                        <p class="card-text">Возможность общаться с людьми по всему миру.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3">
                                <div class="card h-100 course-card">
                                    <div class="card-body text-center">
                                        <i class="bi bi-briefcase display-4 text-primary mb-3"></i>
                                        <h5 class="card-title">Карьерный рост</h5>
                                        <p class="card-text">Новые возможности на рынке труда.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3">
                                <div class="card h-100 course-card">
                                    <div class="card-body text-center">
                                        <i class="bi bi-airplane display-4 text-primary mb-3"></i>
                                        <h5 class="card-title">Путешествия</h5>
                                        <p class="card-text">Свободное общение в поездках.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3">
                                <div class="card h-100 course-card">
                                    <div class="card-body text-center">
                                        <i class="bi bi-cpu display-4 text-primary mb-3"></i>
                                        <h5 class="card-title">Развитие мозга</h5>
                                        <p class="card-text">Улучшает память и когнитивные способности.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-5">
                        <button class="btn btn-primary btn-lg" onclick="location.reload()">
                            <i class="bi bi-arrow-clockwise me-2"></i>Попробовать снова
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

/**
 * Отображает основную структуру главной страницы
 */
function renderMainContent() {
    const contentDiv = document.getElementById('content');
    
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
                            <div class="mt-3">
                                <button class="btn btn-outline-primary" id="contact-us-btn">
                                    <i class="bi bi-envelope me-2"></i>Связаться с нами
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Преимущества -->
        <section id="advantages" class="mb-5">
            <h2 class="text-center mb-4">Преимущества изучения иностранного языка</h2>
            <div class="row g-4" id="advantages-grid">
                <!-- Преимущества будут добавлены через JavaScript -->
            </div>
        </section>
        
        <!-- Курсы -->
        <section id="courses" class="mb-5">
            <h2 class="text-center mb-4">Доступные курсы</h2>
            
            <!-- Форма поиска -->
            <div class="row mb-4">
                <div class="col-md-8 mx-auto">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Поиск курсов</h5>
                            <form id="search-course-form">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="course-name" class="form-label">Название курса</label>
                                        <input type="text" class="form-control" id="course-name" placeholder="Введите название курса">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="course-level" class="form-label">Уровень</label>
                                        <select class="form-select" id="course-level">
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
                                    <button type="button" id="reset-search" class="btn btn-outline-secondary ms-2">
                                        <i class="bi bi-arrow-clockwise me-2"></i>Сбросить
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Информация о количестве курсов -->
            <div class="row mb-3">
                <div class="col-12">
                    <div class="alert alert-light d-flex justify-content-between align-items-center">
                        <span>
                            <i class="bi bi-info-circle me-2"></i>
                            Найдено курсов: <strong>${filteredCourses.length}</strong>
                        </span>
                        <small class="text-muted">Страница ${currentCoursesPage} из ${Math.ceil(filteredCourses.length / COURSES_PER_PAGE)}</small>
                    </div>
                </div>
            </div>
            
            <!-- Список курсов -->
            <div class="row g-4" id="courses-list">
                <!-- Курсы будут загружены динамически -->
            </div>
            
            <!-- Пагинация -->
            <div class="mt-4" id="courses-pagination"></div>
        </section>
        
        <!-- Репетиторы -->
        <section id="tutors" class="mb-5">
            <h2 class="text-center mb-4">Наши репетиторы</h2>
            
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="text-center py-3">
                                <i class="bi bi-people display-4 text-muted mb-3"></i>
                                <p class="card-text">Информация о репетиторах будет загружена в следующем этапе.</p>
                                <button class="btn btn-primary" disabled>
                                    <i class="bi bi-person-plus me-2"></i>Найти репетитора
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Блок для кнопки заявки -->
        <div class="text-center mb-5" id="application-section">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title">Готовы начать обучение?</h4>
                    <p class="card-text">Выберите курс или репетитора и оформите заявку</p>
                    <button class="btn btn-success btn-lg" id="start-application-btn" disabled>
                        <i class="bi bi-pencil-square me-2"></i>Оформить заявку
                    </button>
                    <p class="text-muted mt-2"><small>Функция оформления заявки будет доступна в следующем этапе</small></p>
                </div>
            </div>
        </div>
    `;
    
    // Заполняем преимущества
    renderAdvantages();
}

/**
 * Отображает блок преимуществ
 */
function renderAdvantages() {
    const advantagesGrid = document.getElementById('advantages-grid');
    
    if (!advantagesGrid) return;
    
    const advantages = [
        {
            title: 'Международное общение',
            description: 'Возможность общаться с людьми по всему миру, расширять кругозор и заводить новые знакомства.',
            icon: 'bi-globe'
        },
        {
            title: 'Карьерный рост',
            description: 'Знание иностранного языка увеличивает вашу ценность на рынке труда и открывает новые карьерные возможности.',
            icon: 'bi-briefcase'
        },
        {
            title: 'Путешествия',
            description: 'Свободное общение в поездках, понимание культуры и традиций других стран.',
            icon: 'bi-airplane'
        },
        {
            title: 'Развитие мозга',
            description: 'Изучение языков улучшает память, внимание и когнитивные способности.',
            icon: 'bi-cpu'
        },
        {
            title: 'Доступ к информации',
            description: 'Чтение книг, статей и просмотр фильмов в оригинале.',
            icon: 'bi-book'
        },
        {
            title: 'Уверенность в себе',
            description: 'Преодоление языкового барьера повышает самооценку и уверенность.',
            icon: 'bi-star'
        },
        {
            title: 'Культурное понимание',
            description: 'Более глубокое понимание культуры и менталитета других народов.',
            icon: 'bi-heart'
        },
        {
            title: 'Образовательные возможности',
            description: 'Возможность обучения в зарубежных вузах и на международных программах.',
            icon: 'bi-mortarboard'
        }
    ];
    
    advantagesGrid.innerHTML = '';
    
    advantages.forEach(advantage => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        
        col.innerHTML = `
            <div class="card h-100 course-card">
                <div class="card-body text-center">
                    <i class="bi ${advantage.icon} display-4 text-primary mb-3"></i>
                    <h5 class="card-title">${advantage.title}</h5>
                    <p class="card-text">${advantage.description}</p>
                </div>
            </div>
        `;
        
        advantagesGrid.appendChild(col);
    });
}

/**
 * Отображает курсы с пагинацией
 */
function displayCourses() {
    const coursesList = document.getElementById('courses-list');
    const paginationContainer = document.getElementById('courses-pagination');
    
    if (!coursesList || !paginationContainer) return;
    
    // Рассчитываем пагинацию
    const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
    const startIndex = (currentCoursesPage - 1) * COURSES_PER_PAGE;
    const endIndex = startIndex + COURSES_PER_PAGE;
    const currentCourses = filteredCourses.slice(startIndex, endIndex);
    
    // Обновляем информацию о странице
    const pageInfo = document.querySelector('.alert-light .text-muted');
    if (pageInfo) {
        pageInfo.textContent = `Страница ${currentCoursesPage} из ${totalPages || 1}`;
    }
    
    // Очищаем список
    coursesList.innerHTML = '';
    
    // Если курсов нет
    if (currentCourses.length === 0) {
        coursesList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <h5>Курсы не найдены</h5>
                    <p>Попробуйте изменить параметры поиска</p>
                    <button class="btn btn-outline-info mt-2" id="show-all-courses">
                        <i class="bi bi-eye me-2"></i>Показать все курсы
                    </button>
                </div>
            </div>
        `;
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Отображаем курсы
    currentCourses.forEach((course, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        
        // Подготовка данных
        const courseName = course.name || 'Без названия';
        const teacherName = course.teacher || 'Преподаватель не указан';
        const courseLevel = course.level || 'Не указано';
        const totalLength = course.total_length || 0;
        const weekLength = course.week_length || 0;
        const courseFee = course.course_fee_per_hour || 0;
        const description = course.description || 'Описание отсутствует';
        
        // Определяем цвет для уровня курса
        let levelBadgeClass = 'bg-secondary';
        if (courseLevel === 'Beginner') levelBadgeClass = 'bg-success';
        if (courseLevel === 'Intermediate') levelBadgeClass = 'bg-warning';
        if (courseLevel === 'Advanced') levelBadgeClass = 'bg-danger';
        
        // Обрезаем описание если оно слишком длинное
        const shortDescription = truncateText(description, 120);
        
        col.innerHTML = `
            <div class="card h-100 course-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0" style="cursor: pointer;" 
                            data-bs-toggle="tooltip" 
                            data-bs-placement="top" 
                            title="${courseName}">
                            ${truncateText(courseName, 40)}
                        </h5>
                        <span class="badge ${levelBadgeClass}">${courseLevel}</span>
                    </div>
                    
                    <p class="card-text text-muted small mb-3" 
                       data-bs-toggle="tooltip" 
                       data-bs-placement="top" 
                       title="${description}">
                        ${shortDescription}
                    </p>
                    
                    <div class="course-details mb-3">
                        <p class="mb-1">
                            <i class="bi bi-person me-1"></i>
                            <small class="text-muted">Преподаватель:</small>
                            <strong> ${teacherName}</strong>
                        </p>
                        <p class="mb-1">
                            <i class="bi bi-calendar-week me-1"></i>
                            <small class="text-muted">Продолжительность:</small>
                            <strong> ${totalLength} недель</strong>
                        </p>
                        <p class="mb-1">
                            <i class="bi bi-clock me-1"></i>
                            <small class="text-muted">В неделю:</small>
                            <strong> ${weekLength} часов</strong>
                        </p>
                        <p class="mb-0">
                            <i class="bi bi-cash me-1"></i>
                            <small class="text-muted">Стоимость:</small>
                            <strong class="text-primary">${formatPrice(courseFee)}/час</strong>
                        </p>
                    </div>
                    
                    <div class="mt-3 d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm view-course-btn" 
                                data-course-id="${course.id}"
                                data-course-name="${courseName}">
                            <i class="bi bi-info-circle me-1"></i>Подробнее
                        </button>
                        <button class="btn btn-primary btn-sm enroll-btn" 
                                data-course-id="${course.id}"
                                data-course-name="${courseName}"
                                data-course-teacher="${teacherName}"
                                data-course-fee="${courseFee}"
                                data-course-length="${totalLength}">
                            <i class="bi bi-pencil-square me-1"></i>Записаться
                        </button>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <small class="text-muted">
                        <i class="bi bi-calendar-plus me-1"></i>
                        Доступно дат начала: ${course.start_dates ? course.start_dates.length : 0}
                    </small>
                </div>
            </div>
        `;
        
        coursesList.appendChild(col);
    });
    
    // Создаем пагинацию
    paginationContainer.innerHTML = '';
    if (totalPages > 1) {
        const pagination = createPagination(currentCoursesPage, totalPages, (page) => {
            currentCoursesPage = page;
            displayCourses();
            // Прокручиваем к списку курсов
            document.getElementById('courses').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
        
        if (pagination) {
            paginationContainer.appendChild(pagination);
        }
    }
    
    // Инициализируем tooltip'ы для новых элементов
    initBootstrapTooltips();
}

/**
 * Инициализирует форму поиска
 */
function initSearch() {
    const searchForm = document.getElementById('search-course-form');
    const resetBtn = document.getElementById('reset-search');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('course-name');
        const levelSelect = document.getElementById('course-level');
        
        const searchName = nameInput ? nameInput.value.trim().toLowerCase() : '';
        const searchLevel = levelSelect ? levelSelect.value : '';
        
        // Фильтруем курсы
        filteredCourses = allCourses.filter(course => {
            const matchesName = !searchName || 
                (course.name && course.name.toLowerCase().includes(searchName));
            
            const matchesLevel = !searchLevel || 
                (course.level && course.level === searchLevel);
            
            return matchesName && matchesLevel;
        });
        
        // Сбрасываем на первую страницу
        currentCoursesPage = 1;
        
        // Обновляем количество найденных курсов
        const countElement = document.querySelector('.alert-light strong');
        if (countElement) {
            countElement.textContent = filteredCourses.length;
        }
        
        // Отображаем отфильтрованные курсы
        displayCourses();
        
        // Показываем уведомление
        if (filteredCourses.length === 0) {
            showNotification('Курсы по вашему запросу не найдены', 'warning');
        } else {
            showNotification(`Найдено ${filteredCourses.length} курсов`, 'success', 2000);
        }
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            searchForm.reset();
            
            // Восстанавливаем все курсы
            filteredCourses = [...allCourses];
            currentCoursesPage = 1;
            
            // Обновляем количество найденных курсов
            const countElement = document.querySelector('.alert-light strong');
            if (countElement) {
                countElement.textContent = filteredCourses.length;
            }
            
            // Показываем все курсы
            displayCourses();
            
            showNotification('Фильтры сброшены', 'info', 2000);
        });
    }
    
    // Обработчик для кнопки "Показать все курсы"
    document.addEventListener('click', function(e) {
        if (e.target.closest('#show-all-courses')) {
            const searchForm = document.getElementById('search-course-form');
            if (searchForm) {
                searchForm.reset();
                
                filteredCourses = [...allCourses];
                currentCoursesPage = 1;
                
                const countElement = document.querySelector('.alert-light strong');
                if (countElement) {
                    countElement.textContent = filteredCourses.length;
                }
                
                displayCourses();
                
                showNotification('Показаны все курсы', 'info', 2000);
            }
        }
    });
}

/**
 * Инициализирует обработчики событий
 */
function initEventListeners() {
    // Инициализация поиска
    initSearch();
    
    // Делегирование событий для динамически созданных кнопок
    document.addEventListener('click', function(e) {
        // Кнопка "Подробнее" о курсе
        if (e.target.closest('.view-course-btn')) {
            const button = e.target.closest('.view-course-btn');
            const courseId = button.getAttribute('data-course-id');
            const courseName = button.getAttribute('data-course-name');
            viewCourseDetails(courseId, courseName);
        }
        
        // Кнопка "Записаться" на курс
        if (e.target.closest('.enroll-btn')) {
            const button = e.target.closest('.enroll-btn');
            const courseId = button.getAttribute('data-course-id');
            const courseName = button.getAttribute('data-course-name');
            const teacherName = button.getAttribute('data-course-teacher');
            const courseFee = button.getAttribute('data-course-fee');
            const courseLength = button.getAttribute('data-course-length');
            enrollInCourse(courseId, courseName, teacherName, courseFee, courseLength);
        }
        
        // Кнопка "Связаться с нами"
        if (e.target.closest('#contact-us-btn')) {
            showContactModal();
        }
    });
    
    console.log('Обработчики событий инициализированы');
}

/**
 * Показывает детали курса
 */
async function viewCourseDetails(courseId, courseName) {
    console.log('Просмотр курса:', courseId, courseName);
    
    try {
        const course = await getCourseById(courseId);
        
        if (!course) {
            showNotification('Не удалось загрузить информацию о курсе', 'danger');
            return;
        }
        
        // Создаем модальное окно для деталей курса
        const modalHtml = `
            <div class="modal fade" id="courseDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${course.name || 'Детали курса'}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h6>Описание</h6>
                                    <p>${course.description || 'Описание отсутствует'}</p>
                                    
                                    <h6 class="mt-4">Информация о курсе</h6>
                                    <div class="row">
                                        <div class="col-6">
                                            <p><strong>Преподаватель:</strong><br>${course.teacher || 'Не указан'}</p>
                                            <p><strong>Уровень:</strong><br>
                                                <span class="badge bg-info">${course.level || 'Не указано'}</span>
                                            </p>
                                        </div>
                                        <div class="col-6">
                                            <p><strong>Продолжительность:</strong><br>${course.total_length || 0} недель</p>
                                            <p><strong>Часов в неделю:</strong><br>${course.week_length || 0} часов</p>
                                        </div>
                                    </div>
                                    
                                    <h6 class="mt-4">Стоимость</h6>
                                    <p><strong>Базовая ставка:</strong> ${formatPrice(course.course_fee_per_hour || 0)} в час</p>
                                    <p class="text-muted small">* Итоговая стоимость рассчитывается с учетом дополнительных опций</p>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6>Даты начала курса</h6>
                                            ${course.start_dates && course.start_dates.length > 0 ? 
                                                `<ul class="list-unstyled">
                                                    ${course.start_dates.slice(0, 5).map(date => 
                                                        `<li class="mb-1"><i class="bi bi-calendar-check me-2"></i>${formatDateTime(date)}</li>`
                                                    ).join('')}
                                                    ${course.start_dates.length > 5 ? 
                                                        `<li class="text-muted">... и еще ${course.start_dates.length - 5} дат</li>` : ''
                                                    }
                                                </ul>` :
                                                '<p class="text-muted">Даты начала не указаны</p>'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            <button type="button" class="btn btn-primary" 
                                    onclick="enrollInCourse(${course.id}, '${course.name.replace(/'/g, "\\'")}', '${course.teacher.replace(/'/g, "\\'")}', ${course.course_fee_per_hour}, ${course.total_length})">
                                <i class="bi bi-pencil-square me-2"></i>Записаться на курс
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
        
        // Удаляем модальное окно из DOM после закрытия
        modalContainer.querySelector('#courseDetailsModal').addEventListener('hidden.bs.modal', function () {
            modalContainer.remove();
        });
        
    } catch (error) {
        console.error('Ошибка при загрузке деталей курса:', error);
        showNotification('Ошибка при загрузке деталей курса', 'danger');
    }
}

/**
 * Запись на курс (заглушка для следующего этапа)
 */
async function enrollInCourse(courseId, courseName, teacherName, courseFee, courseLength) {
    console.log('Запись на курс:', courseId, courseName);
    
    showNotification(`Функция записи на курс "${courseName}" будет реализована в следующем этапе`, 'info');
    
    // Здесь будет модальное окно оформления заявки
    // Это будет реализовано в следующем этапе
}

/**
 * Показывает модальное окно "Связаться с нами"
 */
function showContactModal() {
    const modalHtml = `
        <div class="modal fade" id="contactModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Связаться с нами</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>По всем вопросам вы можете связаться с нами:</p>
                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-telephone me-2"></i>+7 (495) 123-45-67</li>
                            <li class="mb-2"><i class="bi bi-envelope me-2"></i>info@languagemaster.ru</li>
                            <li class="mb-2"><i class="bi bi-geo-alt me-2"></i>Москва, ул. Образцова, 15</li>
                            <li><i class="bi bi-clock me-2"></i>Пн-Пт: 9:00-20:00, Сб: 10:00-18:00</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
    
    modalContainer.querySelector('#contactModal').addEventListener('hidden.bs.modal', function () {
        modalContainer.remove();
    });
}