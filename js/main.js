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
// ============================================
// ФУНКЦИИ ДЛЯ ОФОРМЛЕНИЯ ЗАЯВОК
// ============================================

/**
 * Показывает модальное окно оформления заявки на курс
 */
function showCourseApplicationModal(courseId, courseName, teacherName, courseFee, totalLength) {
    // Сначала получаем полную информацию о курсе
    getCourseById(courseId).then(course => {
        if (!course) {
            showNotification('Не удалось загрузить информацию о курсе', 'danger');
            return;
        }
        
        // Создаем модальное окно
        const modalHtml = `
            <div class="modal fade" id="applicationModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Оформление заявки на курс</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="applicationForm">
                                <input type="hidden" id="course_id" value="${course.id}">
                                <input type="hidden" id="tutor_id" value="0">
                                
                                <!-- Информация о курсе -->
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <h6>Информация о курсе</h6>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <p><strong>Название курса:</strong><br>${course.name}</p>
                                                <p><strong>Преподаватель:</strong><br>${course.teacher}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p><strong>Уровень:</strong><br><span class="badge bg-info">${course.level}</span></p>
                                                <p><strong>Продолжительность:</strong><br>${course.total_length} недель</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Основные поля формы -->
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="date_start" class="form-label">Дата начала *</label>
                                        <select class="form-select" id="date_start" required>
                                            <option value="">Выберите дату начала</option>
                                            ${course.start_dates && course.start_dates.length > 0 ? 
                                                course.start_dates.map(date => 
                                                    `<option value="${date.split('T')[0]}">${formatDate(date)}</option>`
                                                ).join('') : 
                                                '<option value="">Нет доступных дат</option>'
                                            }
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="time_start" class="form-label">Время начала *</label>
                                        <select class="form-select" id="time_start" required disabled>
                                            <option value="">Сначала выберите дату</option>
                                        </select>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="persons" class="form-label">Количество студентов *</label>
                                        <input type="number" class="form-control" id="persons" 
                                               min="1" max="20" value="1" required>
                                        <div class="form-text">От 1 до 20 человек</div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <label for="duration" class="form-label">Продолжительность</label>
                                        <input type="text" class="form-control" id="duration" 
                                               value="${course.total_length} недель" readonly>
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
                                                    <input class="form-check-input" type="checkbox" id="supplementary">
                                                    <label class="form-check-label" for="supplementary">
                                                        Дополнительные учебные материалы (+2000 ₽ на человека)
                                                    </label>
                                                </div>
                                                
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="personalized">
                                                    <label class="form-check-label" for="personalized">
                                                        Индивидуальные занятия (+1500 ₽ в неделю)
                                                    </label>
                                                </div>
                                                
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="excursions">
                                                    <label class="form-check-label" for="excursions">
                                                        Культурные экскурсии (+25% к стоимости)
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-6">
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="assessment">
                                                    <label class="form-check-label" for="assessment">
                                                        Оценка уровня владения языком (+300 ₽)
                                                    </label>
                                                </div>
                                                
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="interactive">
                                                    <label class="form-check-label" for="interactive">
                                                        Интерактивная онлайн-платформа (×1.5 к стоимости)
                                                    </label>
                                                </div>
                                                
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="checkbox" id="intensive_course">
                                                    <label class="form-check-label" for="intensive_course">
                                                        Интенсивный курс (+20% к стоимости)
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Автоматические скидки (только информация) -->
                                        <div class="alert alert-info mt-3">
                                            <h6 class="alert-heading">Автоматические скидки:</h6>
                                            <p class="mb-1">• Ранняя регистрация (за месяц) → -10%</p>
                                            <p class="mb-0">• Групповая запись (5+ человек) → -15%</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Расчет стоимости -->
                                <div class="card mt-4">
                                    <div class="card-header">
                                        <h6 class="mb-0">Расчет стоимости</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-md-8">
                                                <h4 id="totalPrice">0 ₽</h4>
                                                <p class="text-muted mb-0" id="priceDetails">Базовая стоимость рассчитывается автоматически</p>
                                            </div>
                                            <div class="col-md-4 text-end">
                                                <button type="button" class="btn btn-outline-primary" id="calculatePriceBtn">
                                                    <i class="bi bi-calculator me-2"></i>Рассчитать
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="button" class="btn btn-primary" id="submitApplicationBtn" disabled>
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
        
        // Инициализируем обработчики событий для формы
        initApplicationForm(course);
        
        // Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
        modal.show();
        
        // Удаляем модальное окно из DOM после закрытия
        modalContainer.querySelector('#applicationModal').addEventListener('hidden.bs.modal', function () {
            modalContainer.remove();
        });
        
    }).catch(error => {
        console.error('Ошибка при загрузке курса:', error);
        showNotification('Ошибка при загрузке информации о курсе', 'danger');
    });
}

/**
 * Инициализирует обработчики событий для формы заявки
 */
function initApplicationForm(course) {
    const dateSelect = document.getElementById('date_start');
    const timeSelect = document.getElementById('time_start');
    const personsInput = document.getElementById('persons');
    const calculateBtn = document.getElementById('calculatePriceBtn');
    const submitBtn = document.getElementById('submitApplicationBtn');
    
    // Обновляем время при выборе даты
    if (dateSelect) {
        dateSelect.addEventListener('change', function() {
            const selectedDate = this.value;
            updateTimeOptions(course, selectedDate);
        });
    }
    
    // Кнопка расчета стоимости
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateCoursePrice(course);
        });
    }
    
    // Валидация формы перед отправкой
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('input', function() {
            validateApplicationForm();
        });
        
        form.addEventListener('change', function() {
            validateApplicationForm();
        });
    }
    
    // Обработка отправки формы
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            submitCourseApplication(course);
        });
    }
    
    // Автоматический расчет при изменении параметров
    [dateSelect, timeSelect, personsInput].forEach(element => {
        if (element) {
            element.addEventListener('change', function() {
                calculateCoursePrice(course);
            });
        }
    });
    
    // Чекбоксы для автоматического расчета
    document.querySelectorAll('#applicationForm input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            calculateCoursePrice(course);
        });
    });
}

/**
 * Обновляет доступные варианты времени для выбранной даты
 */
function updateTimeOptions(course, selectedDate) {
    const timeSelect = document.getElementById('time_start');
    
    if (!timeSelect || !course.start_dates) return;
    
    // Очищаем опции
    timeSelect.innerHTML = '<option value="">Выберите время</option>';
    timeSelect.disabled = true;
    
    if (!selectedDate) {
        timeSelect.innerHTML = '<option value="">Сначала выберите дату</option>';
        return;
    }
    
    // Фильтруем времена для выбранной даты
    const timesForDate = course.start_dates
        .filter(dateTime => dateTime.startsWith(selectedDate))
        .map(dateTime => {
            const timePart = dateTime.split('T')[1];
            const [hours, minutes] = timePart.split(':');
            return `${hours}:${minutes}`;
        })
        .filter((time, index, array) => array.indexOf(time) === index); // Уникальные значения
    
    if (timesForDate.length === 0) {
        timeSelect.innerHTML = '<option value="">Нет доступного времени</option>';
        return;
    }
    
    // Добавляем опции
    timesForDate.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
    
    timeSelect.disabled = false;
}

/**
 * Рассчитывает стоимость курса
 */
function calculateCoursePrice(course) {
    const dateSelect = document.getElementById('date_start');
    const timeSelect = document.getElementById('time_start');
    const personsInput = document.getElementById('persons');
    const totalPriceElement = document.getElementById('totalPrice');
    const priceDetailsElement = document.getElementById('priceDetails');
    const submitBtn = document.getElementById('submitApplicationBtn');
    
    if (!dateSelect || !timeSelect || !personsInput || !totalPriceElement) {
        return;
    }
    
    // Получаем значения
    const selectedDate = dateSelect.value;
    const selectedTime = timeSelect.value;
    const persons = parseInt(personsInput.value) || 1;
    
    // Проверяем, что все обязательные поля заполнены
    if (!selectedDate || !selectedTime || !persons) {
        totalPriceElement.textContent = '0 ₽';
        priceDetailsElement.textContent = 'Заполните все обязательные поля';
        if (submitBtn) submitBtn.disabled = true;
        return;
    }
    
    // Базовая стоимость (по формуле из задания)
    const courseFeePerHour = course.course_fee_per_hour || 0;
    const totalHours = (course.total_length || 0) * (course.week_length || 0);
    
    // Определяем множитель для выходных/праздников
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay(); // 0 - воскресенье, 6 - суббота
    const isWeekendOrHoliday = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1;
    
    // Доплаты за время
    const [hours, minutes] = selectedTime.split(':');
    const hour = parseInt(hours);
    
    let morningSurcharge = 0;
    let eveningSurcharge = 0;
    
    if (hour >= 9 && hour < 12) {
        morningSurcharge = 400;
    }
    
    if (hour >= 18 && hour < 20) {
        eveningSurcharge = 1000;
    }
    
    // Базовая стоимость (по формуле из задания)
    let basePrice = (courseFeePerHour * totalHours * isWeekendOrHoliday + morningSurcharge + eveningSurcharge) * persons;
    
    // Применяем дополнительные опции
    let optionsPrice = basePrice;
    let optionsDetails = [];
    
    // Интенсивный курс
    if (document.getElementById('intensive_course')?.checked) {
        optionsPrice *= 1.2;
        optionsDetails.push('Интенсивный курс (+20%)');
    }
    
    // Дополнительные материалы
    if (document.getElementById('supplementary')?.checked) {
        const supplementPrice = 2000 * persons;
        optionsPrice += supplementPrice;
        optionsDetails.push(`Доп. материалы (+${formatPrice(supplementPrice)})`);
    }
    
    // Индивидуальные занятия
    if (document.getElementById('personalized')?.checked) {
        const personalizedPrice = 1500 * (course.total_length || 0);
        optionsPrice += personalizedPrice;
        optionsDetails.push(`Индивидуальные занятия (+${formatPrice(personalizedPrice)})`);
    }
    
    // Культурные экскурсии
    if (document.getElementById('excursions')?.checked) {
        optionsPrice *= 1.25;
        optionsDetails.push('Культурные экскурсии (+25%)');
    }
    
    // Оценка уровня
    if (document.getElementById('assessment')?.checked) {
        optionsPrice += 300;
        optionsDetails.push('Оценка уровня (+300 ₽)');
    }
    
    // Интерактивная платформа
    if (document.getElementById('interactive')?.checked) {
        optionsPrice *= 1.5;
        optionsDetails.push('Интерактивная платформа (×1.5)');
    }
    
    // Проверяем автоматические скидки
    const today = new Date();
    const courseStartDate = new Date(selectedDate);
    const daysUntilCourse = Math.ceil((courseStartDate - today) / (1000 * 60 * 60 * 24));
    
    let finalPrice = optionsPrice;
    let discountDetails = [];
    
    // Ранняя регистрация (за 30 дней и более)
    if (daysUntilCourse >= 30) {
        finalPrice *= 0.9; // -10%
        discountDetails.push('Ранняя регистрация (-10%)');
    }
    
    // Групповая запись (5+ человек)
    if (persons >= 5) {
        finalPrice *= 0.85; // -15%
        discountDetails.push('Групповая запись (-15%)');
    }
    
    // Округляем до целых рублей
    finalPrice = Math.round(finalPrice);
    
    // Обновляем отображение
    totalPriceElement.textContent = formatPrice(finalPrice);
    
    // Формируем детали
    let detailsText = `Базовая: ${formatPrice(basePrice)}`;
    
    if (optionsDetails.length > 0) {
        detailsText += ` | Опции: ${optionsDetails.join(', ')}`;
    }
    
    if (discountDetails.length > 0) {
        detailsText += ` | Скидки: ${discountDetails.join(', ')}`;
    }
    
    priceDetailsElement.textContent = detailsText;
    
    // Активируем кнопку отправки
    if (submitBtn) {
        submitBtn.disabled = false;
    }
}

/**
 * Проверяет валидность формы заявки
 */
function validateApplicationForm() {
    const dateSelect = document.getElementById('date_start');
    const timeSelect = document.getElementById('time_start');
    const personsInput = document.getElementById('persons');
    const submitBtn = document.getElementById('submitApplicationBtn');
    
    if (!dateSelect || !timeSelect || !personsInput || !submitBtn) {
        return false;
    }
    
    const isValid = dateSelect.value && 
                    timeSelect.value && 
                    personsInput.value && 
                    parseInt(personsInput.value) >= 1 && 
                    parseInt(personsInput.value) <= 20;
    
    submitBtn.disabled = !isValid;
    return isValid;
}

/**
 * Отправляет заявку на курс
 */
async function submitCourseApplication(course) {
    const courseId = document.getElementById('course_id')?.value;
    const dateStart = document.getElementById('date_start')?.value;
    const timeStart = document.getElementById('time_start')?.value;
    const persons = document.getElementById('persons')?.value;
    const totalPrice = document.getElementById('totalPrice')?.textContent;
    
    if (!courseId || !dateStart || !timeStart || !persons) {
        showNotification('Заполните все обязательные поля', 'danger');
        return;
    }
    
    // Преобразуем цену из формата "1 234 ₽" в число
    const priceNumber = parseInt(totalPrice.replace(/[^\d]/g, ''));
    
    // Собираем данные заявки
    const orderData = {
        course_id: parseInt(courseId),
        tutor_id: 0,
        date_start: dateStart,
        time_start: timeStart,
        duration: (course.total_length || 0) * (course.week_length || 0),
        persons: parseInt(persons),
        price: priceNumber,
        early_registration: document.getElementById('date_start')?.value ? true : false,
        group_enrollment: parseInt(persons) >= 5,
        intensive_course: document.getElementById('intensive_course')?.checked || false,
        supplementary: document.getElementById('supplementary')?.checked || false,
        personalized: document.getElementById('personalized')?.checked || false,
        excursions: document.getElementById('excursions')?.checked || false,
        assessment: document.getElementById('assessment')?.checked || false,
        interactive: document.getElementById('interactive')?.checked || false
    };
    
    console.log('Отправка заявки:', orderData);
    
    try {
        // Отправляем заявку
        const result = await createOrder(orderData);
        
        if (result) {
            showNotification('Заявка успешно отправлена!', 'success');
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('applicationModal'));
            if (modal) {
                modal.hide();
            }
            
            // Обновляем список заявок если мы в личном кабинете
            if (window.location.pathname.includes('account.html')) {
                await loadOrders();
            }
        } else {
            showNotification('Ошибка при отправке заявки', 'danger');
        }
        
    } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        showNotification('Ошибка при отправке заявки: ' + error.message, 'danger');
    }
}

/**
 * Обновляем функцию enrollInCourse (заменяем заглушку)
 */
async function enrollInCourse(courseId, courseName, teacherName, courseFee, courseLength) {
    console.log('Запись на курс:', courseId, courseName);
    showCourseApplicationModal(courseId, courseName, teacherName, courseFee, courseLength);
}
// ============================================
// НАВИГАЦИЯ И СТРАНИЦЫ
// ============================================

/**
 * Инициализирует навигацию между страницами
 */
function initNavigation() {
    // Ссылка на поиск репетиторов
    const tutorsLink = document.getElementById('tutors-link');
    if (tutorsLink) {
        tutorsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showTutorsPage();
        });
    }
    
    // Кнопка оформления заявки на главной
    const startAppBtn = document.getElementById('start-application-btn');
    if (startAppBtn) {
        startAppBtn.addEventListener('click', function() {
            showTutorsPage();
        });
    }
}

/**
 * Показывает страницу поиска репетиторов
 */
function showTutorsPage() {
    const contentDiv = document.getElementById('content');
    
    if (!contentDiv) return;
    
    // Проверяем, загружен ли скрипт репетиторов
    if (typeof initTutorsPage !== 'function') {
        // Динамически загружаем скрипт
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

// Обновляем функцию initEventListeners в main.js
function initEventListeners() {
    // Инициализация поиска
    initSearch();
    
    // Инициализация навигации
    initNavigation();
    
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