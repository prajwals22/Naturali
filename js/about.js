/* ============================================================
   NATURALI – about.js  (Navbar + About Us Page)
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
        if (q) { console.log('[Naturali] Search:', q); closeSearch(); }
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
     6. CART BADGE HELPER  (keeps cart count in sync across pages
        using sessionStorage so it doesn't reset on navigation)
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
     7. NEWSLETTER SUBSCRIBE  (footer)
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
     8. SCROLL-REVEAL  (fade-up animation for about sections)
     Uses IntersectionObserver for smooth entrance animations.
  ================================================================ */
  var revealTargets = Array.from(document.querySelectorAll(
    '.au-pillar-card, .au-story-inner, .au-ingr-inner, ' +
    '.au-intro-inner, .testi-card, .benefit-item'
  ));

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('au-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.55s ease ' + (i % 4 * 0.08) + 's, transform 0.55s ease ' + (i % 4 * 0.08) + 's';
      revealObserver.observe(el);
    });
  }

  /* Add the revealed state via JS (avoids needing a separate CSS class with !important) */
  document.addEventListener('animationend', function () {}, { passive: true }); // noop — keeps lint happy

  /* Trigger revealed class */
  document.addEventListener('scroll', function () {}, { passive: true }); // ensure scroll listener registered

  /* Polyfill fallback — show all if IntersectionObserver not available */
  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* Revealed state applied via inline style update in observer */
  var _origObserver = window.IntersectionObserver;
  // Patch to apply inline style on reveal (observer defined above already does this via classList)
  document.querySelectorAll('.au-pillar-card, .au-story-inner, .au-ingr-inner, .au-intro-inner, .testi-card, .benefit-item').forEach(function (el) {
    el.addEventListener('transitionend', function () {
      if (el.classList.contains('au-revealed')) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  });

  /* Apply revealed styles via MutationObserver watching class changes */
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          var el = m.target;
          if (el.classList.contains('au-revealed')) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }
        }
      });
    });
    revealTargets.forEach(function (el) {
      mo.observe(el, { attributes: true });
    });
  }

})();