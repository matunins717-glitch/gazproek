/**
 * Инициализация страницы автомобиля
 */

(function() {
    'use strict';

    // Конфигурация автомобилей
    const carsData = {
        '1': {
            brand: 'LEXUS',
            model: 'LX LX500d',
            year: 2022,
            price: 'AED 20 000 000',
            status: 'В наличии',
            horsepower: '415 л.с.',
            drive: 'AWD',
            seats: '7',
            acceleration: '7.7 сек',
            consumption: '9.1 л/100км',
            transmission: 'Автомат',
            description: 'Премиальный внедорожник Lexus LX 500d с дизельным двигателем. Объединяет в себе роскошь, комфорт и выдающиеся внедорожные характеристики.',
            images: [
                'snapedit_1764070853612.jpeg/1.png',
                'snapedit_1764070853612.jpeg/1.png',
                'snapedit_1764070853612.jpeg/1.png',
                'snapedit_1764070853612.jpeg/1.png'
            ],
            specs: {
                'Привод': 'Полный',
                'Объем двигателя': '3.5 л',
                'Тип двигателя': 'Дизель',
                'Расход топлива': '9.1 л/100км',
                'Разгон 0-100': '7.7 сек',
                'Мощность': '415 л.с.',
                'Количество передач': '8',
                'Объем багажника': '701 л',
                'Тип КПП': 'Автоматическая',
                'Тип кузова': 'SUV'
            },
            features: [
                'Легкосплавные диски',
                'Тонировка',
                'Люк',
                'Спойлер',
                'Кожаный салон',
                'Аудиосистема',
                'Bluetooth',
                'Навигация',
                'Круиз-контроль',
                'Подогрев сидений',
                'Парктроник',
                'Камера заднего вида'
            ]
        },
        '2': {
            brand: 'MITSUBISHI',
            model: 'Pajero Sport GLX',
            year: 2023,
            price: 'AED 4 620 047',
            status: 'В наличии',
            horsepower: '181 л.с.',
            drive: '4WD',
            seats: '7',
            acceleration: '11.0 сек',
            consumption: '8.1 л/100км',
            transmission: 'Автомат',
            description: 'Надежный внедорожник Mitsubishi Pajero Sport с отличными внедорожными характеристиками.',
            images: [
                'snapedit_1764070853612.jpeg/2.png',
                'snapedit_1764070853612.jpeg/2.png',
                'snapedit_1764070853612.jpeg/2.png',
                'snapedit_1764070853612.jpeg/2.png'
            ],
            specs: {
                'Привод': 'Полный',
                'Объем двигателя': '2.4 л',
                'Тип двигателя': 'Дизель',
                'Расход топлива': '8.1 л/100км',
                'Разгон 0-100': '11.0 сек',
                'Мощность': '181 л.с.',
                'Количество передач': '8',
                'Объем багажника': '502 л',
                'Тип КПП': 'Автоматическая',
                'Тип кузова': 'SUV'
            },
            features: [
                'Легкосплавные диски',
                'Навигация',
                'Круиз-контроль',
                '7 мест',
                'Полный привод'
            ]
        }
        // Добавьте остальные автомобили по аналогии
    };

    // Инициализация
    init();

    function init() {
        const carId = document.body.getAttribute('data-car-id');
        if (carId && carsData[carId]) {
            loadCarData(carsData[carId]);
        }
        setupTabs();
        setupButtons();
    }

    /**
     * Загрузка данных автомобиля
     */
    function loadCarData(car) {
        // Заголовок
        const titleElements = document.querySelectorAll('[data-car-title]');
        titleElements.forEach(el => {
            if (el.tagName === 'TITLE') {
                el.textContent = `${car.brand} ${car.model} - UnionAuto`;
            } else {
                el.textContent = `${car.brand} ${car.model}`;
            }
        });

        // Бренд
        const brandElements = document.querySelectorAll('[data-car-brand]');
        brandElements.forEach(el => el.textContent = car.brand);

        // Год
        const yearElements = document.querySelectorAll('[data-car-year]');
        yearElements.forEach(el => el.textContent = car.year);

        // Цена
        const priceElements = document.querySelectorAll('[data-car-price]');
        priceElements.forEach(el => el.textContent = car.price);

        // Статус
        const statusElements = document.querySelectorAll('[data-car-status]');
        statusElements.forEach(el => el.textContent = car.status);

        // Хлебные крошки
        const breadcrumbElements = document.querySelectorAll('[data-car-breadcrumb]');
        breadcrumbElements.forEach(el => el.textContent = `${car.brand} ${car.model}`);

        // Спецификации
        const specElements = {
            'data-spec-horsepower': car.horsepower,
            'data-spec-drive': car.drive,
            'data-spec-seats': car.seats,
            'data-spec-acceleration': car.acceleration,
            'data-spec-consumption': car.consumption,
            'data-spec-transmission': car.transmission
        };

        Object.entries(specElements).forEach(([attr, value]) => {
            const elements = document.querySelectorAll(`[${attr}]`);
            elements.forEach(el => el.textContent = value);
        });

        // Описание
        const descElements = document.querySelectorAll('[data-car-description]');
        descElements.forEach(el => el.textContent = car.description);

        // Характеристики
        if (car.specs) {
            const specsContainer = document.querySelector('[data-car-specs]');
            if (specsContainer) {
                specsContainer.innerHTML = '';
                Object.entries(car.specs).forEach(([label, value]) => {
                    const row = document.createElement('div');
                    row.className = 'spec-row';
                    row.innerHTML = `
                        <span class="spec-row-label">${label}</span>
                        <span class="spec-row-value">${value}</span>
                    `;
                    specsContainer.appendChild(row);
                });
            }
        }

        // Особенности
        if (car.features) {
            const featuresContainer = document.querySelector('[data-car-features]');
            if (featuresContainer) {
                featuresContainer.innerHTML = '';
                car.features.forEach(feature => {
                    const item = document.createElement('div');
                    item.className = 'feature-item';
                    item.textContent = feature;
                    featuresContainer.appendChild(item);
                });
            }
        }

        // Изображения
        if (car.images && window.carGallery) {
            window.carGallery.setImages(car.images);
        }
    }

    /**
     * Настройка вкладок
     */
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                
                // Убираем активный класс со всех кнопок и контента
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Добавляем активный класс выбранным
                btn.classList.add('active');
                const content = document.getElementById(tabName + 'Tab');
                if (content) {
                    content.classList.add('active');
                }
            });
        });
    }

    /**
     * Настройка кнопок
     */
    function setupButtons() {
        // Кнопка заказа
        const orderBtn = document.getElementById('orderBtn');
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                const openBtn = document.getElementById('openRequestModal');
                if (openBtn) {
                    openBtn.click();
                } else {
                    window.location.href = 'contact.html';
                }
            });
        }

        // Кнопка избранного
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', async () => {
                // TODO: Реализовать добавление в избранное через API
                favoriteBtn.classList.toggle('active');
                alert('Добавлено в избранное');
            });
        }
    }

})();

