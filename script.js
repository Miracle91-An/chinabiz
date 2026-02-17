const nav = document.querySelector('.nav-links');
const burger = document.querySelector('.hamburger');
if (burger && nav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
  }));
}

const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length) {
  let idx = 0;
  setInterval(() => {
    heroSlides[idx].classList.remove('active');
    idx = (idx + 1) % heroSlides.length;
    heroSlides[idx].classList.add('active');
  }, 2600);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

document.querySelectorAll('.faq-q').forEach((q) => q.addEventListener('click', () => {
  q.closest('.faq-item').classList.toggle('open');
}));

const cookieBanner = document.querySelector('.cookie-banner');
const cookieBtn = document.querySelector('#accept-cookies');
if (cookieBanner && !localStorage.getItem('che_cookie_accept')) cookieBanner.style.display = 'flex';
if (cookieBtn) cookieBtn.addEventListener('click', () => {
  localStorage.setItem('che_cookie_accept', 'yes');
  cookieBanner.style.display = 'none';
});

const products = [
  { id: 'clothes', name: 'Premium Clothes Bundle', price: 120 },
  { id: 'electronics', name: 'Electronics Pack', price: 350 },
  { id: 'car', name: 'Car Accessories Kit', price: 210 },
  { id: 'wholesale', name: 'Wholesale Goods Set', price: 500 }
];
const cartKey = 'che_cart';
const getCart = () => JSON.parse(localStorage.getItem(cartKey) || '[]');
const setCart = (c) => localStorage.setItem(cartKey, JSON.stringify(c));

function renderCartCount() {
  const count = getCart().reduce((t, i) => t + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach((el) => el.textContent = count);
}

function addToCart(id) {
  const cart = getCart();
  const found = cart.find((i) => i.id === id);
  if (found) found.qty += 1;
  else {
    const p = products.find((x) => x.id === id);
    if (p) cart.push({ ...p, qty: 1 });
  }
  setCart(cart);
  renderCartCount();
}

document.querySelectorAll('[data-add-cart]').forEach((btn) => btn.addEventListener('click', () => {
  addToCart(btn.dataset.addCart);
  btn.textContent = 'Added ✓';
  setTimeout(() => btn.textContent = 'Add to Cart', 900);
}));

const checkoutList = document.querySelector('#checkout-items');
if (checkoutList) {
  const cart = getCart();
  let total = 0;
  checkoutList.innerHTML = cart.length ? '' : '<p>Your cart is empty.</p>';
  cart.forEach((item) => {
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'card';
    row.innerHTML = `<strong>${item.name}</strong><p>Qty: ${item.qty}</p><p>$${item.price * item.qty}</p>`;
    checkoutList.appendChild(row);
  });
  const t = document.querySelector('#cart-total');
  if (t) t.textContent = `$${total}`;
}

const paymentForm = document.querySelector('#payment-form');
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#receipt-email')?.value || 'customer email';
    const receipt = document.querySelector('#receipt-message');
    if (receipt) receipt.textContent = `Payment successful. A receipt has been sent to ${email}.`;
    localStorage.removeItem(cartKey);
    renderCartCount();
  });
}

renderCartCount();
