// Cars page specific JavaScript

// Vehicle filter functionality
(function() {
    'use strict';
    
    const filterSection = document.querySelector('.vehicle-filter-section');
    if (!filterSection) return;
    
    const vehiclesData = [
        {
            id: 'backhoe-loader',
            brand: 'ЗЕМЛЯНЫЕ РАБОТЫ',
            model: 'Экскаватор‑погрузчик',
            year: 8, // мин. заказ (часов)
            price: 18000, // ₽/смена
            priceUnit: 'смена',
            bodyType: 'Копка/планировка',
            specs: 'С оператором',
            mileage: 'От 8 часов • подача на объект',
            image: "img/1200x900%20(3).webp",
            link: './1ndex.html'
        },
        {
            id: 'excavator',
            brand: 'ЗЕМЛЯНЫЕ РАБОТЫ',
            model: 'Экскаватор',
            year: 8,
            price: 20000,
            priceUnit: 'смена',
            bodyType: 'Котлован/траншеи',
            specs: 'С оператором',
            mileage: 'Разные объемы ковша',
            image: "img/1200x900n.webp",
            link: './8index.html'
        },
        {
            id: 'mini-loader',
            brand: 'ПОГРУЗКА',
            model: 'Мини‑погрузчик',
            year: 4,
            price: 14000,
            priceUnit: 'смена',
            bodyType: 'Стесненные условия',
            specs: 'С навесным',
            mileage: 'Щётка/ковш/вилы — по запросу',
            image: "img/1200x900%20(1).webp",
            link: './5index.html'
        },
        {
            id: 'truck-crane',
            brand: 'ПОДЪЁМ',
            model: 'Автокран',
            year: 8,
            price: 22000,
            priceUnit: 'смена',
            bodyType: 'Монтаж/подъём',
            specs: 'С оператором',
            mileage: 'Подбор грузоподъёмности под задачу',
            image: "img/1200x900%20(2).webp",
            link: './2index.html'
        },
        {
            id: 'manipulator',
            brand: 'ДОСТАВКА',
            model: 'Манипулятор',
            year: 2,
            price: 2800,
            priceUnit: 'час',
            bodyType: 'Доставка/разгрузка',
            specs: 'Почасовая',
            mileage: 'Уточняйте г/п и вылет стрелы',
            image: "img/gen1200.jpg",
            link: './3index.html'
        },
        {
            id: 'dump-truck',
            brand: 'ДОСТАВКА',
            model: 'Самосвал',
            year: 2,
            price: 2500,
            priceUnit: 'час',
            bodyType: 'Песок/щебень/грунт',
            specs: 'Почасовая',
            mileage: 'Вывоз/доставка материалов',
            image: "img/1200x900.webp",
            link: './4index.html'
        },
        {
            id: 'aerial-platform',
            brand: 'ВЫСОТНЫЕ РАБОТЫ',
            model: 'Автовышка',
            year: 2,
            price: 2200,
            priceUnit: 'час',
            bodyType: 'Фасады/монтаж',
            specs: 'Почасовая',
            mileage: 'Подбор высоты — по задаче',
            image: "img/1200x900%20(4).webp",
            link: './6index.html'
        },
        {
            id: 'roller',
            brand: 'ДОРОЖНЫЕ РАБОТЫ',
            model: 'Каток',
            year: 8,
            price: 16000,
            priceUnit: 'смена',
            bodyType: 'Уплотнение основания',
            specs: 'С оператором',
            mileage: 'Асфальт/щебень/песок',
            image: "img/1200x900%20(5).webp",
            link: './7index.html'
        }
    ];
    
    const filterOptions = {
        brand: [
            { label: 'Все типы', value: 'all' },
            { label: 'ЗЕМЛЯНЫЕ РАБОТЫ', value: 'ЗЕМЛЯНЫЕ РАБОТЫ' },
            { label: 'ПОГРУЗКА', value: 'ПОГРУЗКА' },
            { label: 'ПОДЪЁМ', value: 'ПОДЪЁМ' },
            { label: 'ДОСТАВКА', value: 'ДОСТАВКА' },
            { label: 'ВЫСОТНЫЕ РАБОТЫ', value: 'ВЫСОТНЫЕ РАБОТЫ' }
        ],
        year: [
            { label: 'Любой', value: 'all', min: 0, max: 24 },
            { label: 'От 2 часов', value: '2+', min: 2, max: 24 },
            { label: 'От 4 часов', value: '4+', min: 4, max: 24 },
            { label: 'От 8 часов (смена)', value: '8+', min: 8, max: 24 }
        ],
        price: [
            { label: 'Любая', value: 'all', min: 0, max: Infinity },
            { label: 'До 2 500 ₽', value: '0-2500', min: 0, max: 2500 },
            { label: '2 500–5 000 ₽', value: '2500-5000', min: 2500, max: 5000 },
            { label: 'Свыше 5 000 ₽', value: '5000+', min: 5000, max: Infinity }
        ],
        bodyType: [
            { label: 'Любая', value: 'all' },
            { label: 'Копка/планировка', value: 'Копка/планировка' },
            { label: 'Котлован/траншеи', value: 'Котлован/траншеи' },
            { label: 'Монтаж/подъём', value: 'Монтаж/подъём' },
            { label: 'Доставка/разгрузка', value: 'Доставка/разгрузка' },
            { label: 'Фасады/монтаж', value: 'Фасады/монтаж' }
        ],
        specs: [
            { label: 'Любой', value: 'all' },
            { label: 'С оператором', value: 'С оператором' },
            { label: 'Почасовая', value: 'Почасовая' },
            { label: 'С навесным', value: 'С навесным' }
        ]
    };
    
    const filterSelections = Object.fromEntries(
        Object.entries(filterOptions).map(([key, options]) => [key, options[0]])
    );
    
    const filterFields = filterSection.querySelectorAll('.filter-field');
    const searchBtn = filterSection.querySelector('.filter-search-btn');
    const resultsContainer = document.getElementById('vehicleResults');
    const resultsCount = document.getElementById('vehicleResultsCount');
    const numberFormatter = new Intl.NumberFormat('ru-RU');
    
    function updateCurrentValue(filterName) {
        const current = filterSection.querySelector(`.filter-value[data-current="${filterName}"]`);
        if (current) current.textContent = filterSelections[filterName].label;
    }
    
    function closeAllDropdowns() {
        filterFields.forEach(field => field.classList.remove('open'));
    }
    
    function renderFilterOptions() {
        filterFields.forEach(field => {
            const filterName = field.dataset.filter;
            const optionsContainer = field.querySelector('.filter-options');
            const options = filterOptions[filterName] || [];
            
            if (optionsContainer) {
                options.forEach(option => {
                    const optionBtn = document.createElement('button');
                    optionBtn.type = 'button';
                    optionBtn.className = 'filter-option';
                    optionBtn.textContent = option.label;
                    if (option === filterSelections[filterName]) optionBtn.classList.add('active');
                    
                    optionBtn.addEventListener('click', () => {
                        filterSelections[filterName] = option;
                        optionsContainer.querySelectorAll('.filter-option').forEach(btn => btn.classList.remove('active'));
                        optionBtn.classList.add('active');
                        updateCurrentValue(filterName);
                        closeAllDropdowns();
                    });
                    
                    optionsContainer.appendChild(optionBtn);
                });
            }
            
            updateCurrentValue(filterName);
            
            const selectBtn = field.querySelector('.filter-select');
            if (selectBtn) {
                selectBtn.addEventListener('click', () => {
                    const isOpen = field.classList.contains('open');
                    closeAllDropdowns();
                    if (!isOpen) field.classList.add('open');
                });
            }
        });
    }
    
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.filter-field')) closeAllDropdowns();
    });
    
    function formatPrice(value, unit) {
        const formatted = numberFormatter.format(Math.round(value));
        if (unit === 'час') return `от ${formatted} ₽/час`;
        return `от ${formatted} ₽/смена`;
    }
    
    function renderVehicles(cars) {
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '';
        
        if (resultsCount) {
            resultsCount.textContent = `Найдено ${cars.length} вариантов техники`;
        }
        
        if (!cars.length) {
            const empty = document.createElement('div');
            empty.className = 'vehicle-results-empty';
            empty.textContent = 'Нет техники по указанным параметрам. Попробуйте изменить фильтры.';
            resultsContainer.appendChild(empty);
            return;
        }
        
        const fragment = document.createDocumentFragment();
        cars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'Kart new-card vehicle-card';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img class="card-car-image" src="${car.image}" alt="${car.model}" loading="lazy">
                </div>
                <div class="card-content">
                    <div class="card-brand">
                        <span class="brand-name">${car.brand}</span>
                    </div>
                    <h3 class="card-model">${car.model}</h3>
                    <p class="card-mileage">${car.mileage}</p>
                    <div class="card-price-wrapper">
                        <span class="card-price">${formatPrice(car.price, car.priceUnit)}</span>
                    </div>
                    <div class="card-extra">
                        <span>Мин. заказ: ${car.year} ч</span>
                        <span>${car.bodyType}</span>
                        <span>${car.specs}</span>
                    </div>
                </div>
                <a href="${car.link || '#'}" class="card-link"></a>
            `;
            fragment.appendChild(card);
        });
        
        resultsContainer.appendChild(fragment);
    }
    
    function applyFilters() {
        const filtered = vehiclesData.filter(car => {
            const brandOk = filterSelections.brand.value === 'all' || car.brand === filterSelections.brand.value;
            const bodyOk = filterSelections.bodyType.value === 'all' || car.bodyType === filterSelections.bodyType.value;
            const specsOk = filterSelections.specs.value === 'all' || car.specs === filterSelections.specs.value;
            const yearOk = car.year >= filterSelections.year.min && car.year <= filterSelections.year.max;
            const priceOk = car.price >= filterSelections.price.min && car.price <= filterSelections.price.max;
            return brandOk && bodyOk && specsOk && yearOk && priceOk;
        });
        
        renderVehicles(filtered);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            applyFilters();
            closeAllDropdowns();
        });
    }
    
    renderFilterOptions();
    applyFilters();
})();

