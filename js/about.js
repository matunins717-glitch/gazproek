// About page specific JavaScript

// CTA button hover effects
(function() {
    'use strict';
    
    const ctaButtons = document.querySelectorAll('.about-cta a');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
})();

