<?php
/**
 * Примеры использования базы данных UnionAuto
 */

require_once 'config.php';

// ==================== ПОЛУЧЕНИЕ ДАННЫХ ====================

// Получить все доступные автомобили
function getAllAvailableCars() {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT * FROM cars 
        WHERE status = 'available' 
        ORDER BY price ASC
    ");
    $stmt->execute();
    return $stmt->fetchAll();
}

// Получить автомобили по марке
function getCarsByBrand($brand) {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT * FROM cars 
        WHERE brand = :brand AND status = 'available'
        ORDER BY year DESC, price ASC
    ");
    $stmt->execute([':brand' => $brand]);
    return $stmt->fetchAll();
}

// Получить автомобили с фильтрами
function getFilteredCars($filters = []) {
    $db = getDB();
    
    $sql = "SELECT * FROM cars WHERE status = 'available'";
    $params = [];
    
    if (!empty($filters['brand'])) {
        $sql .= " AND brand = :brand";
        $params[':brand'] = $filters['brand'];
    }
    
    if (!empty($filters['min_price'])) {
        $sql .= " AND price >= :min_price";
        $params[':min_price'] = $filters['min_price'];
    }
    
    if (!empty($filters['max_price'])) {
        $sql .= " AND price <= :max_price";
        $params[':max_price'] = $filters['max_price'];
    }
    
    if (!empty($filters['year'])) {
        $sql .= " AND year = :year";
        $params[':year'] = $filters['year'];
    }
    
    if (!empty($filters['fuel_type'])) {
        $sql .= " AND fuel_type = :fuel_type";
        $params[':fuel_type'] = $filters['fuel_type'];
    }
    
    $sql .= " ORDER BY price ASC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

// Получить один автомобиль по ID
function getCarById($id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM cars WHERE id = :id");
    $stmt->execute([':id' => $id]);
    return $stmt->fetch();
}

// ==================== РАБОТА С ЗАЯВКАМИ ====================

// Создать заявку
function createCallback($data) {
    $db = getDB();
    $stmt = $db->prepare("
        INSERT INTO callbacks (name, phone, email, message, car_id) 
        VALUES (:name, :phone, :email, :message, :car_id)
    ");
    return $stmt->execute([
        ':name' => $data['name'],
        ':phone' => $data['phone'],
        ':email' => $data['email'] ?? null,
        ':message' => $data['message'] ?? null,
        ':car_id' => $data['car_id'] ?? null
    ]);
}

// Получить новые заявки
function getNewCallbacks() {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT c.*, cars.brand, cars.model 
        FROM callbacks c
        LEFT JOIN cars ON c.car_id = cars.id
        WHERE c.status = 'new'
        ORDER BY c.created_at DESC
    ");
    $stmt->execute();
    return $stmt->fetchAll();
}

// Обновить статус заявки
function updateCallbackStatus($id, $status) {
    $db = getDB();
    $stmt = $db->prepare("
        UPDATE callbacks 
        SET status = :status, contacted_at = NOW() 
        WHERE id = :id
    ");
    return $stmt->execute([
        ':status' => $status,
        ':id' => $id
    ]);
}

// ==================== РАБОТА С НОВОСТЯМИ ====================

// Получить опубликованные новости
function getPublishedNews($limit = 10) {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT n.*, GROUP_CONCAT(nc.name) as categories
        FROM news n
        LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
        LEFT JOIN news_categories nc ON ncr.category_id = nc.id
        WHERE n.is_published = TRUE AND n.published_at <= NOW()
        GROUP BY n.id
        ORDER BY n.published_at DESC
        LIMIT :limit
    ");
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll();
}

// Получить новость по slug
function getNewsBySlug($slug) {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT n.*, GROUP_CONCAT(nc.name) as categories
        FROM news n
        LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
        LEFT JOIN news_categories nc ON ncr.category_id = nc.id
        WHERE n.slug = :slug AND n.is_published = TRUE
        GROUP BY n.id
    ");
    $stmt->execute([':slug' => $slug]);
    $news = $stmt->fetch();
    
    // Увеличить счетчик просмотров
    if ($news) {
        $updateStmt = $db->prepare("UPDATE news SET views_count = views_count + 1 WHERE id = :id");
        $updateStmt->execute([':id' => $news['id']]);
    }
    
    return $news;
}

// ==================== РАБОТА С ОТЗЫВАМИ ====================

// Получить одобренные отзывы
function getApprovedTestimonials($limit = 10) {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT * FROM testimonials 
        WHERE is_approved = TRUE 
        ORDER BY created_at DESC
        LIMIT :limit
    ");
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll();
}

// Создать отзыв
function createTestimonial($data) {
    $db = getDB();
    $stmt = $db->prepare("
        INSERT INTO testimonials (client_name, client_country, car_model, rating, testimonial) 
        VALUES (:client_name, :client_country, :car_model, :rating, :testimonial)
    ");
    return $stmt->execute([
        ':client_name' => $data['client_name'],
        ':client_country' => $data['client_country'] ?? null,
        ':car_model' => $data['car_model'] ?? null,
        ':rating' => $data['rating'],
        ':testimonial' => $data['testimonial']
    ]);
}

// ==================== РАБОТА С ЗАКАЗАМИ ====================

// Создать заказ
function createOrder($data) {
    $db = getDB();
    
    // Генерируем номер заказа
    $orderNumber = 'UA-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    
    $stmt = $db->prepare("
        INSERT INTO orders (
            order_number, customer_name, customer_email, customer_phone,
            customer_country, customer_city, car_id, car_price,
            delivery_cost, total_amount, payment_method, delivery_address
        ) VALUES (
            :order_number, :customer_name, :customer_email, :customer_phone,
            :customer_country, :customer_city, :car_id, :car_price,
            :delivery_cost, :total_amount, :payment_method, :delivery_address
        )
    ");
    
    $totalAmount = $data['car_price'] + ($data['delivery_cost'] ?? 0);
    
    return $stmt->execute([
        ':order_number' => $orderNumber,
        ':customer_name' => $data['customer_name'],
        ':customer_email' => $data['customer_email'],
        ':customer_phone' => $data['customer_phone'],
        ':customer_country' => $data['customer_country'] ?? null,
        ':customer_city' => $data['customer_city'] ?? null,
        ':car_id' => $data['car_id'],
        ':car_price' => $data['car_price'],
        ':delivery_cost' => $data['delivery_cost'] ?? 0,
        ':total_amount' => $totalAmount,
        ':payment_method' => $data['payment_method'] ?? 'invoice',
        ':delivery_address' => $data['delivery_address'] ?? null
    ]);
}

// Получить заказы пользователя по email
function getOrdersByEmail($email) {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT o.*, c.brand, c.model, c.main_image
        FROM orders o
        JOIN cars c ON o.car_id = c.id
        WHERE o.customer_email = :email
        ORDER BY o.created_at DESC
    ");
    $stmt->execute([':email' => $email]);
    return $stmt->fetchAll();
}

// ==================== СТАТИСТИКА ====================

// Получить статистику
function getStatistics() {
    $db = getDB();
    
    $stats = [];
    
    // Количество доступных автомобилей
    $stmt = $db->query("SELECT COUNT(*) as count FROM cars WHERE status = 'available'");
    $stats['available_cars'] = $stmt->fetch()['count'];
    
    // Количество новых заявок
    $stmt = $db->query("SELECT COUNT(*) as count FROM callbacks WHERE status = 'new'");
    $stats['new_callbacks'] = $stmt->fetch()['count'];
    
    // Количество заказов
    $stmt = $db->query("SELECT COUNT(*) as count FROM orders");
    $stats['total_orders'] = $stmt->fetch()['count'];
    
    // Общая сумма оплаченных заказов
    $stmt = $db->query("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'");
    $stats['total_revenue'] = $stmt->fetch()['total'] ?? 0;
    
    // Количество отзывов
    $stmt = $db->query("SELECT COUNT(*) as count FROM testimonials WHERE is_approved = TRUE");
    $stats['approved_testimonials'] = $stmt->fetch()['count'];
    
    // Средний рейтинг
    $stmt = $db->query("SELECT AVG(rating) as avg_rating FROM testimonials WHERE is_approved = TRUE");
    $stats['average_rating'] = round($stmt->fetch()['avg_rating'], 2);
    
    return $stats;
}

// ==================== ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ====================

// Пример 1: Получить все автомобили Lexus
// $lexusCars = getCarsByBrand('Lexus');
// foreach ($lexusCars as $car) {
//     echo $car['model'] . ' - ' . number_format($car['price']) . ' ' . $car['currency'] . '<br>';
// }

// Пример 2: Создать заявку
// createCallback([
//     'name' => 'Иван Иванов',
//     'phone' => '+7 (999) 123-45-67',
//     'email' => 'ivan@example.com',
//     'message' => 'Интересует автомобиль Lexus LX',
//     'car_id' => 1
// ]);

// Пример 3: Получить статистику
// $stats = getStatistics();
// echo "Доступных автомобилей: " . $stats['available_cars'] . '<br>';
// echo "Новых заявок: " . $stats['new_callbacks'] . '<br>';
// echo "Общая выручка: " . number_format($stats['total_revenue']) . ' AED<br>';

