// ================= HAMBURGER MENU =================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ================= SLIDER AUTO-PLAY =================
const slides = document.querySelectorAll('.slide');
let current = 0;

setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
}, 4000);

// ================= QUANTITY CONTROL (Products / Launches) =================
function changeQty(btn, delta) {
    const spanEl = btn.parentElement.querySelector('span');
    let val = parseInt(spanEl.textContent) + delta;
    if (val < 1) val = 1;
    spanEl.textContent = val;
}

// ================= QUANTITY CONTROL (Home Spa) =================
function spaChangeQty(btn, delta) {
    const qtyEl = btn.parentElement.querySelector('.spa-qty-value');
    let val = parseInt(qtyEl.textContent) + delta;
    if (val < 1) val = 1;
    qtyEl.textContent = val;
}

// ================= SCROLL TO TOP =================
const scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});