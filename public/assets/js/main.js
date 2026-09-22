/**
 * VIDRIERÍA DE EMERGENCIA - Scripts Principales
 * JS Puro y Ligero (<15 KB sin comprimir)
 * Cumple con accesibilidad y respeto a prefers-reduced-motion
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  // 1. Inicialización y Animación escalonada del Hero
  function initHeroAnimations() {
    if (prefersReduced || typeof Element.prototype.animate !== 'function') {
      document.documentElement.classList.remove('js-animate');
      return;
    }

    const easeHero = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const easeUI = 'cubic-bezier(0.3, 0.7, 0.55, 1)';

    // 1) Marco de imagen
    const imageFrame = document.querySelector('.hero-stage');
    if (imageFrame) {
      imageFrame.animate(
        [
          { opacity: 0, transform: 'scale(1.028)' },
          { opacity: 1, transform: 'scale(1)' }
        ],
        { duration: 1250, delay: 50, easing: easeHero, fill: 'both' }
      );
    }

    // 2) Logo
    const logo = document.querySelector('.brand-logo-link');
    if (logo) {
      logo.animate(
        [
          { opacity: 0, transform: 'scale(0.9)' },
          { opacity: 1, transform: 'scale(1)' }
        ],
        { duration: 550, delay: 300, easing: easeUI, fill: 'both' }
      );
    }

    // 3) Items de menú y botón Llamar
    const navItems = Array.from(document.querySelectorAll('.main-nav .nav-link, .btn-header-call'));
    navItems.forEach((item, index) => {
      item.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 500, delay: 380 + index * 40, easing: easeUI, fill: 'both' }
      );
    });

    // 4) Líneas del titular
    const heroLines = Array.from(document.querySelectorAll('.hero-line'));
    heroLines.forEach((line, index) => {
      line.animate(
        [
          { transform: 'translateY(105%)' },
          { transform: 'translateY(0)' }
        ],
        { duration: 660, delay: 580 + index * 110, easing: easeHero, fill: 'both' }
      );
    });

    // 5) Párrafo y botones
    const heroLead = document.querySelector('.hero-lead-text');
    const heroActions = document.querySelector('.hero-actions');
    if (heroLead) {
      heroLead.animate(
        [
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 620, delay: 920, easing: easeUI, fill: 'both' }
      );
    }
    if (heroActions) {
      heroActions.animate(
        [
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 620, delay: 980, easing: easeUI, fill: 'both' }
      );
    }

    // 6) Pastillas y botón circular
    const pills = document.querySelector('.hero-pills');
    const circleWa = document.querySelector('.btn-circle-wa');
    if (pills) {
      pills.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 620, delay: 1060, easing: easeUI, fill: 'both' }
      );
    }
    if (circleWa) {
      circleWa.animate(
        [
          { opacity: 0, transform: 'scale(0.85)' },
          { opacity: 1, transform: 'scale(1)' }
        ],
        { duration: 620, delay: 1060, easing: easeUI, fill: 'both' }
      );
    }
  }

  // 2. Efecto 3D Tilt del marco con cursor fino
  function initFrameTilt() {
    if (!isFinePointer || prefersReduced) return;

    const frame = document.querySelector('.glass-image-frame');
    if (!frame) return;

    const stage = document.querySelector('.hero-stage');
    if (!stage) return;

    let rafId = null;

    stage.addEventListener('mousemove', function (e) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        const rect = frame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const rotX = -deltaY * 3.5; // máx 3.5 grados
        const rotY = deltaX * 3.5;

        frame.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      });
    });

    stage.addEventListener('mouseleave', function () {
      if (rafId) cancelAnimationFrame(rafId);
      frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // 3. Encabezado translúcido al hacer scroll
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 30) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 4. Menú móvil accesible
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const mobilePanel = document.querySelector('.mobile-nav-panel');
    if (!toggleBtn || !mobilePanel) return;

    function toggleMenu(forceOpen) {
      const isOpen = forceOpen !== undefined ? forceOpen : mobilePanel.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        mobilePanel.classList.add('open');
      } else {
        mobilePanel.classList.remove('open');
      }
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Cerrar al pulsar un enlace
    const mobileLinks = mobilePanel.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        toggleMenu(false);
      });
    });

    // Cerrar con Escape o clic fuera
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobilePanel.classList.contains('open')) {
        toggleMenu(false);
        toggleBtn.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (mobilePanel.classList.contains('open') && !mobilePanel.contains(e.target) && e.target !== toggleBtn) {
        toggleMenu(false);
      }
    });
  }

  // 5. Formulario de contacto con redirección directa a WhatsApp
  function initContactForm() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('input-nombre');
      const phoneInput = document.getElementById('input-telefono');
      const msgInput = document.getElementById('input-mensaje');

      const nameVal = (nameInput ? nameInput.value : '').trim();
      const phoneVal = (phoneInput ? phoneInput.value : '').trim();
      const msgVal = (msgInput ? msgInput.value : '').trim();

      let hasError = false;

      // Validación simple
      if (!nameVal) {
        showError('error-nombre', true);
        hasError = true;
      } else {
        showError('error-nombre', false);
      }

      if (!phoneVal || phoneVal.length < 8) {
        showError('error-telefono', true);
        hasError = true;
      } else {
        showError('error-telefono', false);
      }

      if (!msgVal) {
        showError('error-mensaje', true);
        hasError = true;
      } else {
        showError('error-mensaje', false);
      }

      if (hasError) return;

      // Armar mensaje WhatsApp
      const waText = `Hola, soy ${nameVal}. Mi teléfono es ${phoneVal}. Necesito: ${msgVal}`;
      const waUrl = `https://wa.me/56937325405?text=${encodeURIComponent(waText)}`;

      // Redirigir a WhatsApp
      window.location.href = waUrl;
    });

    function showError(id, show) {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = show ? 'block' : 'none';
      }
    }
  }

  // 6. Scroll Reveal Observer
  function initScrollReveal() {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // 7. Carrusel interactivo de reseñas en móvil
  function initReviewsCarousel() {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');
    const dots = Array.from(document.querySelectorAll('#reviews-dots .carousel-dot'));

    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.review-glass-card'));
    if (!cards.length) return;

    function getCardWidth() {
      const card = cards[0];
      const gap = 16; // 1rem
      return card ? card.offsetWidth + gap : 300;
    }

    function updateActiveDot(index) {
      dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const width = getCardWidth();
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 10) {
          track.scrollTo({ left: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
        } else {
          track.scrollBy({ left: width, behavior: prefersReduced ? 'auto' : 'smooth' });
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const width = getCardWidth();
        if (track.scrollLeft <= 10) {
          track.scrollTo({ left: track.scrollWidth, behavior: prefersReduced ? 'auto' : 'smooth' });
        } else {
          track.scrollBy({ left: -width, behavior: prefersReduced ? 'auto' : 'smooth' });
        }
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const card = cards[index];
        if (card) {
          track.scrollTo({
            left: card.offsetLeft - track.offsetLeft,
            behavior: prefersReduced ? 'auto' : 'smooth'
          });
          updateActiveDot(index);
        }
      });
    });

    // Detectar scroll para sincronizar los dots
    let scrollTimeout;
    track.addEventListener(
      'scroll',
      () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(() => {
          const scrollPos = track.scrollLeft;
          let activeIndex = 0;
          let minDiff = Infinity;

          cards.forEach((card, i) => {
            const cardLeft = card.offsetLeft - track.offsetLeft;
            const diff = Math.abs(cardLeft - scrollPos);
            if (diff < minDiff) {
              minDiff = diff;
              activeIndex = i;
            }
          });

          updateActiveDot(activeIndex);
        });
      },
      { passive: true }
    );

    // Navegación por teclado (Flechas izquierda/derecha)
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (nextBtn) nextBtn.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (prevBtn) prevBtn.click();
      }
    });
  }

  // Ejecución DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  function onReady() {
    initHeroAnimations();
    initFrameTilt();
    initHeaderScroll();
    initMobileMenu();
    initContactForm();
    initScrollReveal();
    initReviewsCarousel();
  }
})();
