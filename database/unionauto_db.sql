-- =====================================================
-- База данных UnionAuto
-- Версия: 1.0.0
-- Дата создания: 2024
-- =====================================================

-- Создание базы данных
CREATE DATABASE IF NOT EXISTS unionauto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE unionauto_db;

-- =====================================================
-- Таблица пользователей (для админ-панели)
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- =====================================================
-- Таблица автомобилей
-- =====================================================
CREATE TABLE cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AED',
    condition ENUM('new', 'used', 'demo') DEFAULT 'new',
    description TEXT,
    features TEXT, -- JSON-строка с характеристиками
    specifications TEXT, -- JSON-строка с техническими характеристиками
    main_image VARCHAR(255),
    images TEXT, -- JSON-строка с путями к изображениям
    status ENUM('available', 'sold', 'reserved') DEFAULT 'available',
    vin VARCHAR(50) UNIQUE,
    engine_capacity DECIMAL(5,2), -- в литрах
    horsepower INT,
    transmission ENUM('automatic', 'manual', 'cvt', 'dsg') DEFAULT 'automatic',
    drive_type ENUM('awd', 'rwd', 'fwd', '4wd') DEFAULT 'awd',
    fuel_type ENUM('gasoline', 'diesel', 'hybrid', 'electric') DEFAULT 'gasoline',
    color VARCHAR(50),
    mileage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_brand (brand),
    INDEX idx_year (year),
    INDEX idx_price (price),
    INDEX idx_status (status),
    INDEX idx_condition (condition),
    INDEX idx_fuel_type (fuel_type)
);

-- =====================================================
-- Таблица категорий автомобилей
-- =====================================================
CREATE TABLE car_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES car_categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug)
);

-- =====================================================
-- Связующая таблица автомобилей и категорий
-- =====================================================
CREATE TABLE car_category_relations (
    car_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (car_id, category_id),
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES car_categories(id) ON DELETE CASCADE
);

-- =====================================================
-- Таблица новостей
-- =====================================================
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    author_id INT,
    cover_image VARCHAR(255),
    images TEXT, -- JSON-строка с путями к изображениям
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_published (is_published, published_at),
    INDEX idx_slug (slug),
    INDEX idx_created (created_at)
);

-- =====================================================
-- Таблица категорий новостей
-- =====================================================
CREATE TABLE news_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
);

-- =====================================================
-- Связующая таблица новостей и категорий
-- =====================================================
CREATE TABLE news_category_relations (
    news_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (news_id, category_id),
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES news_categories(id) ON DELETE CASCADE
);

-- =====================================================
-- Таблица заявок на обратный звонок
-- =====================================================
CREATE TABLE callbacks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    car_id INT NULL,
    message TEXT,
    status ENUM('new', 'processed', 'completed', 'rejected') DEFAULT 'new',
    assigned_to INT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contacted_at TIMESTAMP NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_car_id (car_id)
);

-- =====================================================
-- Таблица заказов автомобилей
-- =====================================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_country VARCHAR(50),
    customer_city VARCHAR(50),
    car_id INT NOT NULL,
    car_price DECIMAL(12,2) NOT NULL,
    delivery_cost DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('invoice', 'cash', 'bank_transfer', 'crypto') DEFAULT 'invoice',
    payment_status ENUM('pending', 'paid', 'partial', 'refunded') DEFAULT 'pending',
    order_status ENUM('new', 'processing', 'shipping', 'delivered', 'cancelled') DEFAULT 'new',
    delivery_address TEXT,
    delivery_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (order_status),
    INDEX idx_customer_email (customer_email),
    INDEX idx_payment_status (payment_status)
);

-- =====================================================
-- Таблица отзывов клиентов
-- =====================================================
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_name VARCHAR(100) NOT NULL,
    client_country VARCHAR(50),
    car_model VARCHAR(100),
    rating TINYINT CHECK (rating >= 1 AND rating <= 5),
    testimonial TEXT NOT NULL,
    photo VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    INDEX idx_approved (is_approved),
    INDEX idx_rating (rating),
    INDEX idx_created (created_at)
);

-- =====================================================
-- Таблица контактов (контактная информация компании)
-- =====================================================
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('phone', 'email', 'address', 'social') NOT NULL,
    value VARCHAR(255) NOT NULL,
    label VARCHAR(100),
    description TEXT,
    icon VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_primary (is_primary)
);

-- =====================================================
-- Таблица настроек сайта
-- =====================================================
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json', 'html') DEFAULT 'text',
    category VARCHAR(50),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_category (category)
);

-- =====================================================
-- Таблица просмотров (статистика)
-- =====================================================
CREATE TABLE views_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_type ENUM('car', 'news', 'home', 'about', 'contact') NOT NULL,
    page_id INT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_page (page_type, page_id),
    INDEX idx_date (viewed_at)
);

-- =====================================================
-- ВСТАВКА НАЧАЛЬНЫХ ДАННЫХ
-- =====================================================

-- Добавляем администратора
-- Пароль: admin123 (хеш bcrypt)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@unionauto.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Администратор', 'admin');

-- Добавляем основные категории автомобилей
INSERT INTO car_categories (name, slug, description) VALUES
('SUV', 'suv', 'Внедорожники и кроссоверы'),
('Sedan', 'sedan', 'Седаны'),
('Coupe', 'coupe', 'Купэ'),
('Crossover', 'crossover', 'Кроссоверы'),
('Luxury', 'luxury', 'Премиальные автомобили'),
('New', 'new', 'Новые автомобили'),
('Used', 'used', 'Подержанные автомобили');

-- Добавляем категории новостей
INSERT INTO news_categories (name, slug, description) VALUES
('Новости', 'news', 'Последние новости компании'),
('Акции', 'specials', 'Специальные предложения и акции'),
('Обзоры', 'reviews', 'Обзоры автомобилей'),
('Доставка', 'delivery', 'Новости о доставке и логистике'),
('Сервис', 'service', 'Новости о сервисном обслуживании');

-- Добавляем контактную информацию
INSERT INTO contacts (type, value, label, is_primary, sort_order) VALUES
('phone', '+971 4 608 68 08', 'Основной телефон', TRUE, 1),
('email', 'info@unionauto.com', 'Электронная почта', TRUE, 2),
('address', 'Showroom 1, Al Roumi building, Al Ittihad Rd, Port Saeed, Dubai, UAE', 'Адрес шоурума', TRUE, 3),
('social', 'https://facebook.com/unionauto', 'Facebook', FALSE, 4),
('social', 'https://instagram.com/unionauto', 'Instagram', FALSE, 5),
('social', 'https://t.me/unionauto', 'Telegram', FALSE, 6);

-- Добавляем настройки сайта
INSERT INTO settings (setting_key, setting_value, setting_type, category) VALUES
('site_title', 'UnionAuto - Премиальные автомобили из Дубая', 'text', 'general'),
('site_description', 'Продажа премиальных автомобилей из Дубая с доставкой в страны СНГ', 'text', 'general'),
('site_keywords', 'автосалон, Дубай, премиум, автомобили, доставка', 'text', 'general'),
('currency', 'AED', 'text', 'general'),
('phone_number', '+971 4 608 68 08', 'text', 'contact'),
('email', 'info@unionauto.com', 'text', 'contact'),
('address', 'Showroom 1, Al Roumi building, Al Ittihad Rd, Port Saeed, Dubai, UAE', 'text', 'contact'),
('working_hours', '{"weekdays": "9:00 - 20:00", "sunday": "10:00 - 18:00"}', 'json', 'contact'),
('social_links', '{"facebook": "https://facebook.com/unionauto", "instagram": "https://instagram.com/unionauto", "telegram": "https://t.me/unionauto"}', 'json', 'social'),
('payment_methods', '["invoice", "cash", "bank_transfer", "crypto"]', 'json', 'payment');

-- Пример добавления автомобилей
INSERT INTO cars (brand, model, year, price, condition, description, features, specifications, status, engine_capacity, horsepower, transmission, drive_type, fuel_type, color, mileage, main_image) VALUES
('Lexus', 'LX 500d', 2022, 20000000.00, 'new', 'Премиальный внедорожник Lexus LX 500d с дизельным двигателем', '{"alloy_wheels": true, "leather": true, "navigation": true, "sunroof": true, "premium_audio": true}', '{"engine": "3.5L V6 Twin Turbo", "seats": 7, "trunk": "701L", "fuel_consumption": "9.1L/100km"}', 'available', 3.5, 415, 'automatic', 'awd', 'diesel', 'Black', 0, 'snapedit_1764070853612.jpeg/1.png'),
('Mitsubishi', 'Pajero Sport GLX', 2023, 4620047.00, 'new', 'Надежный внедорожник Mitsubishi Pajero Sport', '{"alloy_wheels": true, "leather": false, "navigation": true, "cruise_control": true}', '{"engine": "2.4L Diesel", "seats": 7, "trunk": "502L", "fuel_consumption": "8.1L/100km"}', 'available', 2.4, 181, 'automatic', '4wd', 'diesel', 'White', 0, 'snapedit_1764070853612.jpeg/2.png'),
('Lexus', 'UX 200 Luxury', 2022, 2780000.00, 'new', 'Компактный премиальный кроссовер Lexus UX', '{"alloy_wheels": true, "leather": true, "navigation": true, "premium_audio": true}', '{"engine": "2.0L", "seats": 5, "trunk": "320L", "fuel_consumption": "6.1L/100km"}', 'available', 2.0, 169, 'cvt', 'fwd', 'gasoline', 'Silver', 0, 'snapedit_1764070853612.jpeg/3.png'),
('Mercedes-Benz', 'G-Class', 2022, 12900000.00, 'new', 'Легендарный внедорожник Mercedes-Benz G-Class', '{"alloy_wheels": true, "leather": true, "navigation": true, "sunroof": true, "amg_package": true}', '{"engine": "4.0L V8 Biturbo", "seats": 5, "trunk": "667L", "fuel_consumption": "11.8L/100km"}', 'available', 4.0, 585, 'automatic', 'awd', 'gasoline', 'Black', 0, 'snapedit_1764070853612.jpeg/4.png'),
('Dodge', 'Challenger SRT Hellcat', 2023, 20515220.00, 'new', 'Мощный спортивный автомобиль Dodge Challenger SRT Hellcat', '{"alloy_wheels": true, "leather": true, "navigation": true, "sport_suspension": true}', '{"engine": "6.2L V8 Supercharged", "seats": 5, "trunk": "425L", "fuel_consumption": "16.2L/100km"}', 'available', 6.2, 717, 'automatic', 'rwd', 'gasoline', 'Red', 0, 'snapedit_1764070853612.jpeg/5.png'),
('Nissan', 'Almera', 2007, 45765999.00, 'used', 'Надежный седан Nissan Almera', '{"alloy_wheels": false, "leather": false, "navigation": false, "air_conditioning": true}', '{"engine": "1.6L", "seats": 5, "trunk": "450L", "fuel_consumption": "7.5L/100km"}', 'available', 1.6, 109, 'manual', 'fwd', 'gasoline', 'Silver', 150000, 'snapedit_1764070853612.jpeg/6.png'),
('Lada', 'Priora', 2015, 59960795.00, 'used', 'Классический российский седан Lada Priora', '{"alloy_wheels": false, "leather": false, "navigation": false, "power_steering": true}', '{"engine": "1.6L", "seats": 5, "trunk": "430L", "fuel_consumption": "7.8L/100km"}', 'available', 1.6, 98, 'manual', 'fwd', 'gasoline', 'White', 120000, 'snapedit_1764070853612.jpeg/7.png'),
('Toyota', 'Land Cruiser 300', 2023, 13800000.00, 'new', 'Новое поколение легендарного Toyota Land Cruiser 300', '{"alloy_wheels": true, "leather": true, "navigation": true, "sunroof": true, "premium_package": true}', '{"engine": "3.5L V6 Twin Turbo Hybrid", "seats": 7, "trunk": "621L", "fuel_consumption": "10.7L/100km"}', 'available', 3.5, 409, 'automatic', 'awd', 'hybrid', 'Gray', 0, 'img/snapedit_1732210627151.png');

-- Добавляем примеры новостей
INSERT INTO news (title, slug, excerpt, content, author_id, cover_image, is_published, published_at, views_count) VALUES
('Новая коллекция премиальных автомобилей из Дубая', 'new-premium-collection-2024', 'UnionAuto рада представить новую коллекцию премиальных автомобилей', 'UnionAuto рада представить новую коллекцию премиальных автомобилей, включающую последние модели Lexus, Mercedes-Benz и других ведущих брендов. Все автомобили проходят тщательную проверку и готовы к доставке в страны СНГ.', 1, '🚗', TRUE, '2024-01-15 10:00:00', 0),
('Специальные условия на доставку в страны СНГ', 'special-delivery-conditions', 'Обновлены условия доставки автомобилей в страны СНГ', 'Обновлены условия доставки автомобилей в страны СНГ. Теперь срок доставки сокращен до 30-45 дней, а стоимость стала еще более выгодной. Мы предлагаем гибкие условия оплаты и полное сопровождение сделки.', 1, '🏆', TRUE, '2024-02-08 10:00:00', 0),
('Поступление эксклюзивных моделей Toyota Land Cruiser 300', 'toyota-landcruiser-300-exclusive', 'В наличии появились эксклюзивные комплектации Toyota Land Cruiser 300', 'В наличии появились эксклюзивные комплектации Toyota Land Cruiser 300 2023 года выпуска. Ограниченное количество автомобилей по специальным ценам. Успейте забронировать свой экземпляр!', 1, '⚡', TRUE, '2024-03-22 10:00:00', 0),
('Расширение сервисного центра в Дубае', 'service-center-expansion', 'Открыт новый сервисный центр с современным оборудованием', 'Открыт новый сервисный центр с современным оборудованием для обслуживания и ремонта премиальных автомобилей. Профессиональные мастера и оригинальные запчасти. Мы гарантируем качественное обслуживание вашего автомобиля.', 1, '🔧', TRUE, '2024-04-05 10:00:00', 0);

-- Добавляем примеры отзывов
INSERT INTO testimonials (client_name, client_country, car_model, rating, testimonial, is_approved, approved_at) VALUES
('Александр Иванов', 'Россия, Москва', 'Lexus LX 500d', 5, 'Отличный сервис! Купил Lexus LX через UnionAuto. Всё прошло гладко, автомобиль пришел в идеальном состоянии. Рекомендую!', TRUE, NOW()),
('Мария Петрова', 'Россия, Санкт-Петербург', 'Mercedes-Benz G-Class', 5, 'Очень довольна покупкой Mercedes-Benz G-Class. Менеджеры помогли на каждом этапе, доставка была быстрой. Спасибо!', TRUE, NOW()),
('Дмитрий Смирнов', 'Россия, Екатеринбург', 'Toyota Land Cruiser 300', 5, 'Покупал Toyota Land Cruiser 300. Профессиональный подход, все документы в порядке. Автомобиль превзошел ожидания!', TRUE, NOW()),
('Елена Козлова', 'Россия, Новосибирск', 'Lexus UX 200', 5, 'Отличная работа команды UnionAuto! Помогли выбрать идеальный Lexus UX. Всё прозрачно, без скрытых платежей. Спасибо!', TRUE, NOW()),
('Владимир Морозов', 'Россия, Казань', 'Mitsubishi Pajero Sport', 5, 'Приобрел Mitsubishi Pajero Sport. Очень доволен качеством обслуживания и самим автомобилем. Все условия соблюдены!', TRUE, NOW()),
('Анна Новикова', 'Россия, Краснодар', 'Dodge Challenger SRT Hellcat', 5, 'Купила Dodge CHALLENGER SRT HELLCAT. Мечта сбылась! Отличное обслуживание, быстрая доставка. Всем рекомендую UnionAuto!', TRUE, NOW());

-- Связываем автомобили с категориями
INSERT INTO car_category_relations (car_id, category_id) VALUES
(1, 1), (1, 5), (1, 5), -- Lexus LX - SUV, Luxury, New
(2, 1), (2, 5), -- Mitsubishi Pajero - SUV, New
(3, 4), (3, 5), (3, 5), -- Lexus UX - Crossover, Luxury, New
(4, 1), (4, 5), (4, 5), -- Mercedes G-Class - SUV, Luxury, New
(5, 3), (5, 5), -- Dodge Challenger - Coupe, New
(6, 2), (6, 6), -- Nissan Almera - Sedan, Used
(7, 2), (7, 6), -- Lada Priora - Sedan, Used
(8, 1), (8, 5), (8, 5); -- Toyota Land Cruiser - SUV, Luxury, New

-- Связываем новости с категориями
INSERT INTO news_category_relations (news_id, category_id) VALUES
(1, 1), -- Новость 1 - Новости
(2, 2), -- Новость 2 - Акции
(3, 1), (3, 2), -- Новость 3 - Новости, Акции
(4, 5); -- Новость 4 - Сервис

