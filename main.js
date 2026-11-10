/**
 * Gulf Store — main.js
 * Scroll-driven vibe transitions using IntersectionObserver.
 * View Transitions API wraps body class swaps for smooth morphs.
 * Falls back gracefully in older browsers.
 */

'use strict';

/* ═══════════════════════════════════════════════
   Vibe definitions
   ═══════════════════════════════════════════════ */
const VIBES = {
  kids: {
    bodyClass: 'vibe-kids',
    navText: '#2D1B69',
  },
  perfume: {
    bodyClass: 'vibe-perfume',
    navText: '#F5EDD6',
  },
  shoes: {
    bodyClass: 'vibe-shoes',
    navText: '#FFFFFF',
  },
};

/* ═══════════════════════════════════════════════
   State
   ═══════════════════════════════════════════════ */
let currentVibe = 'kids';
let isTransitioning = false;

/* ═══════════════════════════════════════════════
   DOM refs
   ═══════════════════════════════════════════════ */
const body      = document.body;
const navbar    = document.getElementById('navbar');
const overlay   = document.querySelector('.vibe-overlay');
const navLinks  = document.querySelectorAll('.nav-link');
const vibeDots  = document.querySelectorAll('.vibe-dot');
const sections  = document.querySelectorAll('.vibe-section[data-vibe]');

/* ═══════════════════════════════════════════════
   Apply a vibe
   ═══════════════════════════════════════════════ */
function applyVibe(newVibe) {
  if (newVibe === currentVibe || isTransitioning) return;
  isTransitioning = true;

  const def = VIBES[newVibe];
  if (!def) { isTransitioning = false; return; }

  const doTransition = () => {
    // Swap body class
    Object.values(VIBES).forEach(v => body.classList.remove(v.bodyClass));
    body.classList.add(def.bodyClass);
    body.dataset.vibe = newVibe;
    currentVibe = newVibe;

    // Update active nav link
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === newVibe);
    });

    // Update active vibe dot
    vibeDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.vibe === newVibe);
    });
  };

  // Use View Transitions API when available
  if (document.startViewTransition) {
    const t = document.startViewTransition(doTransition);
    t.finished.finally(() => { isTransitioning = false; });
  } else {
    // Overlay flash fallback
    if (overlay) {
      overlay.classList.add('flash');
      setTimeout(() => {
        doTransition();
        overlay.classList.remove('flash');
        isTransitioning = false;
      }, 150);
    } else {
      doTransition();
      isTransitioning = false;
    }
  }
}

/* ═══════════════════════════════════════════════
   IntersectionObserver — trigger vibe by section
   ═══════════════════════════════════════════════ */
const observer = new IntersectionObserver(
  (entries) => {
    // Find the most-visible intersecting section
    let best = null;
    let bestRatio = 0;

    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        best = entry.target;
      }
    });

    // Also check all sections to find the dominant one in viewport
    const viewportMid = window.innerHeight / 2;
    let dominant = null;
    let minDist = Infinity;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionMid = rect.top + rect.height / 2;
      const dist = Math.abs(sectionMid - viewportMid);
      if (rect.top < window.innerHeight && rect.bottom > 0 && dist < minDist) {
        minDist = dist;
        dominant = section;
      }
    });

    const target = dominant || best;
    if (target) {
      applyVibe(target.dataset.vibe);
    }
  },
  {
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    rootMargin: `-${Math.round(window.innerHeight * 0.3)}px 0px -${Math.round(window.innerHeight * 0.3)}px 0px`,
  }
);

sections.forEach(s => observer.observe(s));

/* ═══════════════════════════════════════════════
   Nav link clicks — smooth scroll + instant vibe
   ═══════════════════════════════════════════════ */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = link.dataset.target;
    if (target) {
      e.preventDefault();
      applyVibe(target);
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* ═══════════════════════════════════════════════
   Navbar shrink on scroll
   ═══════════════════════════════════════════════ */
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar?.classList.toggle('scrolled', y > 50);
  navbar?.classList.toggle('hidden', y > lastY + 10 && y > 200);
  navbar?.classList.toggle('visible', y < lastY);
  lastY = y;
}, { passive: true });

/* Navbar scrolled style */
const navStyle = document.createElement('style');
navStyle.textContent = `
  .navbar.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.12); }
  .navbar.hidden  { transform: translateY(-100%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), background var(--vibe-transition), border-color var(--vibe-transition); }
  .navbar.visible { transform: translateY(0); }
  /* When kids vibe: account for 36px announcement bar */
  body.vibe-kids .kids-hero { margin-top: 0; }
`;
document.head.appendChild(navStyle);

/* ═══════════════════════════════════════════════
   Initial vibe — set from first section in view
   ═══════════════════════════════════════════════ */
(function setInitialVibe() {
  const firstVisible = Array.from(sections).find(s => {
    const r = s.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  });
  if (firstVisible) {
    const v = firstVisible.dataset.vibe;
    body.classList.add(VIBES[v]?.bodyClass || 'vibe-kids');
    body.dataset.vibe = v;
    currentVibe = v;
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === v));
    vibeDots.forEach(d => d.classList.toggle('active', d.dataset.vibe === v));
  }
})();

/* ═══════════════════════════════════════════════
   Shop by Category Prev/Next scroll buttons
   ═══════════════════════════════════════════════ */
const prevCatBtn = document.querySelector('.kids-cat-nav--prev');
const nextCatBtn = document.querySelector('.kids-cat-nav--next');
const catGridEl  = document.getElementById('kids-cat-grid');
if (prevCatBtn && nextCatBtn && catGridEl) {
  const step = () => (catGridEl.querySelector('.kids-cat-card')?.offsetWidth || 300) + 22;
  prevCatBtn.addEventListener('click', () => {
    catGridEl.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  nextCatBtn.addEventListener('click', () => {
    catGridEl.scrollBy({ left: step(), behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════
   Kids section — floating elements parallax
   ═══════════════════════════════════════════════ */
(function kidsParallax() {
  if (!CSS.supports('animation-timeline', 'scroll()')) {
    // JS fallback parallax for kids stars
    const stars = document.querySelectorAll('#kids .deco-star');
    window.addEventListener('scroll', () => {
      const kidsSection = document.getElementById('kids');
      if (!kidsSection) return;
      const rect = kidsSection.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      stars.forEach((star, i) => {
        const speed = (i + 1) * 30;
        star.style.transform = `translateY(${-progress * speed}px)`;
      });
    }, { passive: true });
  }
})();

/* ═══════════════════════════════════════════════
   View Transitions reduced-motion CSS injection
   ═══════════════════════════════════════════════ */
const vtStyle = document.createElement('style');
vtStyle.textContent = `
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
      animation: none !important;
    }
  }

  /* View Transition: body background cross-fade */
  ::view-transition-old(root) {
    animation: 400ms cubic-bezier(0.4, 0, 0.2, 1) both vt-fade-out;
  }
  ::view-transition-new(root) {
    animation: 600ms cubic-bezier(0.4, 0, 0.2, 1) both vt-fade-in;
  }
  @keyframes vt-fade-out {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  @keyframes vt-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Navbar — persist across transition */
  .navbar { view-transition-name: navbar; }
  ::view-transition-old(navbar),
  ::view-transition-new(navbar) {
    animation: none;
    mix-blend-mode: normal;
  }
`;
document.head.appendChild(vtStyle);


/* ═══════════════════════════════════════════════
   Navbar menu (perfume vibe)
   ═══════════════════════════════════════════════ */
(function navMenu() {
  const btn = document.getElementById('navMenuBtn');
  const panel = document.getElementById('navMenuPanel');
  if (!btn || !panel) return;
  const close = () => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  panel.addEventListener('click', close);
  document.addEventListener('click', close);
})();

/* ═══════════════════════════════════════════════
   Perfume carousel — arch highlight, arrows, progress
   ═══════════════════════════════════════════════ */
(function perfumeCarousel() {
  const track = document.getElementById('pf-track');
  const thumb = document.getElementById('pf-thumb');
  const prev  = document.getElementById('pf-prev');
  const next  = document.getElementById('pf-next');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.pf-card'));
  let active = Math.max(0, cards.findIndex(c => c.classList.contains('is-active')));

  const setActive = (i) => {
    active = Math.min(cards.length - 1, Math.max(0, i));
    cards.forEach((c, k) => c.classList.toggle('is-active', k === active));
  };
  const goTo = (i) => {
    setActive(i);
    const c = cards[active];
    track.scrollTo({ left: c.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };
  const updateProgress = () => {
    const max = track.scrollWidth - track.clientWidth;
    const w = Math.min(1, track.clientWidth / track.scrollWidth);
    const p = max > 0 ? track.scrollLeft / max : 0;
    thumb.style.width = (w * 100) + '%';
    thumb.style.left = (p * (1 - w) * 100) + '%';
  };

  cards.forEach((c, i) => c.addEventListener('mouseenter', () => setActive(i)));
  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  track.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();


/* ═══════════════════════════════════════════════
   Navbar "Explore" — jump to the current section's products
   ═══════════════════════════════════════════════ */
(function exploreBtn() {
  const btn = document.querySelector('.nav-explore-btn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    const target = document.getElementById((document.body.dataset.vibe || 'perfume') + '-products');
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
})();

/* ═══════════════════════════════════════════════
   Shoes carousel — lift highlight, arrows, progress
   ═══════════════════════════════════════════════ */
(function shoesCarousel() {
  const track = document.getElementById('sh-track');
  const thumb = document.getElementById('sh-thumb');
  const prev  = document.getElementById('sh-prev');
  const next  = document.getElementById('sh-next');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.sh-card'));
  let active = Math.max(0, cards.findIndex(c => c.classList.contains('is-active')));

  const setActive = (i) => {
    active = Math.min(cards.length - 1, Math.max(0, i));
    cards.forEach((c, k) => c.classList.toggle('is-active', k === active));
  };
  const goTo = (i) => {
    setActive(i);
    track.scrollTo({ left: cards[active].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };
  const updateProgress = () => {
    const max = track.scrollWidth - track.clientWidth;
    const w = Math.min(1, track.clientWidth / track.scrollWidth);
    const p = max > 0 ? track.scrollLeft / max : 0;
    thumb.style.width = (w * 100) + '%';
    thumb.style.left = (p * (1 - w) * 100) + '%';
  };

  cards.forEach((c, i) => c.addEventListener('mouseenter', () => setActive(i)));
  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  track.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();
