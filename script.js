// ---------- Запасной фон, если картинка не загрузилась ----------
function imgFallback(img) {
  img.style.background = 'linear-gradient(135deg, #d9b38c, #6f4e37)';
  img.style.minHeight = '200px';
  img.removeAttribute('src');
}

// ---------- Прелоадер ----------
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => preloader.classList.add('done'), 600);
});

// ---------- Полоса прокрутки и кнопка наверх ----------
const progressBar = document.getElementById('progress');
const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / scrollable) * 100 + '%';
  toTop.classList.toggle('show', window.scrollY > 500);
});

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- Бургер-меню ----------
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
  })
);

// ---------- Появление карточек при прокрутке ----------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---------- Анимированные цифры ----------
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const num = entry.target;
    const target = +num.dataset.target;
    let current = 0;
    const step = Math.max(1, Math.round(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      num.textContent = current;
    }, 25);
    statObserver.unobserve(num);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ---------- Слайдер отзывов ----------
const track = document.getElementById('reviewTrack');
const dotsBox = document.getElementById('reviewDots');
const slidesCount = track.children.length;
let slideIndex = 0;

for (let i = 0; i < slidesCount; i++) {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsBox.appendChild(dot);
}

function goToSlide(i) {
  slideIndex = i;
  track.style.transform = 'translateX(-' + i * 100 + '%)';
  dotsBox.querySelectorAll('span').forEach((d, n) =>
    d.classList.toggle('active', n === i)
  );
}

setInterval(() => {
  goToSlide((slideIndex + 1) % slidesCount);
}, 5000);

// ---------- Маска телефона ----------
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', () => {
  let digits = phoneInput.value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (digits && !digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);

  let result = '';
  if (digits.length) result = '+7';
  if (digits.length > 1) result += ' (' + digits.slice(1, 4);
  if (digits.length >= 5) result += ') ' + digits.slice(4, 7);
  if (digits.length >= 8) result += '-' + digits.slice(7, 9);
  if (digits.length >= 10) result += '-' + digits.slice(9, 11);

  phoneInput.value = result;
});

// ---------- Отправка формы ----------
const form = document.getElementById('bookingForm');
const formError = document.getElementById('formError');
const success = document.getElementById('bookingSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = phoneInput.value.replace(/\D/g, '');
  const datetime = form.datetime.value;

  const valid = name.length >= 2 && phone.length === 11 && datetime !== '';
  formError.hidden = valid;

  if (!valid) return;

  form.hidden = true;
  success.hidden = false;
});
