// ========== MOBILE NAVIGATION ==========
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

// ========== HERO SLIDER ==========
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length) {
  let idx = 0;
  setInterval(() => {
    heroSlides[idx].classList.remove('active');
    idx = (idx + 1) % heroSlides.length;
    heroSlides[idx].classList.add('active');
  }, 2600);
}

// ========== SCROLL ANIMATIONS (Intersection Observer) ==========
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

// ========== FAQ ACCORDION ==========
document.querySelectorAll('.faq-q').forEach((q) => q.addEventListener('click', () => {
  q.closest('.faq-item').classList.toggle('open');
}));

// ========== COOKIE CONSENT BANNER ==========
const cookieBanner = document.querySelector('.cookie-banner');
const cookieBtn = document.querySelector('#accept-cookies');
if (cookieBanner && !localStorage.getItem('che_cookie_accept')) cookieBanner.style.display = 'flex';
if (cookieBtn) cookieBtn.addEventListener('click', () => {
  localStorage.setItem('che_cookie_accept', 'yes');
  cookieBanner.style.display = 'none';
});

// ========== SIMPLE ECOMMERCE CART ==========
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

const momoBtn = document.querySelector('#momo-btn');
if (momoBtn) {
  momoBtn.addEventListener('click', () => {
    const ref = `MOMO-${Date.now().toString().slice(-6)}`;
    const target = document.querySelector('#momo-message');
    if (target) target.textContent = `MoMo prompt generated successfully. Reference: ${ref}.`;
  });
}

// ========== PHOTO ANNOUNCEMENT MODAL ==========
(function() {
  const modal = document.getElementById('announcementModal');
  const closeBtn = document.querySelector('.modal-close');

  // Exit if modal doesn't exist (shouldn't happen)
  if (!modal) return;

  // Function to open modal
  function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // prevent background scrolling
    modal.setAttribute('aria-hidden', 'false');
  }

  // Function to close modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // restore scrolling
    modal.setAttribute('aria-hidden', 'true');
  }

  // Close on × button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });

  // Show modal automatically after 2 seconds, but only once per session
  if (!sessionStorage.getItem('announcementShown')) {
    setTimeout(() => {
      openModal();
      sessionStorage.setItem('announcementShown', 'true');
    }, 2000); // 2 seconds delay – adjust as needed
  }
})();
