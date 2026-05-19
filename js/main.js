// ===================================
// MAIN JAVASCRIPT - China Square
// ===================================

// Toast notification system
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Announcement bar close
document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.querySelector('.announcement-close');
  const bar = document.querySelector('.announcement-bar');
  
  if (closeBtn && bar) {
    closeBtn.addEventListener('click', () => {
      bar.style.display = 'none';
      localStorage.setItem('chinaSquare_announcement_closed', 'true');
    });
    
    // Check if already closed
    if (localStorage.getItem('chinaSquare_announcement_closed') === 'true') {
      bar.style.display = 'none';
    }
  }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileMenuClose && mobileMenu) {
  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Hero Slider
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroPrev = document.querySelector('.hero-nav-btn.prev');
const heroNext = document.querySelector('.hero-nav-btn.next');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  if (heroSlides.length === 0) return;
  
  // Wrap around
  if (index >= heroSlides.length) index = 0;
  if (index < 0) index = heroSlides.length - 1;
  
  // Update slides
  heroSlides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) slide.classList.add('active');
  });
  
  // Update dots
  heroDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  
  currentSlide = index;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

// Auto advance slides
function startSlideShow() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

// Event listeners for slider
if (heroPrev && heroNext) {
  heroPrev.addEventListener('click', () => {
    stopSlideShow();
    prevSlide();
    startSlideShow();
  });
  
  heroNext.addEventListener('click', () => {
    stopSlideShow();
    nextSlide();
    startSlideShow();
  });
}

heroDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    stopSlideShow();
    showSlide(i);
    startSlideShow();
  });
});

startSlideShow();

// Flash countdown timer
const countdownEl = document.getElementById('flash-countdown');
if (countdownEl) {
  function updateCountdown() {
    // Set end time to 4 hours from now (for demo)
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 4);
    
    const now = new Date();
    const diff = endTime - now;
    
    if (diff <= 0) {
      countdownEl.innerHTML = '<span class="countdown-time">Expiré!</span>';
      return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownEl.innerHTML = `
      <span class="countdown-label">Se termine dans :</span>
      <span class="countdown-time">${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</span>
    `;
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Back to top button
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Sticky header on scroll
const header = document.querySelector('.header');
let lastScroll = 0;

if (header) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-slideUp');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.product-card, .category-card, .trust-item').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// Newsletter form
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  
  if (email) {
    showToast('Merci pour votre inscription! 🎉', 'success');
    this.reset();
  }
});

// Quick view modal
document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const card = this.closest('.product-card');
    const title = card.querySelector('.product-title').textContent;
    const price = card.querySelector('.price-new').textContent;
    
    showToast(`Vue rapide: ${title} - ${price}`, 'info');
  });
});

// Cookie consent
document.querySelector('.cookie-consent')?.addEventListener('click', function(e) {
  if (e.target.classList.contains('accept-cookies')) {
    localStorage.setItem('chinaSquare_cookies_accepted', 'true');
    this.classList.remove('show');
  }
});