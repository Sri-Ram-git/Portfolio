/* ── THEME ── */
const themeBtn = document.getElementById('themeToggle');
themeBtn.onclick = () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
};

/* ── MOBILE MENU ── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
hamburger.onclick = () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
};
function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}
// close on outside tap
document.addEventListener('click', e => {
  if (!e.target.closest('nav')) closeMenu();
});

/* ── CURSOR (desktop only) ── */
const cursorEl = document.getElementById('cursor');
const ringEl   = document.getElementById('cursorRing');
if (window.matchMedia('(hover: hover)').matches) {
  let mx=-999, my=-999, rx=-999, ry=-999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animC() {
    cursorEl.style.transform = `translate(${mx-5}px,${my-5}px)`;
    rx += (mx-rx) * 0.12; ry += (my-ry) * 0.12;
    ringEl.style.transform = `translate(${rx-18}px,${ry-18}px)`;
    requestAnimationFrame(animC);
  })();
  document.querySelectorAll('a,button,.project-card,.skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ringEl.style.width='52px'; ringEl.style.height='52px'; });
    el.addEventListener('mouseleave', () => { ringEl.style.width='36px'; ringEl.style.height='36px'; });
  });
}

/* ── SOFT ORBS + STARS BACKGROUND ── */
(function() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    const hero = document.getElementById('hero');
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  const orbs = [
    { x:.08, y:.12, r:.6,  color:[80,50,220],  sx:.00015, sy:.00010, phase:0   },
    { x:.92, y:.18, r:.5,  color:[0,160,210],   sx:.00012, sy:.00018, phase:2.1 },
    { x:.5,  y:.95, r:.55, color:[140,40,200],  sx:.00014, sy:.00009, phase:4.3 },
  ];

  let stars = [];
  function initStars() {
    stars = Array.from({ length: 90 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 0.7 + 0.2,
      a:  Math.random() * 0.18 + 0.04,
      tw: Math.random() * Math.PI * 2,
      ts: Math.random() * 0.008 + 0.002,
    }));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.fillStyle = isDark ? '#05050f' : '#faf9f7';
    ctx.fillRect(0, 0, W, H);

    orbs.forEach(o => {
      const cx = W * (o.x + Math.sin(t * o.sx + o.phase) * 0.06);
      const cy = H * (o.y + Math.cos(t * o.sy + o.phase) * 0.05);
      const r  = Math.min(W, H) * o.r;
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   `rgba(${o.color.join(',')},0.09)`);
      g.addColorStop(0.4, `rgba(${o.color.join(',')},0.05)`);
      g.addColorStop(1,   `rgba(${o.color.join(',')},0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    stars.forEach(s => {
      s.tw += s.ts;
      const a = s.a * (0.4 + 0.6 * Math.abs(Math.sin(s.tw)));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,195,255,${a})`;
      ctx.fill();
    });

    t++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initStars(); });
  resize();
  initStars();
  draw();
})();

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── SKILL BARS ── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar').forEach(b => {
        b.style.width = b.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-card').forEach(c => barObs.observe(c));

/* ── NAV SCROLL SHADOW ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
