/**
 * Функции валидации для форм проекта
 */

/**
 * Валидирует форму заявки на курс
 * @param {Object} formData - Данные формы
 * @returns {Object} {isValid: boolean, errors: Array}
 */
function validateCourseApplication(formData) {
    const errors = [];
    
    // Проверка обязательных полей
    if (!formData.date_start || formData.date_start.trim() === '') {
        errors.push('Дата начала обязательна для заполнения');
    }
    
    if (!formData.time_start || formData.time_start.trim() === '') {
        errors.push('Время начала обязательно для заполнения');
    }
    
    // Проверка количества студентов
    const persons = parseInt(formData.persons);
    if (isNaN(persons) || persons < 1 || persons > 20) {
        errors.push('Количество студентов должно быть от 1 до 20');
    }
    
    // Проверка даты (не раньше сегодня)
    if (formData.date_start) {
        const selectedDate = new Date(formData.date_start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('Дата начала не может быть в прошлом');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Валидирует форму заявки на репетитора
 * @param {Object} formData - Данные формы
 * @returns {Object} {isValid: boolean, errors: Array}
 */
function validateTutorApplication(formData) {
    const errors = [];
    
    // Проверка обязательных полей
    if (!formData.date_start || formData.date_start.trim() === '') {
        errors.push('Дата первого занятия обязательна для заполнения');
    }
    
    if (!formData.time_start || formData.time_start.trim() === '') {
        errors.push('Время занятия обязательно для заполнения');
    }
    
    if (!formData.duration || formData.duration.trim() === '') {
        errors.push('Продолжительность обязательна для заполнения');
    }
    
    // Проверка количества студентов
    const persons = parseInt(formData.persons);
    if (isNaN(persons) || persons < 1 || persons > 20) {
        errors.push('Количество студентов должно быть от 1 до 20');
    }
    
    // Проверка продолжительности (1-40 часов для репетиторов)
    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration < 1 || duration > 40) {
        errors.push('Продолжительность должна быть от 1 до 40 часов');
    }
    
    // Проверка даты
    if (formData.date_start) {
        const selectedDate = new Date(formData.date_start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('Дата занятия не может быть в прошлом');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Валидирует форму редактирования заявки
 * @param {Object} formData - Данные формы
 * @returns {Object} {isValid: boolean, errors: Array}
 */
function validateEditOrderForm(formData) {
    const errors = [];
    
    // Проверка обязательных полей
    if (!formData.date_start || formData.date_start.trim() === '') {
        errors.push('Дата начала обязательна для заполнения');
    }
    
    if (!formData.time_start || formData.time_start.trim() === '') {
        errors.push('Время начала обязательно для заполнения');
    }
    
    if (!formData.duration || formData.duration.trim() === '') {
        errors.push('Продолжительность обязательна для заполнения');
    }
    
    // Проверка количества студентов
    const persons = parseInt(formData.persons);
    if (isNaN(persons) || persons < 1 || persons > 20) {
        errors.push('Количество студентов должно быть от 1 до 20');
    }
    
    // Проверка продолжительности
    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration < 1 || duration > 40) {
        errors.push('Продолжительность должна быть от 1 до 40 часов');
    }
    
    // Проверка даты
    if (formData.date_start) {
        const selectedDate = new Date(formData.date_start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('Дата начала не может быть в прошлом');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Показывает ошибки валидации в форме
 * @param {HTMLElement} formElement - Элемент формы
 * @param {Array} errors - Массив ошибок
 */
function showValidationErrors(formElement, errors) {
    // Очищаем предыдущие ошибки
    clearValidationErrors(formElement);
    
    if (!errors || errors.length === 0) {
        return;
    }
    
    // Создаем контейнер для ошибок
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger mt-3';
    errorContainer.innerHTML = `
        <h6 class="alert-heading"><i class="bi bi-exclamation-triangle me-2"></i>Ошибки заполнения формы:</h6>
        <ul class="mb-0">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    // Вставляем перед кнопками отправки
    const submitButtons = formElement.querySelector('.modal-footer');
    if (submitButtons) {
        formElement.insertBefore(errorContainer, submitButtons);
    } else {
        formElement.appendChild(errorContainer);
    }
    
    // Прокручиваем к ошибкам
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Очищает ошибки валидации в форме
 * @param {HTMLElement} formElement - Элемент формы
 */
function clearValidationErrors(formElement) {
    const errorAlerts = formElement.querySelectorAll('.alert.alert-danger');
    errorAlerts.forEach(alert => alert.remove());
}

/**
 * Добавляет стили ошибок к полям формы
 * @param {HTMLElement} inputElement - Поле ввода
 * @param {boolean} hasError - Есть ли ошибка
 */
function setInputErrorState(inputElement, hasError) {
    if (!inputElement) return;
    
    if (hasError) {
        inputElement.classList.add('is-invalid');
        inputElement.classList.remove('is-valid');
    } else {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
    }
}

/**
 * Валидирует поле ввода в реальном времени
 * @param {HTMLElement} inputElement - Поле ввода
 */
function validateInputInRealTime(inputElement) {
    if (!inputElement) return;
    
    const value = inputElement.value.trim();
    const type = inputElement.type;
    const min = inputElement.min ? parseInt(inputElement.min) : null;
    const max = inputElement.max ? parseInt(inputElement.max) : null;
    
    let isValid = true;
    
    if (inputElement.required && value === '') {
        isValid = false;
    }
    
    if (type === 'number' && value !== '') {
        const numValue = parseInt(value);
        if (isNaN(numValue)) {
            isValid = false;
        } else {
            if (min !== null && numValue < min) isValid = false;
            if (max !== null && numValue > max) isValid = false;
        }
    }
    
    if (type === 'date' && value !== '') {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
        }
    }
    
    setInputErrorState(inputElement, !isValid);
    
    return isValid;
}

/**
 * Инициализирует валидацию в реальном времени для формы
 * @param {HTMLElement} formElement - Элемент формы
 */
function initRealTimeValidation(formElement) {
    if (!formElement) return;
    
    // Все обязательные поля
    const requiredInputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredInputs.forEach(input => {
        // Валидация при изменении
        input.addEventListener('input', function() {
            validateInputInRealTime(this);
            clearValidationErrors(formElement);
        });
        
        input.addEventListener('change', function() {
            validateInputInRealTime(this);
            clearValidationErrors(formElement);
        });
        
        // Валидация при потере фокуса
        input.addEventListener('blur', function() {
            validateInputInRealTime(this);
        });
    });
}

// Экспорт функций
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateCourseApplication,
        validateTutorApplication,
        validateEditOrderForm,
        showValidationErrors,
        clearValidationErrors,
        setInputErrorState,
        validateInputInRealTime,
        initRealTimeValidation
    };
}