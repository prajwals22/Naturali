(function () {
  'use strict';

  /* ============================================================
     NAVBAR
  ============================================================ */
  var navbar      = document.getElementById('navbar');
  var hamburger   = document.getElementById('hamburger');
  var navLinks    = document.getElementById('navLinks');
  var navClose    = document.getElementById('navClose');
  var navOverlay  = document.getElementById('navOverlay');
  var searchToggle= document.getElementById('searchToggle');
  var searchBar   = document.getElementById('searchBar');
  var searchClose = document.getElementById('searchClose');
  var searchInput = document.getElementById('searchInput');
  var scrollTopBtn= document.getElementById('scrollTopBtn');

  // ── Open / close mobile nav ──────────────────────────────
  function openNav() {
    navLinks.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openNav);
  if (navClose)  navClose.addEventListener('click', closeNav);
  if (navOverlay) navOverlay.addEventListener('click', closeNav);

  // ── Mobile dropdown accordion ────────────────────────────
  document.querySelectorAll('.has-dropdown .dropdown-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        var item = this.closest('.nav-item');
        var isOpen = item.classList.contains('open');
        // close all
        document.querySelectorAll('.nav-item.open').forEach(function (el) {
          el.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
      }
    });
  });

  // ── Search bar toggle ────────────────────────────────────
  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      searchBar.classList.toggle('open');
      if (searchBar.classList.contains('open')) {
        searchInput && searchInput.focus();
      }
    });
  }
  if (searchClose) {
    searchClose.addEventListener('click', function () {
      searchBar.classList.remove('open');
      if (searchInput) searchInput.value = '';
    });
  }

  // ── Scroll: sticky shadow + scroll-to-top button ─────────
  window.addEventListener('scroll', function () {
    if (navbar) {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 2px 18px rgba(0,0,0,0.1)'
        : '0 2px 12px rgba(0,0,0,0.06)';
    }
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     FOOTER NEWSLETTER
  ============================================================ */
  var subscribeBtn = document.querySelector('.footer-subscribe-btn');
  var emailInput   = document.querySelector('.footer-email-input');

  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener('click', function () {
      var val = emailInput.value.trim();
      if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        emailInput.style.borderColor = '#e53e3e';
        emailInput.focus();
        return;
      }
      emailInput.style.borderColor = '';
      subscribeBtn.textContent = '✓ Subscribed!';
      subscribeBtn.style.background = '#2d5e2d';
      emailInput.value = '';
      setTimeout(function () {
        subscribeBtn.textContent = 'SUBSCRIBE';
        subscribeBtn.style.background = '';
      }, 3000);
    });
  }

  /* ============================================================
     LOGIN FORM
  ============================================================ */

  // ── Helpers ──────────────────────────────────────────────
  function getEl(id) { return document.getElementById(id); }

  function showError(msg) {
    var err = getEl('errorMsg');
    var wrap = getEl('phoneWrapper');
    if (err)  err.textContent = msg;
    if (wrap) wrap.classList.add('error-border');
  }

  function clearError() {
    var err = getEl('errorMsg');
    var wrap = getEl('phoneWrapper');
    if (err)  err.textContent = '';
    if (wrap) wrap.classList.remove('error-border');
  }

  // ── Validation ───────────────────────────────────────────
  function validate(num) {
    if (!num || num.length === 0) return 'Mobile number is required.';
    if (num.length < 10)          return 'Enter a valid 10-digit mobile number.';
    if (!/^[6-9]\d{9}$/.test(num)) return 'Number must start with 6, 7, 8, or 9.';
    return null;
  }

  // ── Input guards (digits only) ────────────────────────────
  function bindInputGuards(input) {
    if (!input) return;

    input.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
      if (this.value.length > 0) clearError();
    });

    input.addEventListener('keydown', function (e) {
      var safe = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
      if (safe.indexOf(e.key) !== -1 || e.ctrlKey || e.metaKey) return;
      if (!/^\d$/.test(e.key)) e.preventDefault();
    });

    input.addEventListener('paste', function (e) {
      e.preventDefault();
      var pasted = (e.clipboardData || window.clipboardData).getData('text');
      this.value  = pasted.replace(/\D/g, '').slice(0, 10);
      clearError();
    });
  }

  // ── Success screen ────────────────────────────────────────
  function showSuccess(number) {
    var card = document.getElementById('loginCard');
    if (!card) return;
    card.innerHTML =
      '<div class="lp-success">' +
        '<span class="lp-success-icon">✅</span>' +
        '<p>OTP sent to +91 ' + number + '!</p>' +
        '<p class="sub">Please check your mobile for the OTP.</p>' +
      '</div>' +
      '<button class="lp-submit-btn" id="backBtn" style="margin-top:28px;">← Back to Login</button>';

    var backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.addEventListener('click', resetForm);
  }

  // ── Submit handler ────────────────────────────────────────
  function handleSubmit() {
    var input = getEl('mobileInput');
    if (!input) return;
    var num = input.value.trim();
    var err = validate(num);
    if (err) { showError(err); input.focus(); return; }
    clearError();

    var btn = getEl('submitBtn');
    if (btn) {
      btn.textContent = 'Sending OTP…';
      btn.classList.add('loading');
    }

    setTimeout(function () {
      showSuccess(num);
    }, 1500);
  }

  // ── Reset form ────────────────────────────────────────────
  function resetForm() {
    var card = document.getElementById('loginCard');
    if (!card) return;

    card.innerHTML =
      '<h2 class="lp-login-title">Login Now!</h2>' +

      '<div class="lp-phone-wrap" id="phoneWrapper">' +
        '<div class="lp-country">' +
          '<img src="https://flagcdn.com/w40/in.png" alt="India" class="lp-flag" />' +
          '<span class="lp-code">+91</span>' +
        '</div>' +
        '<div class="lp-divider"></div>' +
        '<input type="tel" id="mobileInput" class="lp-phone-input"' +
          ' placeholder="Enter Mobile Number" maxlength="10" inputmode="numeric" />' +
      '</div>' +

      '<p class="lp-error" id="errorMsg"></p>' +

      '<label class="lp-notify">' +
        '<input type="checkbox" id="notifyCheckbox" class="lp-checkbox-input" />' +
        '<span class="lp-checkbox">' +
          '<svg class="lp-check-icon" viewBox="0 0 12 12" fill="none">' +
            '<polyline points="2,6 5,9 10,3" stroke="white" stroke-width="2"' +
              ' stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</span>' +
        '<span class="lp-notify-text">Notify me with offers &amp; updates</span>' +
      '</label>' +

      '<button class="lp-submit-btn" id="submitBtn">Submit</button>' +

      '<p class="lp-privacy">' +
        'I accept that I have read &amp; understood your ' +
        '<a href="#" class="lp-privacy-link">Privacy Policy</a> ' +
        '<a href="#" class="lp-privacy-link">and T&amp;Cs.</a>' +
      '</p>';

    initLoginForm();
  }

  // ── Init login form bindings ──────────────────────────────
  function initLoginForm() {
    var input  = getEl('mobileInput');
    var btn    = getEl('submitBtn');
    bindInputGuards(input);
    if (btn) btn.addEventListener('click', handleSubmit);
  }

  // ── Boot ──────────────────────────────────────────────────
  initLoginForm();

})();