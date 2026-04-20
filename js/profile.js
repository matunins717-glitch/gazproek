/**
 * JavaScript для личного кабинета
 */

(function() {
    'use strict';

    // Определяем базовый путь к API
    const API_BASE = window.location.pathname.includes('/profile.html') ? 'api/' : '../api/';
    let currentUser = null;
    let isEditing = false;

    // Элементы DOM
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const avatarImage = document.getElementById('avatarImage');
    const avatarInput = document.getElementById('avatarInput');
    const profileForm = document.getElementById('profileForm');
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formActions = document.getElementById('formActions');
    const navItems = document.querySelectorAll('.profile-nav-item');
    const sections = document.querySelectorAll('.profile-section');

    // Инициализация
    init();

    function init() {
        checkAuth();
        setupEventListeners();
    }

    /**
     * Проверка авторизации
     */
    async function checkAuth() {
        try {
            const response = await fetch(API_BASE + 'auth.php?action=check');
            const data = await response.json();

            if (data.authenticated) {
                loadProfile();
            } else {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Ошибка проверки авторизации:', error);
            window.location.href = 'index.html';
        }
    }

    /**
     * Загрузка профиля
     */
    async function loadProfile() {
        try {
            const response = await fetch(API_BASE + 'profile.php');
            const data = await response.json();

            if (data.success) {
                currentUser = data.user;
                displayProfile(data.user);
                updateStats(data.stats);
            }
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
        }
    }

    /**
     * Отображение профиля
     */
    function displayProfile(user) {
        profileName.textContent = user.full_name || user.username || 'Пользователь';
        profileEmail.textContent = user.email;

        // Аватар
        if (user.avatar) {
            avatarImage.src = user.avatar;
        } else {
            avatarImage.src = 'img/default-avatar.png';
        }

        // Заполнение формы
        document.getElementById('fullName').value = user.full_name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('country').value = user.country || '';
        document.getElementById('city').value = user.city || '';
        document.getElementById('birthDate').value = user.birth_date || '';
    }

    /**
     * Обновление статистики
     */
    function updateStats(stats) {
        document.getElementById('statViews').textContent = stats.views || 0;
        document.getElementById('statFavorites').textContent = stats.favorites || 0;
        document.getElementById('statRequests').textContent = stats.requests || 0;

        document.getElementById('viewsBadge').textContent = stats.views || 0;
        document.getElementById('favoritesBadge').textContent = stats.favorites || 0;
        document.getElementById('requestsBadge').textContent = stats.requests || 0;
    }

    /**
     * Настройка обработчиков событий
     */
    function setupEventListeners() {
        // Навигация по разделам
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                switchSection(section);
            });
        });

        // Редактирование профиля
        editBtn.addEventListener('click', () => {
            if (!isEditing) {
                enableEditing();
            }
        });

        cancelBtn.addEventListener('click', () => {
            disableEditing();
            displayProfile(currentUser);
        });

        // Сохранение профиля
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProfile();
        });

        // Загрузка аватара
        avatarInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                await uploadAvatar(e.target.files[0]);
            }
        });

        // Загрузка данных при переключении разделов
        document.getElementById('viewsSection').addEventListener('show', loadViews);
        document.getElementById('favoritesSection').addEventListener('show', loadFavorites);
        document.getElementById('requestsSection').addEventListener('show', loadRequests);
    }

    /**
     * Переключение раздела
     */
    function switchSection(section) {
        // Обновляем навигацию
        navItems.forEach(item => {
            if (item.getAttribute('data-section') === section) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Показываем нужную секцию
        sections.forEach(sec => {
            if (sec.id === section + 'Section') {
                sec.classList.add('active');
                sec.dispatchEvent(new Event('show'));
            } else {
                sec.classList.remove('active');
            }
        });
    }

    /**
     * Включение режима редактирования
     */
    function enableEditing() {
        isEditing = true;
        const inputs = profileForm.querySelectorAll('input:not([name="email"])');
        inputs.forEach(input => {
            input.removeAttribute('readonly');
        });
        formActions.style.display = 'flex';
        editBtn.style.display = 'none';
    }

    /**
     * Отключение режима редактирования
     */
    function disableEditing() {
        isEditing = false;
        const inputs = profileForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
        });
        formActions.style.display = 'none';
        editBtn.style.display = 'flex';
    }

    /**
     * Сохранение профиля
     */
    async function saveProfile() {
        const formData = new FormData(profileForm);
        const data = {
            full_name: formData.get('full_name'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            city: formData.get('city'),
            birth_date: formData.get('birth_date')
        };

        try {
            const response = await fetch(API_BASE + 'profile.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                alert('Профиль успешно обновлен!');
                disableEditing();
                loadProfile();
            } else {
                alert('Ошибка: ' + (result.error || 'Не удалось обновить профиль'));
            }
        } catch (error) {
            console.error('Ошибка сохранения профиля:', error);
            alert('Произошла ошибка при сохранении профиля');
        }
    }

    /**
     * Загрузка аватара
     */
    async function uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('action', 'upload_avatar');

        try {
            const response = await fetch(API_BASE + 'profile.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                avatarImage.src = result.avatar;
                alert('Аватар успешно загружен!');
            } else {
                alert('Ошибка: ' + (result.error || 'Не удалось загрузить аватар'));
            }
        } catch (error) {
            console.error('Ошибка загрузки аватара:', error);
            alert('Произошла ошибка при загрузке аватара');
        }
    }

    /**
     * Загрузка просмотренных автомобилей
     */
    async function loadViews() {
        const grid = document.getElementById('viewsGrid');
        grid.innerHTML = '<div class="loading">Загрузка...</div>';

        try {
            const response = await fetch(API_BASE + 'car_views.php');
            const data = await response.json();

            if (data.success && data.views.length > 0) {
                grid.innerHTML = data.views.map(car => createCarCard(car, car.viewed_at)).join('');
            } else {
                grid.innerHTML = `
                    <div class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <p>Вы еще не просматривали автомобили</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Ошибка загрузки просмотренных:', error);
            grid.innerHTML = '<div class="empty-state"><p>Ошибка загрузки данных</p></div>';
        }
    }

    /**
     * Загрузка избранных автомобилей
     */
    async function loadFavorites() {
        const grid = document.getElementById('favoritesGrid');
        // TODO: Реализовать API для избранного
        grid.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <p>У вас пока нет избранных автомобилей</p>
            </div>
        `;
    }

    /**
     * Загрузка заявок
     */
    async function loadRequests() {
        const list = document.getElementById('requestsList');
        // TODO: Реализовать API для заявок пользователя
        list.innerHTML = '<div class="empty-state"><p>У вас пока нет заявок</p></div>';
    }

    /**
     * Создание карточки автомобиля
     */
    function createCarCard(car, viewedAt = null) {
        const viewedDate = viewedAt ? new Date(viewedAt).toLocaleDateString('ru-RU') : '';
        return `
            <div class="car-card" onclick="window.location.href='${car.link || '#'}'">
                <img src="${car.main_image || 'img/default-car.jpg'}" alt="${car.brand} ${car.model}" class="car-card-image" onerror="this.src='img/default-car.jpg'">
                <div class="car-card-content">
                    <div class="car-card-brand">${car.brand}</div>
                    <h3 class="car-card-model">${car.model}</h3>
                    <p class="car-card-year">${car.year} год</p>
                    <div class="car-card-price">${formatPrice(car.price)} ${car.currency}</div>
                    ${viewedDate ? `<p class="car-card-viewed">Просмотрено: ${viewedDate}</p>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Форматирование цены
     */
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }

})();

