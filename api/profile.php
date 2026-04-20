<?php
/**
 * API для работы с профилем пользователя
 */

header('Content-Type: application/json; charset=utf-8');
require_once '../database/config.php';

session_start();

// Проверка авторизации
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Не авторизован']);
    exit;
}

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$userId = $_SESSION['user_id'];

switch ($method) {
    case 'GET':
        // Получить профиль пользователя
        getProfile($db, $userId);
        break;
    
    case 'PUT':
    case 'PATCH':
        // Обновить профиль
        updateProfile($db, $userId);
        break;
    
    case 'POST':
        // Загрузить аватар
        if (isset($_POST['action']) && $_POST['action'] === 'upload_avatar') {
            uploadAvatar($db, $userId);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Неверный запрос']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Метод не поддерживается']);
}

/**
 * Получить профиль пользователя
 */
function getProfile($db, $userId) {
    $stmt = $db->prepare("
        SELECT id, username, email, full_name, phone, avatar, country, city, birth_date, created_at, last_login
        FROM users 
        WHERE id = :user_id
    ");
    $stmt->execute([':user_id' => $userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Пользователь не найден']);
        return;
    }
    
    // Получить статистику
    $stats = getUserStats($db, $userId);
    
    echo json_encode([
        'success' => true,
        'user' => $user,
        'stats' => $stats
    ]);
}

/**
 * Обновить профиль
 */
function updateProfile($db, $userId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Неверные данные']);
        return;
    }
    
    $allowedFields = ['full_name', 'phone', 'country', 'city', 'birth_date'];
    $updateFields = [];
    $params = [':user_id' => $userId];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateFields[] = "$field = :$field";
            $params[":$field"] = $data[$field];
        }
    }
    
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(['error' => 'Нет данных для обновления']);
        return;
    }
    
    $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = :user_id";
    $stmt = $db->prepare($sql);
    
    if ($stmt->execute($params)) {
        echo json_encode(['success' => true, 'message' => 'Профиль обновлен']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка обновления профиля']);
    }
}

/**
 * Загрузить аватар
 */
function uploadAvatar($db, $userId) {
    if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Ошибка загрузки файла']);
        return;
    }
    
    $file = $_FILES['avatar'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Недопустимый тип файла']);
        return;
    }
    
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'Файл слишком большой']);
        return;
    }
    
    // Создаем директорию для аватаров, если её нет
    $uploadDir = '../uploads/avatars/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Генерируем уникальное имя файла
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'avatar_' . $userId . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Удаляем старый аватар, если есть
    $stmt = $db->prepare("SELECT avatar FROM users WHERE id = :user_id");
    $stmt->execute([':user_id' => $userId]);
    $oldAvatar = $stmt->fetchColumn();
    
    if ($oldAvatar && file_exists('../' . $oldAvatar)) {
        unlink('../' . $oldAvatar);
    }
    
    // Загружаем файл
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $avatarPath = 'uploads/avatars/' . $filename;
        
        // Обновляем в БД
        $stmt = $db->prepare("UPDATE users SET avatar = :avatar WHERE id = :user_id");
        if ($stmt->execute([':avatar' => $avatarPath, ':user_id' => $userId])) {
            echo json_encode([
                'success' => true,
                'avatar' => $avatarPath,
                'message' => 'Аватар загружен'
            ]);
        } else {
            unlink($filepath);
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка сохранения в БД']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка загрузки файла']);
    }
}

/**
 * Получить статистику пользователя
 */
function getUserStats($db, $userId) {
    // Количество просмотренных автомобилей
    $stmt = $db->prepare("SELECT COUNT(DISTINCT car_id) as count FROM car_views WHERE user_id = :user_id");
    $stmt->execute([':user_id' => $userId]);
    $viewsCount = $stmt->fetchColumn();
    
    // Количество избранных автомобилей
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM user_favorites WHERE user_id = :user_id");
    $stmt->execute([':user_id' => $userId]);
    $favoritesCount = $stmt->fetchColumn();
    
    // Количество заявок
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM callbacks WHERE email = (SELECT email FROM users WHERE id = :user_id)");
    $stmt->execute([':user_id' => $userId]);
    $requestsCount = $stmt->fetchColumn();
    
    return [
        'views' => (int)$viewsCount,
        'favorites' => (int)$favoritesCount,
        'requests' => (int)$requestsCount
    ];
}

