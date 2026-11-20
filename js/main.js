/* ==========================================================================
   SHARED CORE JS — Portfolio of Shobhit Vats Sharma
   Theme toggle, accessible mobile drawer, native <dialog> modal controller,
   active route matcher, scroll reveal, clipboard feedback & ambient canvas.
   ========================================================================== */

(() => {
  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  function getVisibleFocusables(root) {
    if (!root) return [];
    return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
      if (el.hasAttribute('hidden')) return false;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      return el.getClientRects().length > 0 || el === document.activeElement;
    });
  }

  // ── 1. Theme Switcher (Light / Obsidian Dark) ─────────────────────────
  function initTheme() {
    const saved = localStorage.getItem('svs-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);

    const SUN_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    const MOON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

    const updateButtons = (theme) => {
      const isDark = theme === 'dark';
      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(isDark));
        btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        const icon = btn.querySelector('[data-theme-icon]');
        if (icon) {
          icon.innerHTML = isDark ? SUN_SVG : MOON_SVG;
        }
      });
    };

    updateButtons(saved);

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-theme-toggle]');
      if (!btn) return;
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('svs-theme', next);
      updateButtons(next);
    });
  }

  // ── 2. Navbar Scroll Effect ───────────────────────────────────────────
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── 3. Active Navigation Route Detection ──────────────────────────────
  function normalizePathname(pathname) {
    if (!pathname) return '/';
    let p = pathname.split('?')[0].split('#')[0];
    p = p.replace(/\/+/g, '/');
    p = p.replace(/\/index\.html\/?$/, '/');
    p = p.replace(/\.html\/+$/, '.html');
    if (p.length > 1 && p.endsWith('/')) {
      p = p.slice(0, -1);
    }
    return p || '/';
  }

  function setActiveNav() {
    const links = Array.from(document.querySelectorAll('.nav-links a'));
    if (!links.length) return;

    const baseHref = window.location.origin + window.location.pathname.replace(/\.html\/+$/, '.html');
    const normCurrent = normalizePathname(window.location.pathname);

    links.forEach((a) => {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });

    let matched = null;
    for (const a of links) {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      try {
        const target = new URL(href, baseHref);
        if (normalizePathname(target.pathname) === normCurrent) {
          matched = a;
          break;
        }
      } catch {
        // ignore malformed href
      }
    }

    if (!matched && (normCurrent === '/projects' || normCurrent.startsWith('/projects/'))) {
      for (const a of links) {
        const href = a.getAttribute('href');
        if (!href) continue;
        try {
          const target = new URL(href, baseHref);
          const normTarget = normalizePathname(target.pathname);
          if (normTarget === '/projects' || normTarget.endsWith('/projects')) {
            matched = a;
            break;
          }
        } catch {
          // ignore
        }
      }
    }

    if (matched) {
      matched.classList.add('active');
      matched.setAttribute('aria-current', 'page');
    }
  }

  // ── 4. Accessible Mobile Navigation Drawer & Focus Trap ───────────────
  function initMobileNav() {
    const navToggle = document.getElementById('navToggle') || document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');
    if (!navToggle || !navLinks) return;

    if (!navToggle.hasAttribute('aria-expanded')) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (!navToggle.hasAttribute('aria-controls') && navLinks.id) {
      navToggle.setAttribute('aria-controls', navLinks.id);
    }

    const setOpen = (open, restoreFocus = false) => {
      navToggle.classList.toggle('open', open);
      navLinks.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      if (!open && restoreFocus) {
        navToggle.focus();
      }
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !navLinks.classList.contains('open');
      setOpen(willOpen);
    });

    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('open')) return;
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!navLinks.classList.contains('open')) return;
      if (document.querySelector('dialog[open]')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false, true);
        return;
      }

      if (e.key === 'Tab') {
        const navItems = getVisibleFocusables(navLinks);
        if (!navItems.length) return;
        const first = navItems[0];
        const last = navItems[navItems.length - 1];
        const active = document.activeElement;
        const insideNav = navLinks.contains(active);
        const onToggle = active === navToggle;

        if (!insideNav && !onToggle) {
          e.preventDefault();
          navToggle.focus();
          return;
        }

        if (!e.shiftKey) {
          if (onToggle) {
            e.preventDefault();
            first.focus();
          } else if (active === last) {
            e.preventDefault();
            navToggle.focus();
          }
        } else {
          if (onToggle) {
            e.preventDefault();
            last.focus();
          } else if (active === first) {
            e.preventDefault();
            navToggle.focus();
          }
        }
      }
    });
  }

  // ── 5. Native HTML5 <dialog> Modal Controller ─────────────────────────
  function initDialogController() {
    let activeTrigger = null;

    const cleanupModal = (dlg) => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      if (activeTrigger) {
        activeTrigger.setAttribute('aria-expanded', 'false');
        const trg = activeTrigger;
        activeTrigger = null;
        if (document.contains(trg)) {
          trg.focus();
        }
      }
      if (dlg) {
        dlg.removeAttribute('open');
      }
    };

    const bindDialog = (dlg) => {
      if (!dlg || dlg.dataset.dialogBound === '1') return;
      dlg.dataset.dialogBound = '1';

      dlg.addEventListener('close', () => {
        cleanupModal(dlg);
      });

      dlg.addEventListener('click', (e) => {
        if (e.target === dlg) {
          if (typeof dlg.close === 'function' && dlg.open) {
            dlg.close();
          }
          cleanupModal(dlg);
        }
      });
    };

    const openDialog = (dlg, trigger) => {
      if (!dlg) return;
      bindDialog(dlg);
      activeTrigger = trigger || null;
      if (activeTrigger) {
        activeTrigger.setAttribute('aria-expanded', 'true');
      }

      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';

      if (!dlg.open) {
        if (typeof dlg.showModal === 'function') {
          dlg.showModal();
        } else {
          dlg.setAttribute('open', '');
        }
      }

      const focusables = getVisibleFocusables(dlg);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        dlg.setAttribute('tabindex', '-1');
        dlg.focus();
      }
    };

    const closeDialog = (dlg) => {
      if (!dlg) return;
      bindDialog(dlg);
      if (typeof dlg.close === 'function' && dlg.open) {
        dlg.close();
      }
      cleanupModal(dlg);
    };

    document.querySelectorAll('dialog').forEach(bindDialog);

    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-open-modal], #openRecommendationBtn');
      if (openBtn) {
        e.preventDefault();
        const targetId = openBtn.getAttribute('data-open-modal') || 'recommendation-modal';
        const dlg = document.getElementById(targetId);
        if (dlg) openDialog(dlg, openBtn);
        return;
      }

      const closeBtn = e.target.closest('[data-close-modal], .modal-close-btn, .dialog-close');
      if (closeBtn) {
        const dlg = closeBtn.closest('dialog') || document.querySelector('dialog[open]');
        if (dlg) {
          e.preventDefault();
          closeDialog(dlg);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      const dlg = document.querySelector('dialog[open]');
      if (!dlg) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog(dlg);
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getVisibleFocusables(dlg);
        if (!focusables.length) {
          e.preventDefault();
          dlg.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (!dlg.contains(active) || active === document.body) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
          return;
        }

        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    });

    // Optional hash deep-link opening (e.g. about.html#recommendation-letter)
    if (window.location.hash === '#recommendation-letter' || window.location.hash === '#fullLetter') {
      const dlg = document.getElementById('recommendation-modal');
      const trigger = document.querySelector('[data-open-modal="recommendation-modal"]');
      if (dlg) openDialog(dlg, trigger);
    }
  }

  // ── 6. Scroll Reveal ──────────────────────────────────────────────────
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  // ── 7. Smooth Anchor Scroll ───────────────────────────────────────────
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ── 8. Copy-to-Clipboard with Live Region ─────────────────────────────
  function initCopyButtons() {
    const btns = document.querySelectorAll('[data-copy-email]');
    if (!btns.length) return;

    let liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }

    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = btn.getAttribute('data-copy-email') || btn.textContent.trim();
        const announce = () => {
          const orig = btn.innerHTML;
          btn.innerHTML = '<span style="color:var(--accent);font-weight:700">Copied!</span>';
          liveRegion.textContent = `Copied ${email} to clipboard`;
          setTimeout(() => {
            btn.innerHTML = orig;
          }, 1600);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(announce).catch(announce);
        } else {
          announce();
        }
      });
    });
  }

  // ── Boot ──────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbarScroll();
    setActiveNav();
    initMobileNav();
    initDialogController();
    initScrollReveal();
    initAnchorScroll();
    initCopyButtons();
  });
})();
