// News page specific JavaScript

// News card hover effects
(function() {
    'use strict';
    
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(225, 6, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    const newsLinks = document.querySelectorAll('.news-link');
    newsLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        link.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    });
})();

