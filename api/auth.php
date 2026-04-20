<?php
/**
 * API для аутентификации пользователей
 */

header('Content-Type: application/json; charset=utf-8');
require_once '../database/config.php';

session_start();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'login':
        login($db);
        break;
    
    case 'register':
        register($db);
        break;
    
    case 'logout':
        logout();
        break;
    
    case 'check':
        checkAuth();
        break;
    
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Неверное действие']);
}

/**
 * Вход пользователя
 */
function login($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email и пароль обязательны']);
        return;
    }
    
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email AND is_active = TRUE");
    $stmt->execute([':email' => $data['email']]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Неверный email или пароль']);
        return;
    }
    
    // Обновляем время последнего входа
    $updateStmt = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
    $updateStmt->execute([':id' => $user['id']]);
    
    // Создаем сессию
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];
    
    // Возвращаем данные пользователя (без пароля)
    unset($user['password_hash']);
    
    echo json_encode([
        'success' => true,
        'user' => $user,
        'message' => 'Вход выполнен успешно'
    ]);
}

/**
 * Регистрация пользователя
 */
function register($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Валидация
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Все поля обязательны']);
        return;
    }
    
    // Проверка существования пользователя
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $data['email']]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Пользователь с таким email уже существует']);
        return;
    }
    
    // Создаем пользователя
    $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
    $username = isset($data['username']) ? $data['username'] : explode('@', $data['email'])[0];
    
    $stmt = $db->prepare("
        INSERT INTO users (username, email, password_hash, full_name, phone, role) 
        VALUES (:username, :email, :password_hash, :full_name, :phone, 'user')
    ");
    
    if ($stmt->execute([
        ':username' => $username,
        ':email' => $data['email'],
        ':password_hash' => $passwordHash,
        ':full_name' => $data['name'],
        ':phone' => $data['phone'] ?? null
    ])) {
        $userId = $db->lastInsertId();
        
        // Автоматически входим
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $data['email'];
        $_SESSION['user_role'] = 'user';
        
        // Получаем данные пользователя
        $stmt = $db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute([':id' => $userId]);
        $user = $stmt->fetch();
        unset($user['password_hash']);
        
        echo json_encode([
            'success' => true,
            'user' => $user,
            'message' => 'Регистрация успешна'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка регистрации']);
    }
}

/**
 * Выход пользователя
 */
function logout() {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Выход выполнен']);
}

/**
 * Проверка авторизации
 */
function checkAuth() {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'authenticated' => true,
            'user_id' => $_SESSION['user_id'],
            'user_email' => $_SESSION['user_email'] ?? null,
            'user_role' => $_SESSION['user_role'] ?? null
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
}

