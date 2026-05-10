document.addEventListener('DOMContentLoaded', () => {

  // ── 1. HERO ENTRY ANIMATION ──────────────────────────────
  anime.timeline({ easing: 'easeOutExpo', duration: 1100 })
    .add({
      targets: '.stagger-hero',
      translateY: [36, 0],
      opacity: [0, 1],
      delay: anime.stagger(130)
    })
    .add({
      targets: '.img-frame',
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 900,
      easing: 'easeOutQuint',
      offset: '-=800'
    })
    .add({
      targets: '.hero-stat-row',
      translateY: [16, 0],
      opacity: [0, 1],
      duration: 600,
      offset: '-=500'
    });

  // ── 2. SCROLL REVEAL ─────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      anime({
        targets: entry.target,
        translateY: [45, 0],
        opacity: [0, 1],
        duration: 850,
        easing: 'easeOutQuart'
      });

      const staggered = entry.target.querySelectorAll('.skill-box, .project-card, .cert-card');
      if (staggered.length > 0) {
        anime({
          targets: staggered,
          translateY: [28, 0],
          opacity: [0, 1],
          delay: anime.stagger(80, { start: 180 }),
          duration: 700,
          easing: 'easeOutQuart'
        });
      }

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-node').forEach(el => observer.observe(el));

  // ── 3. NODE DOT GLOW ON APPROACH ─────────────────────────
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const dot = entry.target.querySelector('.node-dot');
      if (!dot) return;
      if (entry.isIntersecting) {
        anime({
          targets: dot,
          scale: [1, 1.5, 1],
          duration: 600,
          easing: 'easeOutElastic(1, .6)'
        });
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.section-node').forEach(el => dotObserver.observe(el));

  // ── 4. MAGNETIC HOVER ────────────────────────────────────
  document.querySelectorAll('.btn, .btn-outline, .btn-sm, .skill-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
      anime({ targets: el, scale: 1.04, duration: 400, easing: 'easeOutElastic(1, .5)' });
    });
    el.addEventListener('mouseleave', () => {
      anime({ targets: el, scale: 1, duration: 400, easing: 'easeOutElastic(1, .5)' });
    });
  });

  // ── 5. SCROLL-LINKED SVG WORKFLOW LINE ───────────────────
  const svgPath      = document.getElementById('workflow-path');
  const dots         = document.querySelectorAll('.node-dot');
  const lineContainer = document.querySelector('.line-container');

  function drawLine() {
    if (!dots.length || !svgPath) return;

    const totalH = document.body.scrollHeight;
    lineContainer.style.height = totalH + 'px';

    const firstRect = dots[0].getBoundingClientRect();
    const sx = firstRect.left + firstRect.width / 2;
    const sy = firstRect.top + window.scrollY;

    let d = `M ${sx} ${sy} `;

    for (let i = 1; i < dots.length; i++) {
      const r = dots[i].getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + window.scrollY;
      // Soft cubic bezier between each node
      const mid = (sy + y) / 2;
      d += `C ${sx} ${mid}, ${x} ${mid}, ${x} ${y} `;
    }

    const lastR = dots[dots.length - 1].getBoundingClientRect();
    const lx = lastR.left + lastR.width / 2;
    const ly = lastR.top + window.scrollY;
    d += `L ${lx} ${ly + 120}`;

    svgPath.setAttribute('d', d);

    const len = svgPath.getTotalLength();
    svgPath.style.strokeDasharray = len;
    svgPath.style.strokeDashoffset = len;
  }

  setTimeout(drawLine, 250);
  window.addEventListener('resize', drawLine);

  window.addEventListener('scroll', () => {
    const len = svgPath ? svgPath.getTotalLength() : 0;
    if (!len) return;
    const pct = (window.scrollY + window.innerHeight * 0.55) / document.body.scrollHeight;
    svgPath.style.strokeDashoffset = Math.max(0, len - len * pct);
  }, { passive: true });

  // ── 6. NAVBAR SCROLL SHADOW ──────────────────────────────
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 30
      ? 'rgba(200,240,74,0.08)'
      : 'rgba(255,255,255,0.07)';
  }, { passive: true });

  // ── 7. HAMBURGER MENU ────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // ── 8. CONTACT FORM ──────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      anime({
        targets: btn,
        scale: [1, 0.97, 1],
        duration: 400,
        easing: 'easeOutQuad'
      });

      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#4af0c8';
      btn.style.cursor = 'default';

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.cursor = '';
        form.reset();
      }, 3000);
    });
  }

  // ── 9. SMOOTH ACTIVE NAV HIGHLIGHT ───────────────────────
  const sections = document.querySelectorAll('header[id], section[id]');
  const navAs = document.querySelectorAll('.nav-links a');

  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAs.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id ? '#f0ede8' : '';
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-60px 0px -60px 0px' });

  sections.forEach(s => secObserver.observe(s));

});
