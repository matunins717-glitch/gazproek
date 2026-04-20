/**
 * Отслеживание просмотров автомобилей
 */

(function() {
    'use strict';

    // Проверяем, есть ли ID автомобиля на странице
    const carId = getCarIdFromPage();

    if (carId) {
        // Проверяем авторизацию и записываем просмотр
        checkAuthAndTrackView(carId);
    }

    /**
     * Получить ID автомобиля со страницы
     */
    function getCarIdFromPage() {
        // Вариант 1: из data-атрибута
        const carElement = document.querySelector('[data-car-id]');
        if (carElement) {
            return carElement.getAttribute('data-car-id');
        }

        // Вариант 2: из URL (например, car.php?id=123)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            return urlParams.get('id');
        }

        // Вариант 3: из data-атрибута body
        const bodyCarId = document.body.getAttribute('data-car-id');
        if (bodyCarId) {
            return bodyCarId;
        }

        return null;
    }

    /**
     * Проверить авторизацию и записать просмотр
     */
    async function checkAuthAndTrackView(carId) {
        try {
            // Определяем путь к API
            const apiBase = window.location.pathname.includes('/index.html') ? 'api/' : '../api/';
            
            // Проверяем авторизацию
            const authResponse = await fetch(apiBase + 'auth.php?action=check');
            const authData = await authResponse.json();

            if (authData.authenticated) {
                // Записываем просмотр
                await trackView(carId);
            }
        } catch (error) {
            console.error('Ошибка отслеживания просмотра:', error);
        }
    }

    /**
     * Записать просмотр автомобиля
     */
    async function trackView(carId) {
        try {
            await fetch(apiBase + 'car_views.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    car_id: parseInt(carId)
                })
            });
        } catch (error) {
            console.error('Ошибка записи просмотра:', error);
        }
    }

})();

