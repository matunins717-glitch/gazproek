# База данных UnionAuto - Инструкция по установке и использованию

## 📋 Содержание

1. [Требования](#требования)
2. [Установка](#установка)
3. [Структура базы данных](#структура-базы-данных)
4. [Подключение к базе данных](#подключение-к-базе-данных)
5. [Основные таблицы](#основные-таблицы)
6. [Примеры использования](#примеры-использования)
7. [Безопасность](#безопасность)
8. [Резервное копирование](#резервное-копирование)

---

## Требования

- **MySQL** версии 5.7+ или **MariaDB** версии 10.2+
- **PHP** версии 7.4+ (для работы с PHP)
- Права на создание баз данных и таблиц

---

## Установка

### Шаг 1: Импорт базы данных

#### Вариант 1: Через командную строку MySQL

```bash
mysql -u root -p < database/unionauto_db.sql
```

#### Вариант 2: Через phpMyAdmin

1. Откройте phpMyAdmin
2. Создайте новую базу данных `unionauto_db` (или используйте существующую)
3. Перейдите на вкладку "Импорт"
4. Выберите файл `database/unionauto_db.sql`
5. Нажмите "Вперед"

#### Вариант 3: Через MySQL Workbench

1. Откройте MySQL Workbench
2. Подключитесь к серверу
3. File → Open SQL Script
4. Выберите `database/unionauto_db.sql`
5. Выполните скрипт (Execute)

### Шаг 2: Настройка подключения

Отредактируйте файл `database/config.php`:

```php
define('DB_HOST', 'localhost');    // Хост базы данных
define('DB_NAME', 'unionauto_db'); // Имя базы данных
define('DB_USER', 'root');         // Имя пользователя
define('DB_PASS', '');             // Пароль
```

### Шаг 3: Проверка подключения

Создайте тестовый файл `test_connection.php`:

```php
<?php
require_once 'database/config.php';

try {
    $db = getDB();
    echo "✅ Подключение к базе данных успешно!";
} catch (Exception $e) {
    echo "❌ Ошибка: " . $e->getMessage();
}
?>
```

---

## Структура базы данных

База данных содержит следующие основные таблицы:

### Основные таблицы

1. **users** - Пользователи системы (администраторы, менеджеры)
2. **cars** - Автомобили в каталоге
3. **car_categories** - Категории автомобилей
4. **car_category_relations** - Связь автомобилей и категорий
5. **news** - Новости и статьи
6. **news_categories** - Категории новостей
7. **news_category_relations** - Связь новостей и категорий
8. **callbacks** - Заявки на обратный звонок
9. **orders** - Заказы автомобилей
10. **testimonials** - Отзывы клиентов
11. **contacts** - Контактная информация
12. **settings** - Настройки сайта
13. **views_stats** - Статистика просмотров

---

## Подключение к базе данных

### PHP (PDO)

```php
<?php
require_once 'database/config.php';

$db = getDB();

// Пример запроса
$stmt = $db->prepare("SELECT * FROM cars WHERE status = 'available'");
$stmt->execute();
$cars = $stmt->fetchAll();

foreach ($cars as $car) {
    echo $car['brand'] . ' ' . $car['model'] . '<br>';
}
?>
```

### Node.js (MySQL2)

```javascript
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'unionauto_db'
});

const [cars] = await connection.execute(
    "SELECT * FROM cars WHERE status = 'available'"
);
```

### Python (PyMySQL)

```python
import pymysql

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    database='unionauto_db',
    charset='utf8mb4'
)

cursor = connection.cursor()
cursor.execute("SELECT * FROM cars WHERE status = 'available'")
cars = cursor.fetchall()
```

---

## Основные таблицы

### Таблица `users`

Пользователи системы (администраторы, менеджеры).

**Основные поля:**
- `id` - Уникальный идентификатор
- `username` - Имя пользователя (уникальное)
- `email` - Email (уникальный)
- `password_hash` - Хеш пароля (bcrypt)
- `role` - Роль: `admin`, `manager`, `user`
- `is_active` - Активен ли пользователь

**Пример использования:**
```sql
-- Получить всех администраторов
SELECT * FROM users WHERE role = 'admin' AND is_active = TRUE;

-- Создать нового пользователя
INSERT INTO users (username, email, password_hash, role) 
VALUES ('manager1', 'manager@unionauto.com', '$2y$10$...', 'manager');
```

### Таблица `cars`

Автомобили в каталоге.

**Основные поля:**
- `id` - Уникальный идентификатор
- `brand` - Марка (Lexus, Mercedes-Benz, и т.д.)
- `model` - Модель
- `year` - Год выпуска
- `price` - Цена
- `status` - Статус: `available`, `sold`, `reserved`
- `condition` - Состояние: `new`, `used`, `demo`
- `features` - JSON с характеристиками
- `specifications` - JSON с техническими характеристиками

**Пример использования:**
```sql
-- Получить все доступные автомобили Lexus
SELECT * FROM cars 
WHERE brand = 'Lexus' 
  AND status = 'available' 
ORDER BY price ASC;

-- Получить автомобили в диапазоне цен
SELECT * FROM cars 
WHERE price BETWEEN 1000000 AND 5000000 
  AND status = 'available';
```

### Таблица `callbacks`

Заявки на обратный звонок.

**Основные поля:**
- `id` - Уникальный идентификатор
- `name` - Имя клиента
- `phone` - Телефон
- `email` - Email
- `car_id` - ID автомобиля (если заявка по конкретному авто)
- `status` - Статус: `new`, `processed`, `completed`, `rejected`

**Пример использования:**
```sql
-- Получить новые заявки
SELECT c.*, cars.brand, cars.model 
FROM callbacks c
LEFT JOIN cars ON c.car_id = cars.id
WHERE c.status = 'new'
ORDER BY c.created_at DESC;

-- Обновить статус заявки
UPDATE callbacks 
SET status = 'processed', contacted_at = NOW() 
WHERE id = 1;
```

### Таблица `orders`

Заказы автомобилей.

**Основные поля:**
- `id` - Уникальный идентификатор
- `order_number` - Номер заказа (уникальный)
- `customer_name` - Имя клиента
- `customer_email` - Email клиента
- `customer_phone` - Телефон клиента
- `car_id` - ID автомобиля
- `total_amount` - Общая сумма
- `payment_status` - Статус оплаты: `pending`, `paid`, `partial`, `refunded`
- `order_status` - Статус заказа: `new`, `processing`, `shipping`, `delivered`, `cancelled`

**Пример использования:**
```sql
-- Получить все заказы с информацией об автомобилях
SELECT o.*, c.brand, c.model, c.price as car_price
FROM orders o
JOIN cars c ON o.car_id = c.id
ORDER BY o.created_at DESC;

-- Получить заказы по статусу оплаты
SELECT * FROM orders WHERE payment_status = 'pending';
```

### Таблица `testimonials`

Отзывы клиентов.

**Основные поля:**
- `id` - Уникальный идентификатор
- `client_name` - Имя клиента
- `client_country` - Страна клиента
- `car_model` - Модель автомобиля
- `rating` - Рейтинг (1-5)
- `testimonial` - Текст отзыва
- `is_approved` - Одобрен ли отзыв

**Пример использования:**
```sql
-- Получить одобренные отзывы
SELECT * FROM testimonials 
WHERE is_approved = TRUE 
ORDER BY created_at DESC;

-- Получить средний рейтинг
SELECT AVG(rating) as avg_rating FROM testimonials WHERE is_approved = TRUE;
```

---

## Примеры использования

### Получить автомобили с фильтрами

```php
<?php
require_once 'database/config.php';

$db = getDB();

// Параметры фильтрации
$brand = $_GET['brand'] ?? null;
$minPrice = $_GET['min_price'] ?? 0;
$maxPrice = $_GET['max_price'] ?? 999999999;
$status = 'available';

$sql = "SELECT * FROM cars WHERE status = :status AND price BETWEEN :min_price AND :max_price";
$params = [
    ':status' => $status,
    ':min_price' => $minPrice,
    ':max_price' => $maxPrice
];

if ($brand) {
    $sql .= " AND brand = :brand";
    $params[':brand'] = $brand;
}

$sql .= " ORDER BY price ASC";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$cars = $stmt->fetchAll();

foreach ($cars as $car) {
    echo $car['brand'] . ' ' . $car['model'] . ' - ' . number_format($car['price']) . ' ' . $car['currency'] . '<br>';
}
?>
```

### Создать заявку

```php
<?php
require_once 'database/config.php';

$db = getDB();

$name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'] ?? null;
$message = $_POST['message'] ?? null;
$carId = $_POST['car_id'] ?? null;

$stmt = $db->prepare("
    INSERT INTO callbacks (name, phone, email, message, car_id) 
    VALUES (:name, :phone, :email, :message, :car_id)
");

$stmt->execute([
    ':name' => $name,
    ':phone' => $phone,
    ':email' => $email,
    ':message' => $message,
    ':car_id' => $carId
]);

echo "Заявка успешно создана!";
?>
```

### Получить новости с категориями

```php
<?php
require_once 'database/config.php';

$db = getDB();

$stmt = $db->prepare("
    SELECT n.*, GROUP_CONCAT(nc.name) as categories
    FROM news n
    LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
    LEFT JOIN news_categories nc ON ncr.category_id = nc.id
    WHERE n.is_published = TRUE
    GROUP BY n.id
    ORDER BY n.published_at DESC
    LIMIT 10
");

$stmt->execute();
$news = $stmt->fetchAll();

foreach ($news as $article) {
    echo "<h2>{$article['title']}</h2>";
    echo "<p>{$article['excerpt']}</p>";
    echo "<p>Категории: {$article['categories']}</p>";
}
?>
```

### Получить статистику

```php
<?php
require_once 'database/config.php';

$db = getDB();

$stats = [];

// Количество автомобилей
$stmt = $db->query("SELECT COUNT(*) as count FROM cars WHERE status = 'available'");
$stats['available_cars'] = $stmt->fetch()['count'];

// Количество новых заявок
$stmt = $db->query("SELECT COUNT(*) as count FROM callbacks WHERE status = 'new'");
$stats['new_callbacks'] = $stmt->fetch()['count'];

// Количество заказов
$stmt = $db->query("SELECT COUNT(*) as count FROM orders");
$stats['total_orders'] = $stmt->fetch()['count'];

// Общая сумма заказов
$stmt = $db->query("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'");
$stats['total_revenue'] = $stmt->fetch()['total'] ?? 0;

print_r($stats);
?>
```

---

## Безопасность

### 1. Хеширование паролей

Всегда используйте хеширование паролей (bcrypt):

```php
// Создание хеша пароля
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Проверка пароля
if (password_verify($inputPassword, $storedHash)) {
    // Пароль верный
}
```

### 2. Подготовленные запросы

Всегда используйте подготовленные запросы для предотвращения SQL-инъекций:

```php
// ❌ НЕПРАВИЛЬНО
$db->query("SELECT * FROM users WHERE email = '$email'");

// ✅ ПРАВИЛЬНО
$stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute([':email' => $email]);
```

### 3. Права доступа

Создайте отдельного пользователя для приложения с ограниченными правами:

```sql
-- Создать пользователя
CREATE USER 'unionauto_app'@'localhost' IDENTIFIED BY 'strong_password';

-- Дать права только на нужную базу данных
GRANT SELECT, INSERT, UPDATE, DELETE ON unionauto_db.* TO 'unionauto_app'@'localhost';

-- Обновить права
FLUSH PRIVILEGES;
```

### 4. Резервное копирование

Регулярно создавайте резервные копии базы данных:

```bash
# Создать резервную копию
mysqldump -u root -p unionauto_db > backup_$(date +%Y%m%d).sql

# Восстановить из резервной копии
mysql -u root -p unionauto_db < backup_20241220.sql
```

---

## Резервное копирование

### Автоматическое резервное копирование (cron)

Создайте скрипт `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DB_NAME="unionauto_db"
DB_USER="root"
DB_PASS="password"
DATE=$(date +%Y%m%d_%H%M%S)

mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Удалить резервные копии старше 30 дней
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

Добавьте в crontab:

```bash
# Резервное копирование каждый день в 2:00
0 2 * * * /path/to/backup.sh
```

---

## Дополнительные ресурсы

- [Документация MySQL](https://dev.mysql.com/doc/)
- [Документация PDO](https://www.php.net/manual/ru/book.pdo.php)
- [Безопасность MySQL](https://dev.mysql.com/doc/refman/8.0/en/security.html)

---

## Поддержка

При возникновении проблем:
1. Проверьте логи MySQL
2. Убедитесь, что все таблицы созданы
3. Проверьте права доступа пользователя базы данных
4. Проверьте настройки подключения в `config.php`

---

**Версия:** 1.0.0  
**Дата обновления:** 2024

