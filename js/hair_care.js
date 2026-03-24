/* ============================================================
   NATURALI – hair_care.js  (Hair Care Page)
   ============================================================ */
(function () {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────── */
  var navbar        = document.getElementById('hcNavbar');
  var hamburger     = document.getElementById('hcHamburger');
  var navLinks      = document.getElementById('hcNavLinks');
  var navClose      = document.getElementById('hcNavClose');
  var navOverlay    = document.getElementById('hcNavOverlay');
  var searchToggle  = document.getElementById('hcSearchToggle');
  var searchBar     = document.getElementById('hcSearchBar');
  var searchClose   = document.getElementById('hcSearchClose');
  var searchInput   = document.getElementById('hcSearchInput');
  var heroSlider    = document.getElementById('hcHeroSlider');
  var scrollTopBtn  = document.getElementById('hcScrollTopBtn');
  var slides        = Array.from(document.querySelectorAll('.hc-slide'));
  var dots          = Array.from(document.querySelectorAll('.hc-dot'));
  var dropItems     = Array.from(document.querySelectorAll('.hc-nav-item.hc-has-dropdown'));

  /* ── State ────────────────────────────────────────────── */
  var current    = 0;
  var autoTimer  = null;
  var INTERVAL   = 5000;
  var cartTotal  = 0;

  /* ================================================================
     1. NAVBAR SCROLL SHADOW
  ================================================================ */
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('hc-scrolled', window.scrollY > 4);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('hc-visible', window.scrollY > 300);
  }, { passive: true });

  /* ================================================================
     2. MOBILE NAV
  ================================================================ */
  function openNav() {
    if (!navLinks || !hamburger || !navOverlay) return;
    navLinks.classList.add('hc-open');
    hamburger.classList.add('hc-active');
    navOverlay.classList.add('hc-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!navLinks || !hamburger || !navOverlay) return;
    navLinks.classList.remove('hc-open');
    hamburger.classList.remove('hc-active');
    navOverlay.classList.remove('hc-visible');
    document.body.style.overflow = '';
    dropItems.forEach(function (item) { item.classList.remove('hc-open'); });
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
    var trigger = item.querySelector('.hc-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = item.classList.contains('hc-open');
        dropItems.forEach(function (d) { if (d !== item) d.classList.remove('hc-open'); });
        item.classList.toggle('hc-open', !isOpen);
      }
    });
  });

  /* ================================================================
     4. SEARCH BAR
  ================================================================ */
  function openSearch() {
    if (!searchBar || !searchInput) return;
    searchBar.classList.add('hc-open');
    setTimeout(function () { searchInput.focus(); }, 260);
  }

  function closeSearch() {
    if (!searchBar || !searchInput) return;
    searchBar.classList.remove('hc-open');
    searchInput.value = '';
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      searchBar && searchBar.classList.contains('hc-open') ? closeSearch() : openSearch();
    });
  }
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = searchInput.value.trim();
        if (q) { console.log('[Naturali HC] Search:', q); closeSearch(); }
      }
    });
  }

  /* ================================================================
     5. HERO SLIDER
  ================================================================ */
  function goTo(index) {
    if (!slides.length) return;
    slides[current].classList.remove('hc-active');
    dots[current] && dots[current].classList.remove('hc-dot-active');
    current = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('hc-active');
    dots[current] && dots[current].classList.add('hc-dot-active');
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
  window.hcUpdateCartCount = function (n) {
    var badge = document.getElementById('hcCartCount');
    if (!badge) return;
    badge.textContent = n > 0 ? (n > 99 ? '99+' : n) : '';
    badge.classList.toggle('hc-show', n > 0);
  };
  window.hcUpdateCartCount(0);

  /* ================================================================
     8. PRODUCTS — QUANTITY CONTROLS
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.hc-qty-btn');
    if (!btn) return;

    var control = btn.closest('.hc-qty-control');
    if (!control) return;

    var valEl  = control.querySelector('.hc-qty-val');
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
    var btn = e.target.closest('.hc-add-to-cart-btn');
    if (!btn) return;

    var card    = btn.closest('.hc-prod-card');
    var nameEl  = card ? card.querySelector('.hc-prod-name') : null;
    var name    = nameEl ? nameEl.textContent.trim() : 'Product';
    var qtyEl   = card ? card.querySelector('.hc-qty-val') : null;
    var qty     = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

    var orig    = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.classList.add('hc-added');
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('hc-added');
      btn.disabled = false;
    }, 1500);

    cartTotal += qty;
    window.hcUpdateCartCount(cartTotal);
    console.log('[Naturali HC] Added to cart:', name, '× ' + qty);
  });

  /* ================================================================
     10. NEW LAUNCHES — QUANTITY CONTROLS
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.hc-nl-qty-btn');
    if (!btn) return;

    var control = btn.closest('.hc-nl-qty-control');
    if (!control) return;

    var valEl  = control.querySelector('.hc-nl-qty-val');
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
    var btn = e.target.closest('.hc-nl-add-btn');
    if (!btn) return;

    var card   = btn.closest('.hc-nl-card');
    var nameEl = card ? card.querySelector('.hc-nl-name') : null;
    var name   = nameEl ? nameEl.textContent.trim() : 'Product';
    var qtyEl  = card ? card.querySelector('.hc-nl-qty-val') : null;
    var qty    = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

    var orig   = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.classList.add('hc-added');
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('hc-added');
      btn.disabled = false;
    }, 1500);

    cartTotal += qty;
    window.hcUpdateCartCount(cartTotal);
    console.log('[Naturali HC] New Launch added to cart:', name, '× ' + qty);
  });

})();