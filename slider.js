(function() {
  'use strict';
  
  const slider = document.querySelector('.slider');
  if (!slider) return;
  
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const slides = Array.from(slider.querySelectorAll('img'));
  const slideCount = slides.length;
  
  if (slideCount === 0) return;
  
  let slideIndex = 0;

  const slide = () => {
    if (!slider) return;
    const imageWidth = slider.clientWidth;
    const slideOffset = -slideIndex * imageWidth;
    slider.style.transform = `translateX(${slideOffset}px)`;
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      slideIndex = (slideIndex - 1 + slideCount) % slideCount;
      slide();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      slideIndex = (slideIndex + 1) % slideCount;
      slide();
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', slide);
  } else {
    slide();
  }
})();