/* ============================================================
   NATURALI – skin_care.js  (Skin Care Page)
   ============================================================ */
(function () {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────── */
  var navbar        = document.getElementById('scNavbar');
  var hamburger     = document.getElementById('scHamburger');
  var navLinks      = document.getElementById('scNavLinks');
  var navClose      = document.getElementById('scNavClose');
  var navOverlay    = document.getElementById('scNavOverlay');
  var searchToggle  = document.getElementById('scSearchToggle');
  var searchBar     = document.getElementById('scSearchBar');
  var searchClose   = document.getElementById('scSearchClose');
  var searchInput   = document.getElementById('scSearchInput');
  var heroSlider    = document.getElementById('scHeroSlider');
  var scrollTopBtn  = document.getElementById('scScrollTopBtn');
  var slides        = Array.from(document.querySelectorAll('.sc-slide'));
  var dots          = Array.from(document.querySelectorAll('.sc-dot'));
  var dropItems     = Array.from(document.querySelectorAll('.sc-nav-item.sc-has-dropdown'));

  /* ── State ────────────────────────────────────────────── */
  var current    = 0;
  var autoTimer  = null;
  var INTERVAL   = 5000;
  var cartTotal  = 0;

  /* ================================================================
     1. NAVBAR SCROLL SHADOW
  ================================================================ */
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('sc-scrolled', window.scrollY > 4);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('sc-visible', window.scrollY > 300);
  }, { passive: true });

  /* ================================================================
     2. MOBILE NAV
  ================================================================ */
  function openNav() {
    if (!navLinks || !hamburger || !navOverlay) return;
    navLinks.classList.add('sc-open');
    hamburger.classList.add('sc-active');
    navOverlay.classList.add('sc-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!navLinks || !hamburger || !navOverlay) return;
    navLinks.classList.remove('sc-open');
    hamburger.classList.remove('sc-active');
    navOverlay.classList.remove('sc-visible');
    document.body.style.overflow = '';
    dropItems.forEach(function (item) { item.classList.remove('sc-open'); });
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
    var trigger = item.querySelector('.sc-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = item.classList.contains('sc-open');
        dropItems.forEach(function (d) { if (d !== item) d.classList.remove('sc-open'); });
        item.classList.toggle('sc-open', !isOpen);
      }
    });
  });

  /* ================================================================
     4. SEARCH BAR
  ================================================================ */
  function openSearch() {
    if (!searchBar || !searchInput) return;
    searchBar.classList.add('sc-open');
    setTimeout(function () { searchInput.focus(); }, 260);
  }

  function closeSearch() {
    if (!searchBar || !searchInput) return;
    searchBar.classList.remove('sc-open');
    searchInput.value = '';
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      searchBar && searchBar.classList.contains('sc-open') ? closeSearch() : openSearch();
    });
  }
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = searchInput.value.trim();
        if (q) { console.log('[Naturali SC] Search:', q); closeSearch(); }
      }
    });
  }

  /* ================================================================
     5. HERO SLIDER
  ================================================================ */
  function goTo(index) {
    if (!slides.length) return;
    slides[current].classList.remove('sc-active');
    dots[current] && dots[current].classList.remove('sc-dot-active');
    current = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('sc-active');
    dots[current] && dots[current].classList.add('sc-dot-active');
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
  window.scUpdateCartCount = function (n) {
    var badge = document.getElementById('scCartCount');
    if (!badge) return;
    badge.textContent = n > 0 ? (n > 99 ? '99+' : n) : '';
    badge.classList.toggle('sc-show', n > 0);
  };
  window.scUpdateCartCount(0);

  /* ================================================================
     8. PRODUCTS — QUANTITY CONTROLS
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.sc-qty-btn');
    if (!btn) return;

    var control = btn.closest('.sc-qty-control');
    if (!control) return;

    var valEl  = control.querySelector('.sc-qty-val');
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
    var btn = e.target.closest('.sc-add-to-cart-btn');
    if (!btn) return;

    var card    = btn.closest('.sc-prod-card');
    var nameEl  = card ? card.querySelector('.sc-prod-name') : null;
    var name    = nameEl ? nameEl.textContent.trim() : 'Product';
    var qtyEl   = card ? card.querySelector('.sc-qty-val') : null;
    var qty     = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

    var orig    = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.classList.add('sc-added');
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('sc-added');
      btn.disabled = false;
    }, 1500);

    cartTotal += qty;
    window.scUpdateCartCount(cartTotal);
    console.log('[Naturali SC] Added to cart:', name, '× ' + qty);
  });

  /* ================================================================
     10. NEW LAUNCHES — QUANTITY CONTROLS
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.sc-nl-qty-btn');
    if (!btn) return;

    var control = btn.closest('.sc-nl-qty-control');
    if (!control) return;

    var valEl  = control.querySelector('.sc-nl-qty-val');
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
    var btn = e.target.closest('.sc-nl-add-btn');
    if (!btn) return;

    var card   = btn.closest('.sc-nl-card');
    var nameEl = card ? card.querySelector('.sc-nl-name') : null;
    var name   = nameEl ? nameEl.textContent.trim() : 'Product';
    var qtyEl  = card ? card.querySelector('.sc-nl-qty-val') : null;
    var qty    = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

    var orig   = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.classList.add('sc-added');
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('sc-added');
      btn.disabled = false;
    }, 1500);

    cartTotal += qty;
    window.scUpdateCartCount(cartTotal);
    console.log('[Naturali SC] New Launch added to cart:', name, '× ' + qty);
  });

})();