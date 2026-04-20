# Настройка подключения к базе данных

## 🔧 Быстрая настройка

### Шаг 1: Проверка подключения

Откройте в браузере файл:
```
http://localhost/Автосалон/database/test_connection.php
```

Этот файл проверит:
- ✅ Установлено ли расширение PDO
- ✅ Подключение к MySQL серверу
- ✅ Существование базы данных
- ✅ Наличие таблиц
- ✅ Работоспособность config.php

### Шаг 2: Настройка config.php

Откройте файл `database/config.php` и измените настройки:

```php
// Для XAMPP (обычно пароль пустой)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');

// Для OpenServer (обычно пароль 'root')
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');

// Для MAMP (обычно пароль 'root')
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root');

// Если используете другой порт
define('DB_PORT', '3307'); // вместо 3306
```

## 🐛 Решение проблем

### Проблема 1: "Access denied for user 'root'@'localhost'"

**Решение:**
1. Проверьте пароль MySQL в `config.php`
2. Если забыли пароль, сбросьте его:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY '';
   FLUSH PRIVILEGES;
   ```

### Проблема 2: "Unknown database 'unionauto_db'"

**Решение:**
1. Создайте базу данных:
   ```sql
   CREATE DATABASE unionauto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Или импортируйте SQL файл:
   ```bash
   mysql -u root -p < database/unionauto_db.sql
   ```

### Проблема 3: "Connection refused" или "Can't connect to MySQL server"

**Решение:**
1. Убедитесь, что MySQL сервер запущен:
   - **XAMPP**: Запустите MySQL через панель управления
   - **OpenServer**: Запустите MySQL через меню
   - **MAMP**: Запустите серверы через MAMP
   - **Windows**: Проверьте службу MySQL в "Службы"

2. Попробуйте использовать `127.0.0.1` вместо `localhost`:
   ```php
   define('DB_HOST', '127.0.0.1');
   ```

3. Проверьте порт MySQL (обычно 3306):
   ```php
   define('DB_PORT', '3306');
   ```

### Проблема 4: "PDO extension not loaded"

**Решение:**
1. Откройте `php.ini`
2. Найдите и раскомментируйте:
   ```ini
   extension=pdo_mysql
   extension=mysqli
   ```
3. Перезапустите веб-сервер

### Проблема 5: "Table doesn't exist"

**Решение:**
1. Импортируйте структуру базы данных:
   ```bash
   mysql -u root -p unionauto_db < database/unionauto_db.sql
   ```
2. Или выполните миграцию:
   ```bash
   mysql -u root -p unionauto_db < database/migrations/add_user_profile.sql
   ```

## 📝 Проверка через командную строку

### Windows (CMD):
```cmd
mysql -u root -p
```

### Linux/Mac:
```bash
mysql -u root -p
```

Если подключение успешно, выполните:
```sql
SHOW DATABASES;
USE unionauto_db;
SHOW TABLES;
```

## 🔍 Альтернативные настройки

### Если используете другой хост:
```php
define('DB_HOST', '127.0.0.1'); // вместо localhost
```

### Если используете другой порт:
```php
define('DB_PORT', '3307'); // вместо 3306
```

### Если создали отдельного пользователя:
```php
define('DB_USER', 'unionauto_user');
define('DB_PASS', 'your_password');
```

Создание пользователя:
```sql
CREATE USER 'unionauto_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON unionauto_db.* TO 'unionauto_user'@'localhost';
FLUSH PRIVILEGES;
```

## ✅ Чек-лист проверки

- [ ] MySQL сервер запущен
- [ ] Расширение PDO установлено
- [ ] База данных `unionauto_db` создана
- [ ] Таблицы импортированы
- [ ] Настройки в `config.php` правильные
- [ ] Права доступа к директории `uploads/avatars` настроены
- [ ] Файл `test_connection.php` показывает успешное подключение

## 📞 Дополнительная помощь

Если проблема не решена:

1. Проверьте логи MySQL:
   - Windows: `C:\xampp\mysql\data\*.err`
   - Linux: `/var/log/mysql/error.log`

2. Проверьте логи PHP:
   - Включите отображение ошибок в `php.ini`:
     ```ini
     display_errors = On
     error_reporting = E_ALL
     ```

3. Используйте `test_connection.php` для диагностики

---

**После успешной настройки удалите или защитите файл `test_connection.php`!**

