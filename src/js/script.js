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
        delay: 6000, // Tiempo en ms entre cada cambio de diapositiva
        disableOnInteraction: false, // No desactivar el autoplay si el usuario interactúa
      },
    });
  });
  

  const checkbox = document.getElementById('checkbox');
  checkbox.addEventListener('change', () => {
    document.body.classList.toggle('noche');
  });
  