/* ── Navigation scroll effect ───────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile nav toggle ──────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── Cursor spotlight ───────────────────────────────────────── */
document.addEventListener('mousemove', e => {
  document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
  document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
});

/* ── Scroll progress bar ────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--scroll-progress', progress);
}, { passive: true });

/* ── Hero parallax ──────────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
  }, { passive: true });
}

/* ── Typewriter on hero eyebrow ─────────────────────────────── */
const eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
  const fullText = eyebrow.textContent;
  eyebrow.textContent = '';
  let i = 0;
  function typeChar() {
    if (i < fullText.length) {
      eyebrow.textContent += fullText[i++];
      setTimeout(typeChar, 48);
    }
  }
  setTimeout(typeChar, 300);
}

/* ── Magnetic CTA buttons ───────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.28;
    const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.28;
    btn.style.transition = 'transform 0.1s ease, background 0.2s, box-shadow 0.2s';
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.5s var(--ease), background 0.2s, box-shadow 0.2s';
    btn.style.transform = '';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});

/* ── Active nav highlighting ────────────────────────────────── */
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ── Scroll reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling cards slightly
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      const index = Array.from(siblings).indexOf(entry.target);
      const delay = index * 80;
      entry.target.style.transitionDelay = delay + 'ms';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ── Stat counter ────────────────────────────────────────────── */
const statNumber = document.querySelector('.stat-number');
if (statNumber) {
  const target = parseInt(statNumber.textContent, 10);
  statNumber.textContent = '0';
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let count = 0;
        const step = () => {
          count++;
          statNumber.textContent = count;
          if (count < target) setTimeout(step, 140);
        };
        step();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(statNumber);
}

/* ── Card tilt on hover ──────────────────────────────────────── */
document.querySelectorAll('.project-card, .bring-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Override reveal transition so tilt tracks the cursor instantly
    card.style.transition = 'border-color 0.25s, background 0.25s';
    card.style.transitionDelay = '0ms';
    card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    // Smooth snap-back, then restore original styles
    card.style.transition = 'transform 0.35s ease, border-color 0.25s, background 0.25s';
    card.style.transitionDelay = '0ms';
    card.style.transform = '';
    card.addEventListener('transitionend', function cleanup() {
      card.style.transition = '';
      card.style.transitionDelay = '';
      card.removeEventListener('transitionend', cleanup);
    });
  });
});
