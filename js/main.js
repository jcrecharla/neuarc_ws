/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });
}

/* ── Active nav link by page ── */
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    a.classList.add('nav-active');
  }
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Terminal line-by-line reveal ── */
const termBodies = document.querySelectorAll('.terminal-body');
termBodies.forEach(body => {
  const lines = body.querySelectorAll('.t-line');
  lines.forEach(l => {
    l.style.opacity = '0';
    l.style.transform = 'translateX(-6px)';
    l.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  const termObs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    lines.forEach((l, i) => {
      setTimeout(() => {
        l.style.opacity = '1';
        l.style.transform = 'none';
      }, i * 220);
    });
    termObs.disconnect();
  }, { threshold: 0.3 });
  termObs.observe(body);
});

/* ── EDGE Framework — sticky terminal step tracking ── */
const edgeSteps    = document.querySelectorAll('.edge-step-block');
const termContents = document.querySelectorAll('.term-content');

if (edgeSteps.length && termContents.length) {
  const edgeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const step = e.target.dataset.step;

      edgeSteps.forEach(s => s.classList.remove('step-active'));
      e.target.classList.add('step-active');

      termContents.forEach(tc => tc.classList.remove('active'));
      const target = document.getElementById(`term-${step}`);
      if (target) target.classList.add('active');
    });
  }, { threshold: 0.45, rootMargin: '-5% 0px -35% 0px' });

  edgeSteps.forEach(s => edgeObs.observe(s));
}

/* ── Track filter toggle ── */
const trackBtns   = document.querySelectorAll('.track-btn');
const trackPanels = document.querySelectorAll('.track-panel');

if (trackBtns.length) {
  trackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.track;
      trackBtns.forEach(b => b.classList.remove('active'));
      trackPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(`track-${id}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ── Animated counters ── */
function animateCount(el, target, duration = 1600) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = eased * target;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(1) : target;
  };
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const target = parseFloat(e.target.dataset.target);
    if (!isNaN(target)) animateCount(e.target, target);
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ── Smooth scroll for hash links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ── WhatsApp widget toggle ── */
const waBtn   = document.getElementById('waBtn');
const waPopup = document.getElementById('waPopup');
if (waBtn && waPopup) {
  waBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    waPopup.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.wa-widget')) waPopup.classList.remove('open');
  });
}
