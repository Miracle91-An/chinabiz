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
}, { threshold: 0.2 });

document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

const cookieBanner = document.querySelector('.cookie-banner');
const cookieBtn = document.querySelector('#accept-cookies');
if (cookieBanner && !localStorage.getItem('che_cookie_accept')) cookieBanner.style.display = 'flex';
if (cookieBtn) cookieBtn.addEventListener('click', () => {
  localStorage.setItem('che_cookie_accept', 'yes');
  cookieBanner.style.display = 'none';
});

const chatFab = document.querySelector('.chat-fab');
const chatWin = document.querySelector('.chat-window');
const chatInput = document.querySelector('#chat-input');
const chatSend = document.querySelector('#chat-send');
const chatBody = document.querySelector('.chat-body');
const faq = {
  visa: 'We provide complete China Visa Services, including document review and embassy guidance.',
  import: 'Our Import from China service covers sourcing, supplier verification, shipping, and customs support.',
  canton: 'For Canton Fair Assistance, we help with registration, visa, hotel booking, translation, and sourcing planning.'
};

if (chatFab && chatWin) {
  chatFab.addEventListener('click', () => {
    chatWin.style.display = chatWin.style.display === 'block' ? 'none' : 'block';
  });
}

function appendMsg(text, type = 'bot') {
  if (!chatBody) return;
  const d = document.createElement('div');
  d.className = `chat-msg ${type}`;
  d.textContent = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}

if (chatSend && chatInput) {
  chatSend.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMsg(text, 'user');
    const key = Object.keys(faq).find((k) => text.toLowerCase().includes(k));
    appendMsg(key ? faq[key] : 'Thanks for your message. Our team will contact you soon for tailored support.');
    chatInput.value = '';
  });
}

const products = [
  { id: 'clothes', name: 'Premium Clothes Bundle', price: 120 },
  { id: 'electronics', name: 'Electronics Pack', price: 350 },
  { id: 'car', name: 'Car Accessories Kit', price: 210 },
  { id: 'wholesale', name: 'Wholesale Goods Set', price: 500 }
];
const cartKey = 'che_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || '[]');
}
function setCart(c) {
  localStorage.setItem(cartKey, JSON.stringify(c));
}
function renderCartCount() {
  const countEl = document.querySelectorAll('.cart-count');
  const count = getCart().reduce((t, i) => t + i.qty, 0);
  countEl.forEach((el) => { el.textContent = count; });
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
  setTimeout(() => { btn.textContent = 'Add to Cart'; }, 900);
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

const tipBtn = document.querySelector('#tip-btn');
if (tipBtn) {
  tipBtn.addEventListener('click', () => {
    alert('Thank you for your support! Payment integration placeholder connected.');
  });
}

renderCartCount();
