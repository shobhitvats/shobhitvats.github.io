/* ========================================
   SHARED JS — Portfolio of Shobhit Vats Sharma
   ======================================== */

// ── Navbar scroll effect ──────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile nav toggle ─────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── Active nav link ───────────────────────────────────────────────────
(function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (path.endsWith(href) || (href.includes('projects') && path.includes('projects'))
        || (href.endsWith('about.html') && path.endsWith('about.html'))
        || (href.endsWith('contact.html') && path.endsWith('contact.html'))
        || (path === '/' || path.endsWith('index.html')) && (href === './' || href === 'index.html' || href === '/index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Scroll reveal ─────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement
        ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
        : [];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Dynamic Scientific Background (Interactive Plexus Fabric) ───────
class ScientificBackground {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas-bg';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = 120; // High density for vividness
    this.maxDist = 200;
    this.maxWidth = 1100; // Critical: Matches CSS max-width
    this.mouse = { x: -1000, y: -1000 };
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.resize();
    this.init();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.init();
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const centerX = this.canvas.width / 2;
    const deadZoneHalfWidth = Math.min(this.maxWidth / 2 + 50, this.canvas.width / 2);

    if (this.canvas.width > 900) {
      this.particles.forEach((p, i) => {
        // Movement
        p.x += p.vx;
        p.y += p.vy;

        // Mouse ripple
        const dxm = p.x - this.mouse.x;
        const dym = p.y - this.mouse.y;
        const distm = Math.sqrt(dxm * dxm + dym * dym);
        if (distm < 220) {
          const force = (220 - distm) / 220;
          p.x += dxm * force * 0.15;
          p.y += dym * force * 0.15;
        }

        // Boundary check
        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

        // Is it in the margins?
        const isInMargin = Math.abs(p.x - centerX) > deadZoneHalfWidth;

        if (isInMargin) {
          // Draw particle
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fillStyle = 'rgba(200, 115, 58, 0.45)'; // Softer
          this.ctx.fill();

          // Draw connections
          for (let j = i + 1; j < this.particles.length; j++) {
            const p2 = this.particles[j];
            const isInMargin2 = Math.abs(p2.x - centerX) > deadZoneHalfWidth;
            
            if (isInMargin2) {
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < this.maxDist) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(200, 115, 58, ${0.2 * (1 - dist / this.maxDist)})`;
                this.ctx.lineWidth = 0.8;
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
              }
            }
          }
        }
      });
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ScientificBackground();
});

// ── Accordion / expandable ────────────────────────────────────────────
document.querySelectorAll('[data-accordion]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const target = document.getElementById(trigger.dataset.accordion);
    if (!target) return;
    const isOpen = target.style.display !== 'none' && target.style.display !== '';
    target.style.display = isOpen ? 'none' : 'block';
    trigger.classList.toggle('open', !isOpen);
    const arrow = trigger.querySelector('.arrow');
    if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
  });
});

// ── Smooth scroll for anchor buttons ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Copy email on click ────────────────────────────────────────────────
const emailBtns = document.querySelectorAll('[data-copy-email]');
emailBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = btn.getAttribute('data-copy-email') || btn.textContent.trim();
    if (email && navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<span style="color:var(--accent)">Copied!</span>';
        setTimeout(() => btn.innerHTML = orig, 1500);
      });
    }
  });
});
