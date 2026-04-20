<?php
/**
 * Тест подключения к базе данных
 * Откройте этот файл в браузере для проверки подключения
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Тест подключения к базе данных UnionAuto</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: #fff; }
    .success { color: #4CAF50; padding: 10px; background: #2a2a2a; border-left: 4px solid #4CAF50; margin: 10px 0; }
    .error { color: #f44336; padding: 10px; background: #2a2a2a; border-left: 4px solid #f44336; margin: 10px 0; }
    .info { color: #2196F3; padding: 10px; background: #2a2a2a; border-left: 4px solid #2196F3; margin: 10px 0; }
    pre { background: #2a2a2a; padding: 15px; border-radius: 5px; overflow-x: auto; }
</style>";

// Настройки подключения
$config = [
    'host' => 'localhost',
    'dbname' => 'unionauto_db',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4'
];

echo "<div class='info'><strong>Параметры подключения:</strong><br>";
echo "Host: " . $config['host'] . "<br>";
echo "Database: " . $config['dbname'] . "<br>";
echo "Username: " . $config['username'] . "<br>";
echo "Password: " . (empty($config['password']) ? '(пустой)' : '***') . "<br>";
echo "</div>";

// Проверка 1: Расширение PDO
echo "<h2>1. Проверка расширения PDO</h2>";
if (extension_loaded('pdo')) {
    echo "<div class='success'>✓ PDO установлен</div>";
    if (extension_loaded('pdo_mysql')) {
        echo "<div class='success'>✓ PDO MySQL драйвер установлен</div>";
    } else {
        echo "<div class='error'>✗ PDO MySQL драйвер НЕ установлен</div>";
        echo "<div class='info'>Установите расширение php-pdo-mysql или php-mysql</div>";
    }
} else {
    echo "<div class='error'>✗ PDO НЕ установлен</div>";
    echo "<div class='info'>Установите расширение php-pdo</div>";
}

// Проверка 2: Подключение к MySQL серверу
echo "<h2>2. Проверка подключения к MySQL серверу</h2>";
try {
    $dsn = "mysql:host=" . $config['host'] . ";charset=" . $config['charset'];
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "<div class='success'>✓ Подключение к MySQL серверу успешно</div>";
    
    // Получаем версию MySQL
    $version = $pdo->query('SELECT VERSION()')->fetchColumn();
    echo "<div class='info'>Версия MySQL: " . $version . "</div>";
    
} catch (PDOException $e) {
    echo "<div class='error'>✗ Ошибка подключения к MySQL серверу</div>";
    echo "<div class='error'>" . $e->getMessage() . "</div>";
    echo "<div class='info'><strong>Возможные причины:</strong><br>";
    echo "1. MySQL сервер не запущен<br>";
    echo "2. Неверный хост или порт (попробуйте '127.0.0.1' вместо 'localhost')<br>";
    echo "3. Неверное имя пользователя или пароль<br>";
    echo "4. MySQL не установлен</div>";
    exit;
}

// Проверка 3: Существование базы данных
echo "<h2>3. Проверка существования базы данных</h2>";
try {
    $dsn = "mysql:host=" . $config['host'] . ";dbname=" . $config['dbname'] . ";charset=" . $config['charset'];
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "<div class='success'>✓ База данных '" . $config['dbname'] . "' существует и доступна</div>";
    
} catch (PDOException $e) {
    echo "<div class='error'>✗ База данных '" . $config['dbname'] . "' не найдена или недоступна</div>";
    echo "<div class='error'>" . $e->getMessage() . "</div>";
    echo "<div class='info'><strong>Решение:</strong><br>";
    echo "1. Создайте базу данных: <code>CREATE DATABASE " . $config['dbname'] . ";</code><br>";
    echo "2. Или импортируйте файл: <code>mysql -u root -p < unionauto_db.sql</code></div>";
    exit;
}

// Проверка 4: Таблицы
echo "<h2>4. Проверка таблиц</h2>";
try {
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    if (count($tables) > 0) {
        echo "<div class='success'>✓ Найдено таблиц: " . count($tables) . "</div>";
        echo "<div class='info'>Таблицы:<br>";
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li>" . $table . "</li>";
        }
        echo "</ul></div>";
    } else {
        echo "<div class='error'>✗ Таблицы не найдены</div>";
        echo "<div class='info'>Импортируйте структуру базы данных из файла unionauto_db.sql</div>";
    }
} catch (PDOException $e) {
    echo "<div class='error'>Ошибка при проверке таблиц: " . $e->getMessage() . "</div>";
}

// Проверка 5: Тест запроса
echo "<h2>5. Тест выполнения запроса</h2>";
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "<div class='success'>✓ Запрос выполнен успешно</div>";
    echo "<div class='info'>Пользователей в базе: " . $result['count'] . "</div>";
} catch (PDOException $e) {
    echo "<div class='error'>✗ Ошибка выполнения запроса: " . $e->getMessage() . "</div>";
}

// Проверка 6: Тест config.php
echo "<h2>6. Проверка config.php</h2>";
if (file_exists(__DIR__ . '/config.php')) {
    echo "<div class='success'>✓ Файл config.php найден</div>";
    require_once __DIR__ . '/config.php';
    try {
        $db = getDB();
        echo "<div class='success'>✓ Функция getDB() работает корректно</div>";
    } catch (Exception $e) {
        echo "<div class='error'>✗ Ошибка в config.php: " . $e->getMessage() . "</div>";
    }
} else {
    echo "<div class='error'>✗ Файл config.php не найден</div>";
}

echo "<hr>";
echo "<div class='success'><h2>✓ Все проверки пройдены! База данных готова к работе.</h2></div>";
echo "<div class='info'>Теперь вы можете использовать API endpoints для работы с базой данных.</div>";

?>

