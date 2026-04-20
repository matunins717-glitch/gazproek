/**
 * Галерея фотографий автомобиля с модальным окном
 */

(function() {
    'use strict';

    let currentImageIndex = 0;
    let carImages = [];
    const galleryModal = document.getElementById('galleryModal');
    const galleryBackdrop = document.getElementById('galleryBackdrop');
    const galleryClose = document.getElementById('galleryClose');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryMainImage = document.getElementById('galleryMainImage');
    const galleryCurrent = document.getElementById('galleryCurrent');
    const galleryTotal = document.getElementById('galleryTotal');
    const galleryThumbnailsModal = document.getElementById('galleryThumbnailsModal');
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const mainCarImage = document.getElementById('mainCarImage');
    const carThumbnails = document.getElementById('carThumbnails');

    // Инициализация
    init();

    function init() {
        // Загружаем изображения из data-атрибутов или конфигурации
        loadCarImages();
        setupEventListeners();
    }

    /**
     * Загрузка изображений автомобиля
     */
    function loadCarImages() {
        // Получаем изображения из data-атрибута body или конфигурации
        const carId = document.body.getAttribute('data-car-id');
        
        // Конфигурация изображений для каждого автомобиля
        const carImagesConfig = {
            '1': [
                'snapedit_1764070853612.jpeg/1.png',
                'snapedit_1764070853612.jpeg/1.png',
                'snapedit_1764070853612.jpeg/1.png',
                'snapedit_1764070853612.jpeg/1.png'
            ],
            '2': [
                'snapedit_1764070853612.jpeg/2.png',
                'snapedit_1764070853612.jpeg/2.png',
                'snapedit_1764070853612.jpeg/2.png',
                'snapedit_1764070853612.jpeg/2.png'
            ],
            '3': [
                'snapedit_1764070853612.jpeg/3.png',
                'snapedit_1764070853612.jpeg/3.png',
                'snapedit_1764070853612.jpeg/3.png',
                'snapedit_1764070853612.jpeg/3.png'
            ],
            '4': [
                'snapedit_1764070853612.jpeg/4.png',
                'snapedit_1764070853612.jpeg/4.png',
                'snapedit_1764070853612.jpeg/4.png',
                'snapedit_1764070853612.jpeg/4.png'
            ],
            '5': [
                'snapedit_1764070853612.jpeg/5.png',
                'snapedit_1764070853612.jpeg/5.png',
                'snapedit_1764070853612.jpeg/5.png',
                'snapedit_1764070853612.jpeg/5.png'
            ],
            '6': [
                'snapedit_1764070853612.jpeg/6.png',
                'snapedit_1764070853612.jpeg/6.png',
                'snapedit_1764070853612.jpeg/6.png',
                'snapedit_1764070853612.jpeg/6.png'
            ],
            '7': [
                'snapedit_1764070853612.jpeg/7.png',
                'snapedit_1764070853612.jpeg/7.png',
                'snapedit_1764070853612.jpeg/7.png',
                'snapedit_1764070853612.jpeg/7.png'
            ],
            '8': [
                'img/snapedit_1732210627151.png',
                'img/snapedit_1732210627151.png',
                'img/snapedit_1732210627151.png',
                'img/snapedit_1732210627151.png'
            ]
        };

        // Получаем изображения из конфигурации или data-атрибута
        if (document.body.hasAttribute('data-car-images')) {
            carImages = JSON.parse(document.body.getAttribute('data-car-images'));
        } else if (carId && carImagesConfig[carId]) {
            carImages = carImagesConfig[carId];
        } else {
            // По умолчанию используем первое изображение несколько раз
            const defaultImage = mainCarImage ? mainCarImage.src : 'img/default-car.jpg';
            carImages = [defaultImage, defaultImage, defaultImage, defaultImage];
        }

        // Инициализируем галерею
        if (carImages.length > 0) {
            renderThumbnails();
            renderModalThumbnails();
            updateMainImage(0);
            galleryTotal.textContent = carImages.length;
        }
    }

    /**
     * Рендеринг миниатюр
     */
    function renderThumbnails() {
        if (!carThumbnails) return;

        carThumbnails.innerHTML = '';
        carImages.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail-item' + (index === 0 ? ' active' : '');
            thumbnail.setAttribute('data-index', index);
            
            const img = document.createElement('img');
            img.src = image;
            img.alt = `Фото ${index + 1}`;
            img.loading = 'lazy';
            
            thumbnail.appendChild(img);
            thumbnail.addEventListener('click', () => {
                updateMainImage(index);
                updateThumbnailActive(index);
            });
            
            carThumbnails.appendChild(thumbnail);
        });
    }

    /**
     * Рендеринг миниатюр для модального окна
     */
    function renderModalThumbnails() {
        if (!galleryThumbnailsModal) return;

        galleryThumbnailsModal.innerHTML = '';
        carImages.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail-modal-item' + (index === 0 ? ' active' : '');
            thumbnail.setAttribute('data-index', index);
            
            const img = document.createElement('img');
            img.src = image;
            img.alt = `Фото ${index + 1}`;
            
            thumbnail.appendChild(img);
            thumbnail.addEventListener('click', () => {
                showImage(index);
            });
            
            galleryThumbnailsModal.appendChild(thumbnail);
        });
    }

    /**
     * Обновление главного изображения
     */
    function updateMainImage(index) {
        if (index < 0 || index >= carImages.length) return;
        
        currentImageIndex = index;
        
        if (mainCarImage) {
            mainCarImage.src = carImages[index];
        }
        
        updateThumbnailActive(index);
    }

    /**
     * Обновление активной миниатюры
     */
    function updateThumbnailActive(index) {
        // Обновляем миниатюры на странице
        const thumbnails = carThumbnails.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Обновляем миниатюры в модальном окне
        const modalThumbnails = galleryThumbnailsModal.querySelectorAll('.thumbnail-modal-item');
        modalThumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    /**
     * Показать изображение в модальном окне
     */
    function showImage(index) {
        if (index < 0 || index >= carImages.length) return;
        
        currentImageIndex = index;
        galleryMainImage.src = carImages[index];
        galleryCurrent.textContent = index + 1;
        updateThumbnailActive(index);
        
        // Прокручиваем миниатюру в видимую область
        const activeThumb = galleryThumbnailsModal.querySelector(`[data-index="${index}"]`);
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    /**
     * Открыть модальное окно
     */
    function openGallery() {
        if (!galleryModal) return;
        
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showImage(currentImageIndex);
    }

    /**
     * Закрыть модальное окно
     */
    function closeGallery() {
        if (!galleryModal) return;
        
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Следующее изображение
     */
    function nextImage() {
        const nextIndex = (currentImageIndex + 1) % carImages.length;
        showImage(nextIndex);
    }

    /**
     * Предыдущее изображение
     */
    function prevImage() {
        const prevIndex = (currentImageIndex - 1 + carImages.length) % carImages.length;
        showImage(prevIndex);
    }

    /**
     * Настройка обработчиков событий
     */
    function setupEventListeners() {
        // Открытие галереи
        if (openGalleryBtn) {
            openGalleryBtn.addEventListener('click', openGallery);
        }

        if (mainCarImage) {
            mainCarImage.addEventListener('click', openGallery);
        }

        // Закрытие галереи
        if (galleryClose) {
            galleryClose.addEventListener('click', closeGallery);
        }

        if (galleryBackdrop) {
            galleryBackdrop.addEventListener('click', closeGallery);
        }

        // Навигация
        if (galleryNext) {
            galleryNext.addEventListener('click', nextImage);
        }

        if (galleryPrev) {
            galleryPrev.addEventListener('click', prevImage);
        }

        // Клавиатура
        document.addEventListener('keydown', (e) => {
            if (!galleryModal || !galleryModal.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeGallery();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        });

        // Свайпы для мобильных устройств
        let touchStartX = 0;
        let touchEndX = 0;

        if (galleryMainImage) {
            galleryMainImage.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            galleryMainImage.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        }
    }

    // Экспорт функций для использования в других скриптах
    window.carGallery = {
        open: openGallery,
        close: closeGallery,
        next: nextImage,
        prev: prevImage,
        show: showImage,
        setImages: function(images) {
            carImages = images;
            renderThumbnails();
            renderModalThumbnails();
            updateMainImage(0);
            galleryTotal.textContent = carImages.length;
        }
    };

})();

