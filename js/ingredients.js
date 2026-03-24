/* ============================================================
   NATURALI – ingredients.js  (Ingredients Page)
   ============================================================ */
(function () {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────── */
  var navbar        = document.getElementById('ingNavbar');
  var hamburger     = document.getElementById('ingHamburger');
  var navLinks      = document.getElementById('ingNavLinks');
  var navClose      = document.getElementById('ingNavClose');
  var navOverlay    = document.getElementById('ingNavOverlay');
  var searchToggle  = document.getElementById('ingSearchToggle');
  var searchBar     = document.getElementById('ingSearchBar');
  var searchClose   = document.getElementById('ingSearchClose');
  var searchInput   = document.getElementById('ingSearchInput');
  var heroSlider    = document.getElementById('ingHeroSlider');
  var scrollTopBtn  = document.getElementById('ingScrollTopBtn');
  var slides        = Array.from(document.querySelectorAll('.ing-slide'));
  var dots          = Array.from(document.querySelectorAll('.ing-dot'));
  var dropItems     = Array.from(document.querySelectorAll('.ing-nav-item.ing-has-dropdown'));

  /* ── State ────────────────────────────────────────────── */
  var current    = 0;
  var autoTimer  = null;
  var INTERVAL   = 5000;
  var cartTotal  = 0;

  /* ================================================================
     1. NAVBAR SCROLL SHADOW
  ================================================================ */
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('ing-scrolled', window.scrollY > 4);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('ing-visible', window.scrollY > 300);
  }, { passive: true });

  /* ================================================================
     2. MOBILE NAV
  ================================================================ */
  function openNav() {
    if (!navLinks || !hamburger || !navOverlay) return;
    navLinks.classList.add('ing-open');
    hamburger.classList.add('ing-active');
    navOverlay.classList.add('ing-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!navLinks || !hamburger || !navOverlay) return;
    navLinks.classList.remove('ing-open');
    hamburger.classList.remove('ing-active');
    navOverlay.classList.remove('ing-visible');
    document.body.style.overflow = '';
    dropItems.forEach(function (item) { item.classList.remove('ing-open'); });
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
    var trigger = item.querySelector('.ing-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = item.classList.contains('ing-open');
        dropItems.forEach(function (d) { if (d !== item) d.classList.remove('ing-open'); });
        item.classList.toggle('ing-open', !isOpen);
      }
    });
  });

  /* ================================================================
     4. SEARCH BAR
  ================================================================ */
  function openSearch() {
    if (!searchBar || !searchInput) return;
    searchBar.classList.add('ing-open');
    setTimeout(function () { searchInput.focus(); }, 260);
  }

  function closeSearch() {
    if (!searchBar || !searchInput) return;
    searchBar.classList.remove('ing-open');
    searchInput.value = '';
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      searchBar && searchBar.classList.contains('ing-open') ? closeSearch() : openSearch();
    });
  }
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = searchInput.value.trim();
        if (q) { console.log('[Naturali ING] Search:', q); closeSearch(); }
      }
    });
  }

  /* ================================================================
     5. HERO SLIDER
  ================================================================ */
  function goTo(index) {
    if (!slides.length) return;
    slides[current].classList.remove('ing-active');
    dots[current] && dots[current].classList.remove('ing-dot-active');
    current = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('ing-active');
    dots[current] && dots[current].classList.add('ing-dot-active');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function resetAuto() { stopAuto(); startAuto(); }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.getAttribute('data-index'), 10));
      resetAuto();
    });
  });

  if (heroSlider) {
    var touchX = 0;
    heroSlider.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].screenX;
    }, { passive: true });
    heroSlider.addEventListener('touchend', function (e) {
      var diff = touchX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : goTo(current - 1); resetAuto(); }
    }, { passive: true });
    heroSlider.addEventListener('mouseenter', stopAuto);
    heroSlider.addEventListener('mouseleave', startAuto);
  }

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stopAuto() : startAuto();
  });

  if (slides.length) startAuto();

  /* ================================================================
     6. SCROLL TO TOP
  ================================================================ */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================================================================
     7. CART BADGE HELPER
  ================================================================ */
  window.ingUpdateCartCount = function (n) {
    var badge = document.getElementById('ingCartCount');
    if (!badge) return;
    badge.textContent = n > 0 ? (n > 99 ? '99+' : n) : '';
    badge.classList.toggle('ing-show', n > 0);
  };
  window.ingUpdateCartCount(0);

  /* ================================================================
     8. PRODUCTS — QUANTITY CONTROLS
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.ing-qty-btn');
    if (!btn) return;

    var control = btn.closest('.ing-qty-control');
    if (!control) return;

    var valEl  = control.querySelector('.ing-qty-val');
    if (!valEl) return;

    var val    = parseInt(valEl.textContent, 10) || 1;
    var action = btn.getAttribute('data-action');

    if (action === 'plus')  val = val + 1;
    if (action === 'minus') val = Math.max(1, val - 1);

    valEl.textContent = val;
  });

  /* ================================================================
     9. PRODUCTS — ADD TO CART
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.ing-add-to-cart-btn');
    if (!btn) return;

    var card    = btn.closest('.ing-prod-card');
    var nameEl  = card ? card.querySelector('.ing-prod-name') : null;
    var name    = nameEl ? nameEl.textContent.trim() : 'Product';
    var qtyEl   = card ? card.querySelector('.ing-qty-val') : null;
    var qty     = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

    var orig    = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.classList.add('ing-added');
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('ing-added');
      btn.disabled = false;
    }, 1500);

    cartTotal += qty;
    window.ingUpdateCartCount(cartTotal);
    console.log('[Naturali ING] Added to cart:', name, '× ' + qty);
  });

  /* ================================================================
     10. NEW LAUNCHES — QUANTITY CONTROLS
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.ing-nl-qty-btn');
    if (!btn) return;

    var control = btn.closest('.ing-nl-qty-control');
    if (!control) return;

    var valEl  = control.querySelector('.ing-nl-qty-val');
    if (!valEl) return;

    var val    = parseInt(valEl.textContent, 10) || 1;
    var action = btn.getAttribute('data-action');

    if (action === 'plus')  val = val + 1;
    if (action === 'minus') val = Math.max(1, val - 1);

    valEl.textContent = val;
  });

  /* ================================================================
     11. NEW LAUNCHES — ADD TO CART
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.ing-nl-add-btn');
    if (!btn) return;

    var card   = btn.closest('.ing-nl-card');
    var nameEl = card ? card.querySelector('.ing-nl-name') : null;
    var name   = nameEl ? nameEl.textContent.trim() : 'Product';
    var qtyEl  = card ? card.querySelector('.ing-nl-qty-val') : null;
    var qty    = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

    var orig   = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.classList.add('ing-added');
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('ing-added');
      btn.disabled = false;
    }, 1500);

    cartTotal += qty;
    window.ingUpdateCartCount(cartTotal);
    console.log('[Naturali ING] New Launch added to cart:', name, '× ' + qty);
  });

})();