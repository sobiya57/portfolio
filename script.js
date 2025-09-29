// script.js
// - typed.js init
// - mobile menu toggle
// - smooth anchor scrolling
// - full-screen canvas background: moving gradient + particles (performance conscious, reduced on mobile)
// - small utilities: update year

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- typed.js for roles ---------------- */
  try {
    new Typed('#typed-text', {
      strings: ['Frontend Developer', 'Data Science Developer', 'Learner'],
      typeSpeed: 70,
      backSpeed: 45,
      backDelay: 1400,
      loop: true
    });
  } catch (e) { /* typed.js missing or failed, ignore */ }

  /* ---------------- navbar mobile toggle ---------------- */
  const nav = document.getElementById('navLinks');
  const menuBtn = document.getElementById('menuBtn');
  window.toggleMenu = function () {
    if (!nav) return;
    nav.classList.toggle('show');
  };
  if (menuBtn) menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
  document.addEventListener('click', (ev) => {
    if (!nav) return;
    if (!nav.contains(ev.target) && nav.classList.contains('show') && ev.target !== menuBtn) nav.classList.remove('show');
  });

  /* ---------------- smooth scroll for anchors ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (ev) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === '#0') return;
      const target = document.querySelector(href);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (nav && nav.classList.contains('show')) nav.classList.remove('show');
    });
  });

  /* ---------------- update footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Canvas background: gradient + particles ---------------- */
  (function canvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    // adjust particle count by screen size & device type
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const BASE = isMobile ? 28 : Math.max(80, Math.floor((w * h) / 90000));
    const PARTICLE_COUNT = Math.min(220, BASE);

    function rand(min, max) { return Math.random() * (max - min) + min; }

    // particle constructor
    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x = rand(0, w);
      this.y = rand(0, h);
      this.vx = rand(-0.25, 0.25);
      this.vy = rand(-0.35, 0.35);
      this.r = rand(0.5, 2.6);
      this.alpha = rand(0.15, 0.8);
      this.phase = rand(0, Math.PI * 2);
    };

    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    let t = 0;
    function draw() {
      t += 0.007;

      // moving soft gradient background (video-like)
      const g = ctx.createLinearGradient(0, 0, w, h);
      const g1 = Math.abs(Math.sin(t * 0.6));
      const g2 = Math.abs(Math.cos(t * 0.35));
      // subtle RGB mixing
      g.addColorStop(0, `rgba(${20 + Math.floor(g1 * 40)}, ${10 + Math.floor(g2 * 20)}, ${30 + Math.floor(g1 * 50)}, 1)`);
      g.addColorStop(0.5, `rgba(${10 + Math.floor(g2 * 80)}, ${20 + Math.floor(g1 * 30)}, ${50 + Math.floor(g2 * 50)}, 1)`);
      g.addColorStop(1, `rgba(${30 + Math.floor(g1 * 60)}, ${0 + Math.floor(g2 * 20)}, ${80 + Math.floor(g2 * 40)}, 1)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // particles (tiny stars)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.02;

        // twinkle factor
        const tw = 0.45 + Math.sin(p.phase) * 0.45;
        const alpha = Math.min(1, p.alpha * tw);

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // subtle soft vignette for readability
      const rad = ctx.createRadialGradient(w / 2, h / 2, Math.max(w, h) / 3, w / 2, h / 2, Math.max(w, h) / 1.1);
      rad.addColorStop(0, 'rgba(0,0,0,0)');
      rad.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, w, h);

      requestAnimationFrame(draw);
    }
    draw();

    // handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }, 150);
    });
  })();

}); // DOMContentLoaded
