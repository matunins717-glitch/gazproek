// Contact page specific JavaScript

// Phone mask
(function() {
    'use strict';
    
    const phoneInput = document.getElementById('contactPhone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = '7' + value.substring(1);
            } else {
                value = '7' + value;
            }
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.substring(1, 4);
            }
            if (value.length >= 4) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 7) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 9) {
                formatted += '-' + value.substring(9, 11);
            }
            e.target.value = formatted;
        }
    });
})();

// Form handling
(function() {
    'use strict';
    
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#E10600';
        });
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Имитация отправки
        setTimeout(() => {
            alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }, 1000);
    });
})();

// Social links hover effects
(function() {
    'use strict';
    
    const socialLinks = document.querySelectorAll('.contact-info a[aria-label]');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(225, 6, 0, 0.2)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.05)';
        });
    });
})();

