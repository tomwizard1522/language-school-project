/**
 * Основной скрипт для главной страницы
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Инициализация страницы
    console.log('Главная страница загружена');
    
    // Показываем информационное уведомление
    showNotification('Добро пожаловать в Language Master!', 'info');
    
    // Загружаем данные курсов
    await loadCourses();
    
    // Инициализируем другие компоненты
    initEventListeners();
});

/**
 * Загружает и отображает курсы
 */
async function loadCourses() {
    const contentDiv = document.getElementById('content');
    
    if (!contentDiv) {
        console.error('Контейнер для контента не найден');
        return;
    }
    
    // Показываем индикатор загрузки
    contentDiv.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
            </div>
            <p class="mt-2">Загружаем информацию о курсах...</p>
        </div>
    `;
    
    try {
        // Получаем курсы из API
        const courses = await getCourses();
        
        if (!courses || courses.length === 0) {
            contentDiv.innerHTML = `
                <div class="alert alert-warning text-center">
                    <h4>Курсы временно недоступны</h4>
                    <p>Пожалуйста, попробуйте позже</p>
                </div>
            `;
            return;
        }
        
        // Отображаем курсы
        renderCourses(courses);
        
    } catch (error) {
        console.error('Ошибка при загрузке курсов:', error);
        contentDiv.innerHTML = `
            <div class="alert alert-danger text-center">
                <h4>Ошибка при загрузке курсов</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}

/**
 * Отображает список курсов
 * @param {Array} courses - Массив курсов
 */
function renderCourses(courses) {
    const contentDiv = document.getElementById('content');
    
    if (!contentDiv) return;
    
    // Создаем структуру главной страницы согласно заданию
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
                                        Сбросить
                                    </button>
                                </div>
                            </form>
                        </div>
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
                            <p class="card-text text-center">
                                Информация о репетиторах будет загружена в следующем этапе разработки.
                            </p>
                            <div class="text-center">
                                <button class="btn btn-primary" disabled>
                                    <i class="bi bi-person-plus me-2"></i>Найти репетитора
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Заполняем преимущества
    renderAdvantages();
    
    // Заполняем список курсов
    displayCourses(courses);
    
    // Инициализируем поиск
    initSearch();
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
 * @param {Array} courses - Массив курсов
 * @param {number} currentPage - Текущая страница
 */
function displayCourses(courses, currentPage = 1) {
    const coursesList = document.getElementById('courses-list');
    const paginationContainer = document.getElementById('courses-pagination');
    
    if (!coursesList || !paginationContainer) return;
    
    // Настройки пагинации
    const itemsPerPage = 10;
    const totalPages = Math.ceil(courses.length / itemsPerPage);
    
    // Получаем курсы для текущей страницы
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCourses = courses.slice(startIndex, endIndex);
    
    // Очищаем список
    coursesList.innerHTML = '';
    
    // Если курсов нет
    if (currentCourses.length === 0) {
        coursesList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <h5>Курсы не найдены</h5>
                    <p>Попробуйте изменить параметры поиска</p>
                </div>
            </div>
        `;
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Отображаем курсы
    currentCourses.forEach(course => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        
        col.innerHTML = `
            <div class="card h-100 course-card">
                <div class="card-body">
                    <h5 class="card-title">${course.name || 'Без названия'}</h5>
                    <p class="card-text">
                        <small class="text-muted">
                            <i class="bi bi-person me-1"></i>${course.teacher || 'Преподаватель не указан'}
                        </small>
                    </p>
                    <p class="card-text">
                        <i class="bi bi-bar-chart me-1"></i>
                        <span class="badge bg-info">${course.level || 'Не указано'}</span>
                    </p>
                    <p class="card-text">
                        <i class="bi bi-clock me-1"></i>
                        ${course.total_length || 0} недель, ${course.week_length || 0} часов в неделю
                    </p>
                    <p class="card-text">
                        <i class="bi bi-cash me-1"></i>
                        <strong>${formatPrice(course.course_fee_per_hour || 0)}/час</strong>
                    </p>
                    <div class="mt-3">
                        <button class="btn btn-outline-primary btn-sm view-course-btn" data-course-id="${course.id}">
                            <i class="bi bi-info-circle me-1"></i>Подробнее
                        </button>
                        <button class="btn btn-primary btn-sm ms-2 enroll-btn" data-course-id="${course.id}">
                            <i class="bi bi-pencil-square me-1"></i>Записаться
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        coursesList.appendChild(col);
    });
    
    // Создаем пагинацию
    paginationContainer.innerHTML = '';
    if (totalPages > 1) {
        const pagination = createPagination(currentPage, totalPages, (page) => {
            displayCourses(courses, page);
            // Прокручиваем к списку курсов
            document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
        });
        
        if (pagination) {
            paginationContainer.appendChild(pagination);
        }
    }
}

/**
 * Инициализирует форму поиска
 */
function initSearch() {
    const searchForm = document.getElementById('search-course-form');
    const resetBtn = document.getElementById('reset-search');
    
    if (!searchForm) return;
    
    // Текущий список всех курсов (будет загружен позже)
    let allCourses = [];
    
    // Загружаем все курсы для поиска
    getCourses().then(courses => {
        allCourses = courses || [];
    });
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('course-name');
        const levelSelect = document.getElementById('course-level');
        
        const searchName = nameInput ? nameInput.value.trim().toLowerCase() : '';
        const searchLevel = levelSelect ? levelSelect.value : '';
        
        // Фильтруем курсы
        const filteredCourses = allCourses.filter(course => {
            const matchesName = !searchName || 
                (course.name && course.name.toLowerCase().includes(searchName));
            
            const matchesLevel = !searchLevel || 
                (course.level && course.level === searchLevel);
            
            return matchesName && matchesLevel;
        });
        
        // Отображаем отфильтрованные курсы
        displayCourses(filteredCourses);
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            searchForm.reset();
            
            // Показываем все курсы
            getCourses().then(courses => {
                displayCourses(courses || []);
            });
        });
    }
}

/**
 * Инициализирует обработчики событий
 */
function initEventListeners() {
    // Обработчики будут добавлены в следующих этапах
    console.log('Обработчики событий инициализированы');
}