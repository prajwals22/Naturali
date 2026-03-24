/* ============================================================
   NATURALI – terms.js  (Navbar + Terms of Service Page)
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
     7. NEWSLETTER SUBSCRIBE (footer)
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
     8. SCROLL-REVEAL (fade-up animation)
  ================================================================ */
  var revealEls = Array.from(document.querySelectorAll('.tos-reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.1) + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

})();