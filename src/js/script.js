import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import '@fortawesome/fontawesome-free/css/regular.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../assets/sass/main.scss';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { initI18n, getHeroStrings, markHeroAnimationDone, t } from './i18n';

gsap.registerPlugin(TextPlugin);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Dark mode ───────────────────────────────────────────────
function initDarkMode() {
  const checkbox = document.getElementById('checkbox');
  const body = document.body;
  const stored = localStorage.getItem('mode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored === 'noche' || (stored !== 'dia' && prefersDark);

  body.classList.toggle('noche', isDark);
  if (checkbox) checkbox.checked = isDark;

  checkbox?.addEventListener('change', () => {
    const nextDark = checkbox.checked;
    body.classList.toggle('noche', nextDark);
    localStorage.setItem('mode', nextDark ? 'noche' : 'dia');
  });
}

// ─── Hero typewriter (GSAP TextPlugin) ───────────────────────
function initHeroAnimation() {
  const nameEl = document.querySelector('.hero__name');
  const roleEl = document.querySelector('.hero__role');
  const cursorEl = document.querySelector('.hero__cursor');

  if (!nameEl || !roleEl) return;

  const { name: fullName, role: fullRole } = getHeroStrings();

  if (prefersReducedMotion) {
    nameEl.textContent = fullName;
    roleEl.textContent = fullRole;
    cursorEl?.classList.add('is-hidden');
    markHeroAnimationDone();
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    onComplete: markHeroAnimationDone,
  });

  tl.to(nameEl, {
    duration: 1.8,
    text: fullName,
  })
    .to({}, { duration: 0.3 })
    .to(roleEl, {
      duration: 1.4,
      text: fullRole,
    });
}

function closeMobileMenu(toggle, menu) {
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', t('nav.openMenu'));
  menu?.classList.remove('is-open');
}

// ─── Navigation ──────────────────────────────────────────────
function initNavigation() {
  const toggle = document.querySelector('.site-nav__toggle');
  const menu = document.querySelector('.site-nav__menu');
  const links = document.querySelectorAll('.site-nav__menu a');
  const sections = document.querySelectorAll('section[id]');

  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', t(isOpen ? 'nav.openMenu' : 'nav.closeMenu'));
    menu?.classList.toggle('is-open', !isOpen);
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu(toggle, menu);
    });
  });

  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
      history.replaceState(null, '', '#top');
    });
  });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            links.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

// ─── Case study accordions ───────────────────────────────────
function initCaseStudies() {
  const cases = document.querySelectorAll('.case');

  cases.forEach((caseEl) => {
    const trigger = caseEl.querySelector('.case__trigger');
    const panel = caseEl.querySelector('.case__panel');
    const caseId = caseEl.getAttribute('data-case-id');

    if (!trigger || !panel) return;

    if (caseId) {
      panel.id = `case-panel-${caseId}`;
      trigger.setAttribute('aria-controls', panel.id);
    }

    trigger.addEventListener('click', () => {
      const isOpen = caseEl.classList.contains('is-open');

      caseEl.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));

      if (!isOpen) {
        panel.removeAttribute('hidden');
        if (!prefersReducedMotion) {
          gsap.from(panel, { opacity: 0, y: 8, duration: 0.35, ease: 'power2.out' });
        }
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  });
}

// ─── Case filters ────────────────────────────────────────────
function initCaseFilters() {
  const filters = document.querySelectorAll('.case-filter');
  const cases = document.querySelectorAll('.case');

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const value = filter.getAttribute('data-filter');

      filters.forEach((f) => {
        f.classList.toggle('is-active', f === filter);
        f.setAttribute('aria-pressed', String(f === filter));
      });

      cases.forEach((caseEl) => {
        const categories = (caseEl.getAttribute('data-category') || '').split(' ');
        const show = value === 'all' || categories.includes(value);
        caseEl.classList.toggle('is-hidden', !show);
      });
    });
  });
}

// ─── Scroll-to-top ───────────────────────────────────────────
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });
}

// ─── Testimonials swiper ─────────────────────────────────────
function equalizeTestimonialHeights(swiperEl) {
  const cards = swiperEl.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .testimonial');
  if (!cards.length) return;

  swiperEl.querySelectorAll('.testimonial').forEach((card) => {
    card.style.minHeight = '';
  });

  let maxHeight = 0;
  cards.forEach((card) => {
    maxHeight = Math.max(maxHeight, card.offsetHeight);
  });

  swiperEl.querySelectorAll('.testimonial').forEach((card) => {
    card.style.minHeight = `${maxHeight}px`;
  });
}

function initTestimonials() {
  const el = document.querySelector('.testimonials-swiper');
  if (!el) return;

  const swiper = new Swiper('.testimonials-swiper', {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoHeight: false,
    autoplay: prefersReducedMotion ? false : { delay: 8000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 1 },
    },
    on: {
      init(swiperInstance) {
        equalizeTestimonialHeights(swiperInstance.el);
      },
    },
  });

  let resizeTimer;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => equalizeTestimonialHeights(el), 150);
    },
    { passive: true }
  );

  document.addEventListener('languagechange', () => {
    equalizeTestimonialHeights(el);
  });

  return swiper;
}

// ─── Section fade-in on scroll ───────────────────────────────
function initScrollReveal() {
  if (prefersReducedMotion) return;

  const targets = document.querySelectorAll('.section, .contact-sticky, .hero__actions, .hero__tags');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(entry.target, {
              opacity: 0,
              y: 24,
              duration: 0.6,
              ease: 'power2.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
  }
}

// ─── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initDarkMode();
  initHeroAnimation();
  initNavigation();
  initCaseStudies();
  initCaseFilters();
  initScrollTop();
  initTestimonials();
  initScrollReveal();
});
