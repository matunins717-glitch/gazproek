<?php
/**
 * API для отслеживания просмотров автомобилей
 */

header('Content-Type: application/json; charset=utf-8');
require_once '../database/config.php';

session_start();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Записать просмотр автомобиля
        recordView($db);
        break;
    
    case 'GET':
        // Получить историю просмотров
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Не авторизован']);
            exit;
        }
        getViews($db, $_SESSION['user_id']);
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Метод не поддерживается']);
}

/**
 * Записать просмотр автомобиля
 */
function recordView($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['car_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Не указан ID автомобиля']);
        return;
    }
    
    $carId = (int)$data['car_id'];
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    // Проверяем существование автомобиля
    $stmt = $db->prepare("SELECT id FROM cars WHERE id = :car_id");
    $stmt->execute([':car_id' => $carId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => 'Автомобиль не найден']);
        return;
    }
    
    // Если пользователь авторизован, записываем просмотр
    if ($userId) {
        // Проверяем, не просматривал ли пользователь этот автомобиль сегодня
        $stmt = $db->prepare("
            SELECT id FROM car_views 
            WHERE user_id = :user_id AND car_id = :car_id AND DATE(viewed_at) = CURDATE()
        ");
        $stmt->execute([':user_id' => $userId, ':car_id' => $carId]);
        
        if (!$stmt->fetch()) {
            // Записываем просмотр
            $stmt = $db->prepare("
                INSERT INTO car_views (user_id, car_id) 
                VALUES (:user_id, :car_id)
            ");
            $stmt->execute([':user_id' => $userId, ':car_id' => $carId]);
        }
    }
    
    // Также записываем в общую статистику
    $stmt = $db->prepare("
        INSERT INTO views_stats (page_type, page_id, ip_address, user_agent) 
        VALUES ('car', :car_id, :ip, :user_agent)
    ");
    $stmt->execute([
        ':car_id' => $carId,
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
    ]);
    
    echo json_encode(['success' => true]);
}

/**
 * Получить историю просмотров пользователя
 */
function getViews($db, $userId) {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    
    $stmt = $db->prepare("
        SELECT 
            cv.id,
            cv.car_id,
            cv.viewed_at,
            c.brand,
            c.model,
            c.year,
            c.price,
            c.currency,
            c.main_image,
            c.status
        FROM car_views cv
        JOIN cars c ON cv.car_id = c.id
        WHERE cv.user_id = :user_id
        ORDER BY cv.viewed_at DESC
        LIMIT :limit
    ");
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $views = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'views' => $views,
        'count' => count($views)
    ]);
}

