-- Миграция: Добавление полей для профиля пользователя и истории просмотров
-- Дата: 2024

USE unionauto_db;

-- Добавляем поле avatar в таблицу users
ALTER TABLE users 
ADD COLUMN avatar VARCHAR(255) NULL AFTER phone,
ADD COLUMN country VARCHAR(50) NULL AFTER avatar,
ADD COLUMN city VARCHAR(50) NULL AFTER country,
ADD COLUMN birth_date DATE NULL AFTER city;

-- Создаем таблицу для истории просмотров автомобилей
CREATE TABLE IF NOT EXISTS car_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_car (car_id),
    INDEX idx_viewed_at (viewed_at),
    UNIQUE KEY unique_user_car_view (user_id, car_id, DATE(viewed_at))
);

-- Создаем таблицу для избранных автомобилей
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, car_id),
    INDEX idx_user (user_id),
    INDEX idx_car (car_id)
);

