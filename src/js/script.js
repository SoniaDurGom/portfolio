import '../assets/sass/main.scss'; 
import Swiper from 'swiper/bundle';



const modeToggleButton = document.getElementById('mode-toggle');
const body = document.body;
const header = document.querySelector('header');
const button = document.querySelector('button');


if (localStorage.getItem('mode') === 'noche') {
    body.classList.add('noche');
    header.classList.add('noche');
    button.classList.add('noche');
}

document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.swiper-container', {
      direction: "horizontal",
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
  

  const checkbox = document.getElementById('checkbox');
  checkbox.addEventListener('change', () => {
    document.body.classList.toggle('noche');
  });
  



//!Prueba GSAP
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

let draggableInstances = [];

function createDraggables() {
  draggableInstances = Draggable.create('.draggable', {
    bounds: '.drag-container',
    inertia: true,
    onDrag: function () {
      this.target.style.zIndex = 4;
    },
    onRelease: function () {
      this.target.style.zIndex = '';
    }
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
  // Animaciones de entrada
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

  // Inicializar según tamaño
  handleResize();
  window.addEventListener('resize', handleResize);
});
