/* ============================================================
   NATURALI – combos.js  (Complete — Navbar + Combos Page)
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
  var filterBtns   = Array.from(document.querySelectorAll('.combo-filter-btn'));
  var comboCards   = Array.from(document.querySelectorAll('.combo-card'));

  /* ── State ────────────────────────────────────────────── */
  var cartTotal = 0;
  var activeFilter = 'all';

  /* ================================================================
     1. NAVBAR SCROLL SHADOW + SCROLL TO TOP VISIBILITY
  ================================================================ */
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 4);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  /* ================================================================
     2. MOBILE NAV — Open / Close
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
     3. DROPDOWNS — Mobile accordion
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
     6. CART BADGE HELPER
  ================================================================ */
  window.updateCartCount = function (n) {
    var badge = document.getElementById('cartCount');
    if (!badge) return;
    badge.textContent = n > 0 ? (n > 99 ? '99+' : n) : '';
    badge.classList.toggle('show', n > 0);
  };
  window.updateCartCount(0);

  /* ================================================================
     7. FILTER BAR — filter combo cards by category
  ================================================================ */
  function applyFilter(filter) {
    activeFilter = filter;

    // Update active button state
    filterBtns.forEach(function (btn) {
      btn.classList.toggle('active-filter', btn.getAttribute('data-filter') === filter);
    });

    // Show/hide cards
    comboCards.forEach(function (card) {
      if (filter === 'all') {
        card.classList.remove('hidden');
        return;
      }
      var categories = (card.getAttribute('data-category') || '').split(' ');
      var matches = categories.indexOf(filter) !== -1;
      card.classList.toggle('hidden', !matches);
    });

    // After filter, check if any section has all cards hidden — hide the section header too
    var sections = Array.from(document.querySelectorAll('.combo-section'));
    sections.forEach(function (section) {
      var cards = Array.from(section.querySelectorAll('.combo-card'));
      var allHidden = cards.length > 0 && cards.every(function (c) { return c.classList.contains('hidden'); });
      section.style.display = allHidden ? 'none' : '';
    });

    // Handle complete section separately (no data-category filtering there)
    var completeSection = document.getElementById('complete-combos');
    if (completeSection) {
      if (filter === 'all' || filter === 'complete') {
        completeSection.style.display = '';
      } else {
        completeSection.style.display = 'none';
      }
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      applyFilter(filter);
    });
  });

  /* ================================================================
     8. SMOOTH SCROLL for hero pills (anchor links)
  ================================================================ */
  var pills = Array.from(document.querySelectorAll('.combo-pill[href^="#"]'));
  pills.forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      e.preventDefault();

      // Update active pill
      pills.forEach(function (p) { p.classList.remove('active-pill'); });
      pill.classList.add('active-pill');

      var targetId = pill.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        var offset = navbar ? navbar.offsetHeight : 0;
        var filterBar = document.getElementById('comboFilterBar');
        offset += filterBar ? filterBar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }

      // Also update filter bar to match the pill
      var filterMap = {
        'hair-combos':     'hair',
        'skin-combos':     'skin',
        'complete-combos': 'complete'
      };
      var filter = filterMap[targetId];
      if (filter) applyFilter(filter);
    });
  });

  /* ================================================================
     9. COMBO QUANTITY CONTROLS
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.combo-qty-btn');
    if (!btn) return;

    var control = btn.closest('.combo-qty-control');
    if (!control) return;

    var valEl = control.querySelector('.combo-qty-val');
    if (!valEl) return;

    var val    = parseInt(valEl.textContent, 10) || 1;
    var action = btn.getAttribute('data-action');

    if (action === 'plus')  val = val + 1;
    if (action === 'minus') val = Math.max(1, val - 1);

    valEl.textContent = val;
  });

  /* ================================================================
     10. COMBO ADD TO CART
  ================================================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.combo-add-btn');
    if (!btn || btn.disabled) return;

    // Find name — works for both standard card and complete card
    var card       = btn.closest('.combo-card') || btn.closest('.combo-complete-card');
    var nameEl     = card ? (card.querySelector('.combo-name') || card.querySelector('.combo-complete-name')) : null;
    var name       = nameEl ? nameEl.textContent.trim() : 'Combo';
    var qtyEl      = card ? card.querySelector('.combo-qty-val') : null;
    var qty        = qtyEl ? (parseInt(qtyEl.textContent, 10) || 1) : 1;

    var orig = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.classList.add('added');
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('added');
      btn.disabled = false;
    }, 1600);

    cartTotal += qty;
    window.updateCartCount(cartTotal);
    console.log('[Naturali] Combo added to cart:', name, '× ' + qty);
  });

  /* ================================================================
     11. ACTIVE PILL UPDATE ON SCROLL (IntersectionObserver)
  ================================================================ */
  var sectionPillMap = {
    'hair-combos':     '[href="#hair-combos"]',
    'skin-combos':     '[href="#skin-combos"]',
    'complete-combos': '[href="#complete-combos"]'
  };

  if ('IntersectionObserver' in window) {
    var observerOptions = {
      rootMargin: '-30% 0px -60% 0px',
      threshold:  0
    };

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id       = entry.target.id;
          var selector = sectionPillMap[id];
          if (selector) {
            pills.forEach(function (p) { p.classList.remove('active-pill'); });
            var activePill = document.querySelector('.combo-pill' + selector);
            if (activePill) activePill.classList.add('active-pill');
          }
        }
      });
    }, observerOptions);

    Object.keys(sectionPillMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

})();