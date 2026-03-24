/* ============================================================
   NATURALI – contact.js  (Navbar + Contact Us Page)
   ============================================================ */
(function () {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────── */
  var navbar       = document.getElementById('navbar');
  var hamburger    = document.getElementById('hamburger');
  var navLinks     = document.getElementById('navLinks');
  var navClose     = document.getElementById('navClose');
  var navOverlay   = document.getElementById('navOverlay');
  var searchToggle = document.getElementById('searchToggle');
  var searchBar    = document.getElementById('searchBar');
  var searchClose  = document.getElementById('searchClose');
  var searchInput  = document.getElementById('searchInput');
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  var dropItems    = Array.from(document.querySelectorAll('.nav-item.has-dropdown'));

  /* ── Contact form refs ──────────────────────────────── */
  var ctSubmitBtn = document.getElementById('ctSubmitBtn');
  var ctName      = document.getElementById('ctName');
  var ctEmail     = document.getElementById('ctEmail');
  var ctMessage   = document.getElementById('ctMessage');
  var ctSuccess   = document.getElementById('ctSuccess');
  var ctRemember  = document.getElementById('ctRemember');

  /* ================================================================
     1. NAVBAR SCROLL SHADOW + SCROLL TO TOP visibility
  ================================================================ */
  window.addEventListener('scroll', function () {
    if (navbar)       navbar.classList.toggle('scrolled', window.scrollY > 4);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  /* ================================================================
     2. MOBILE NAV
  ================================================================ */
  function openNav() {
    if (!navLinks || !hamburger || !navOverlay) return;
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    navOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!navLinks || !hamburger || !navOverlay) return;
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    navOverlay.classList.remove('visible');
    document.body.style.overflow = '';
    dropItems.forEach(function (item) { item.classList.remove('open'); });
  }

  if (hamburger)  hamburger.addEventListener('click', openNav);
  if (navClose)   navClose.addEventListener('click', closeNav);
  if (navOverlay) navOverlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeNav(); closeSearch(); }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) closeNav();
  });

  /* ================================================================
     3. DROPDOWNS (mobile accordion)
  ================================================================ */
  dropItems.forEach(function (item) {
    var trigger = item.querySelector('.dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = item.classList.contains('open');
        dropItems.forEach(function (d) { if (d !== item) d.classList.remove('open'); });
        item.classList.toggle('open', !isOpen);
      }
    });
  });

  /* ================================================================
     4. SEARCH BAR
  ================================================================ */
  function openSearch() {
    if (!searchBar || !searchInput) return;
    searchBar.classList.add('open');
    setTimeout(function () { searchInput.focus(); }, 260);
  }

  function closeSearch() {
    if (!searchBar || !searchInput) return;
    searchBar.classList.remove('open');
    searchInput.value = '';
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      searchBar && searchBar.classList.contains('open') ? closeSearch() : openSearch();
    });
  }
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = searchInput.value.trim();
        if (q) { closeSearch(); }
      }
    });
  }

  /* ================================================================
     5. SCROLL TO TOP
  ================================================================ */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================================================================
     6. CART BADGE HELPER
  ================================================================ */
  window.updateCartCount = function (n) {
    var badge = document.getElementById('cartCount');
    if (!badge) return;
    badge.textContent = n > 0 ? (n > 99 ? '99+' : n) : '';
    badge.classList.toggle('show', n > 0);
  };

  var savedCart = parseInt(sessionStorage.getItem('naturali_cart') || '0', 10);
  window.updateCartCount(savedCart);

  /* ================================================================
     7. CONTACT FORM — remember me (pre-fill from localStorage)
  ================================================================ */
  var savedName  = localStorage.getItem('ct_name')  || '';
  var savedEmail = localStorage.getItem('ct_email') || '';

  if (savedName  && ctName)  ctName.value  = savedName;
  if (savedEmail && ctEmail) ctEmail.value = savedEmail;
  if ((savedName || savedEmail) && ctRemember) ctRemember.checked = true;

  /* ================================================================
     8. CONTACT FORM — validation & submission
  ================================================================ */
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function markError(el) {
    el.style.borderColor = '#e05050';
    el.style.boxShadow   = '0 0 0 3px rgba(224,80,80,0.12)';
    el.addEventListener('input', function clearErr() {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
      el.removeEventListener('input', clearErr);
    });
  }

  if (ctSubmitBtn) {
    ctSubmitBtn.addEventListener('click', function () {
      var nameVal    = ctName    ? ctName.value.trim()    : '';
      var emailVal   = ctEmail   ? ctEmail.value.trim()   : '';
      var messageVal = ctMessage ? ctMessage.value.trim() : '';
      var hasError   = false;

      if (!nameVal)                { markError(ctName);    hasError = true; }
      if (!isValidEmail(emailVal)) { markError(ctEmail);   hasError = true; }
      if (!messageVal)             { markError(ctMessage); hasError = true; }

      if (hasError) return;

      /* Save to localStorage if remember-me checked */
      if (ctRemember && ctRemember.checked) {
        localStorage.setItem('ct_name',  nameVal);
        localStorage.setItem('ct_email', emailVal);
      } else {
        localStorage.removeItem('ct_name');
        localStorage.removeItem('ct_email');
      }

      /* Simulate submission — replace with real fetch/API call */
      ctSubmitBtn.textContent = 'Sending…';
      ctSubmitBtn.disabled    = true;

      setTimeout(function () {
        ctSubmitBtn.textContent = 'SUBMIT NOW';
        ctSubmitBtn.disabled    = false;
        if (ctName)    ctName.value    = '';
        if (ctEmail)   ctEmail.value   = '';
        if (ctMessage) ctMessage.value = '';
        if (ctSuccess) ctSuccess.classList.add('show');
        setTimeout(function () {
          if (ctSuccess) ctSuccess.classList.remove('show');
        }, 5000);
      }, 900);
    });
  }

  /* ================================================================
     9. NEWSLETTER SUBSCRIBE (footer)
  ================================================================ */
  var subBtn   = document.querySelector('.footer-subscribe-btn');
  var emailInp = document.querySelector('.footer-email-input');

  if (subBtn && emailInp) {
    subBtn.addEventListener('click', function () {
      var val = emailInp.value.trim();
      if (!val || !val.includes('@')) {
        emailInp.style.borderColor = '#e05050';
        emailInp.focus();
        setTimeout(function () { emailInp.style.borderColor = ''; }, 2000);
        return;
      }
      var orig = subBtn.textContent;
      subBtn.textContent = '✓ SUBSCRIBED';
      subBtn.style.background = '#3a7d6e';
      emailInp.value = '';
      setTimeout(function () {
        subBtn.textContent = orig;
        subBtn.style.background = '';
      }, 2500);
    });
  }

  /* ================================================================
     10. SCROLL-REVEAL (fade-up animation)
  ================================================================ */
  var revealEls = Array.from(document.querySelectorAll('.ct-reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.1) + 's';
      io.observe(el);
    });
  } else {
    /* Fallback for browsers without IntersectionObserver */
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

})();