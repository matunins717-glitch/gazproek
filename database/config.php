<?php
/**
 * Конфигурация подключения к базе данных UnionAuto
 */

// Настройки базы данных
// ВАЖНО: Измените эти значения на ваши настройки MySQL

// Хост базы данных (обычно 'localhost' или '127.0.0.1')
define('DB_HOST', 'localhost');

// Имя базы данных
define('DB_NAME', 'unionauto_db');

// Имя пользователя MySQL (обычно 'root' для локальной разработки)
define('DB_USER', 'root');

// Пароль MySQL (оставьте пустым '', если пароль не установлен)
define('DB_PASS', '');

// Порт MySQL (по умолчанию 3306, укажите если используете другой)
define('DB_PORT', '3306');

// Кодировка
define('DB_CHARSET', 'utf8mb4');

/**
 * Класс для работы с базой данных
 */
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            // Формируем DSN строку подключения
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 5, // Таймаут подключения 5 секунд
            ];
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Более подробное сообщение об ошибке
            $errorMsg = "Ошибка подключения к базе данных:\n\n";
            $errorMsg .= "Хост: " . DB_HOST . "\n";
            $errorMsg .= "База данных: " . DB_NAME . "\n";
            $errorMsg .= "Пользователь: " . DB_USER . "\n";
            $errorMsg .= "Ошибка: " . $e->getMessage() . "\n\n";
            $errorMsg .= "Проверьте:\n";
            $errorMsg .= "1. Запущен ли MySQL сервер\n";
            $errorMsg .= "2. Правильность настроек в config.php\n";
            $errorMsg .= "3. Существует ли база данных " . DB_NAME . "\n";
            $errorMsg .= "4. Права доступа пользователя " . DB_USER;
            
            // В режиме разработки показываем подробную ошибку
            if (ini_get('display_errors')) {
                die("<pre style='background:#1a1a1a;color:#f44336;padding:20px;border-radius:5px;'>" . htmlspecialchars($errorMsg) . "</pre>");
            } else {
                die("Ошибка подключения к базе данных. Обратитесь к администратору.");
            }
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    // Предотвращаем клонирование
    private function __clone() {}
    
    // Предотвращаем десериализацию
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

/**
 * Получить подключение к базе данных
 */
function getDB() {
    return Database::getInstance()->getConnection();
}

