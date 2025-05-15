import '../assets/sass/main.scss';
import Swiper from 'swiper/bundle';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

// Modo noche con persistencia
document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('checkbox');
  const body = document.body;

  if (localStorage.getItem('mode') === 'noche') {
    body.classList.add('noche');
    checkbox.checked = true;
  }

  checkbox?.addEventListener('change', () => {
    const isDark = checkbox.checked;
    body.classList.toggle('noche', isDark);
    localStorage.setItem('mode', isDark ? 'noche' : 'dia');
  });
});

// Swiper (slider)
document.addEventListener('DOMContentLoaded', () => {
  new Swiper('.swiper-container', {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
  });
});

// GSAP: Animaciones de secciones
document.addEventListener('DOMContentLoaded', () => {
  gsap.from('.experiencia', {
    opacity: 0,
    x: -200,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.educacion', {
    opacity: 0,
    x: 200,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5
  });

  gsap.from('.certificaciones', {
    opacity: 0,
    x: -200,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5
  });

  gsap.from('.reconocimientos', {
    opacity: 0,
    x: -200,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5
  });
});

// GSAP Draggable
let draggableInstances = [];

function createDraggables() {
  draggableInstances = Draggable.create('.draggable', {
    bounds: '.drag-container',
    inertia: true,
    onDrag() {
      this.target.style.zIndex = 4;
    },
    onRelease() {
      this.target.style.zIndex = '';
    },
  });
}

function killDraggables() {
  draggableInstances.forEach(instance => instance.kill());
  draggableInstances = [];
}

function handleResize() {
  const shouldBeDraggable = window.innerWidth >= 768;

  if (shouldBeDraggable && draggableInstances.length === 0) {
    createDraggables();
  } else if (!shouldBeDraggable && draggableInstances.length > 0) {
    killDraggables();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  handleResize();
  window.addEventListener('resize', handleResize);
});
