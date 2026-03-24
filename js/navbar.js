
    (function () {
        const hamburger     = document.getElementById('hamburger');
        const navLinks      = document.getElementById('navLinks');
        const hamburgerIcon = hamburger.querySelector('i');

        /* 1 ── Hamburger open / close */
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            hamburgerIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        });

        /* 2 ── Primary dropdown accordion (mobile only) */
        document.querySelectorAll('.has-dropdown > .drop-toggle').forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                if (window.innerWidth > 768) return;
                e.preventDefault();
                e.stopPropagation();

                const parent   = this.closest('.has-dropdown');
                const isOpen   = parent.classList.contains('open');

                /* Close all siblings */
                parent.parentElement
                      .querySelectorAll(':scope > .has-dropdown.open')
                      .forEach(function (sib) {
                          if (sib !== parent) {
                              sib.classList.remove('open');
                              sib.querySelectorAll('.has-submenu.open')
                                 .forEach(function (s) { s.classList.remove('open'); });
                          }
                      });

                parent.classList.toggle('open', !isOpen);
            });
        });

        /* 3 ── Sub-menu accordion (mobile only) */
        document.querySelectorAll('.has-submenu > a').forEach(function (link) {
            link.addEventListener('click', function (e) {
                if (window.innerWidth > 768) return;
                e.preventDefault();
                e.stopPropagation();

                const parent = this.closest('.has-submenu');
                const isOpen = parent.classList.contains('open');

                /* Close all sibling sub-menus */
                parent.parentElement
                      .querySelectorAll(':scope > .has-submenu.open')
                      .forEach(function (sib) {
                          if (sib !== parent) sib.classList.remove('open');
                      });

                parent.classList.toggle('open', !isOpen);
            });
        });

        /* 4 ── Click outside closes everything */
        document.addEventListener('click', function (e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburgerIcon.className = 'fas fa-bars';
                document.querySelectorAll('.has-dropdown.open, .has-submenu.open')
                         .forEach(function (el) { el.classList.remove('open'); });
            }
        });

        /* 5 ── Resize: reset mobile state when returning to desktop */
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                hamburgerIcon.className = 'fas fa-bars';
                document.querySelectorAll('.has-dropdown.open, .has-submenu.open')
                         .forEach(function (el) { el.classList.remove('open'); });
            }
        });
    })();
