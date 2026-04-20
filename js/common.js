// Common JavaScript for all pages

// Search functionality
(function() {
    'use strict';
    
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.querySelector('.search-close');
    
    if (!searchIcon || !searchOverlay || !searchInput || !searchClose) return;
    
    // Открытие поиска
    searchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.add('active');
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    });
    
    // Закрытие поиска
    searchClose.addEventListener('click', function() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });
    
    // Закрытие по клику вне области поиска
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });
})();

// Mobile burger menu
(function() {
    'use strict';

    const burgerBtn = document.querySelector('.burger-toggle');
    const mainNav = document.querySelector('.main-nav');
    const headerNav = document.querySelector('.header-nav');
    if (!burgerBtn || !mainNav || !headerNav) return;

    function closeMenu() {
        burgerBtn.classList.remove('is-open');
        mainNav.classList.remove('is-open');
        headerNav.classList.remove('menu-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    burgerBtn.addEventListener('click', function() {
        const willOpen = !mainNav.classList.contains('is-open');
        burgerBtn.classList.toggle('is-open', willOpen);
        mainNav.classList.toggle('is-open', willOpen);
        headerNav.classList.toggle('menu-open', willOpen);
        burgerBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        document.body.classList.toggle('menu-open', willOpen);
    });

    mainNav.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) closeMenu();
    });
})();

// Simple chatbot widget
(function() {
    'use strict';

    if (document.querySelector('.chatbot-widget')) return;

    const botHTML = `
        <div class="chatbot-widget" aria-live="polite">
            <button class="chatbot-toggle" type="button" aria-expanded="false" aria-label="Открыть чат-бот">
                <span>Чат</span>
            </button>
            <section class="chatbot-panel" aria-label="Онлайн помощник">
                <header class="chatbot-header">
                    <strong>Помощник ГЗПроект</strong>
                    <button class="chatbot-close" type="button" aria-label="Закрыть чат">×</button>
                </header>
                <div class="chatbot-messages">
                    <div class="chatbot-msg bot">Здравствуйте! Помогу с арендой техники, стоимостью и подачей на объект.</div>
                </div>
                <form class="chatbot-form">
                    <input class="chatbot-input" type="text" placeholder="Напишите вопрос..." maxlength="240" />
                    <button class="chatbot-send" type="submit">Отправить</button>
                </form>
            </section>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', botHTML);

    const widget = document.querySelector('.chatbot-widget');
    const toggle = widget.querySelector('.chatbot-toggle');
    const panel = widget.querySelector('.chatbot-panel');
    const closeBtn = widget.querySelector('.chatbot-close');
    const form = widget.querySelector('.chatbot-form');
    const input = widget.querySelector('.chatbot-input');
    const messages = widget.querySelector('.chatbot-messages');

    function appendMessage(role, text) {
        const msg = document.createElement('div');
        msg.className = `chatbot-msg ${role}`;
        msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function answerFor(text) {
        const q = text.toLowerCase();
        if (q.includes('цена') || q.includes('стоим') || q.includes('сколько')) {
            return 'Стоимость зависит от техники, часов/смен и подачи. Откройте карточку техники и воспользуйтесь калькулятором аренды.';
        }
        if (q.includes('доставка') || q.includes('подач')) {
            return 'Подачу техники согласовываем заранее: адрес, подъезд, время и условия площадки. Оставьте заявку, и менеджер уточнит детали.';
        }
        if (q.includes('документ') || q.includes('договор')) {
            return 'Работаем по договору и предоставляем закрывающие документы. Формат и пакет документов согласуем до выезда.';
        }
        if (q.includes('оператор')) {
            return 'Техника предоставляется с оператором. Время работы фиксируется прозрачно: по часам или сменам.';
        }
        if (q.includes('контакт') || q.includes('телефон')) {
            return 'Связаться можно по телефону +7 (900) 000-00-00 или через форму на странице контактов.';
        }
        return 'Могу подсказать по технике, стоимости, подаче и документам. Напишите, что именно нужно сделать на объекте.';
    }

    function openChat() {
        panel.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        setTimeout(function() { input.focus(); }, 50);
    }

    function closeChat() {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function() {
        if (panel.classList.contains('is-open')) {
            closeChat();
        } else {
            openChat();
        }
    });

    closeBtn.addEventListener('click', closeChat);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = (input.value || '').trim();
        if (!text) return;
        appendMessage('user', text);
        input.value = '';
        setTimeout(function() {
            appendMessage('bot', answerFor(text));
        }, 250);
    });
})();

