/**
 * Gulf Store — product.js
 * Reads ?id=&vibe= from URL, populates the product detail page,
 * and applies the correct vibe immediately (no scroll needed).
 */

'use strict';

const ICON_PATHS = {
  "feather": "<path d=\"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z\"/><line x1=\"16\" x2=\"2\" y1=\"8\" y2=\"22\"/><line x1=\"17.5\" x2=\"9\" y1=\"15\" y2=\"15\"/>",
  "leaf": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"/>",
  "sparkles": "<path d=\"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z\"/><path d=\"M5 3v4\"/><path d=\"M19 17v4\"/><path d=\"M3 5h4\"/><path d=\"M17 19h4\"/>",
  "trophy": "<path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6\"/><path d=\"M18 9h1.5a2.5 2.5 0 0 0 0-5H18\"/><path d=\"M4 22h16\"/><path d=\"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\"/><path d=\"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\"/><path d=\"M18 2H6v7a6 6 0 0 0 12 0V2Z\"/>",
  "zap": "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"/>",
  "palette": "<circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\"/><path d=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z\"/>",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"/>",
  "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\"/>",
  "gem": "<path d=\"M6 3h12l4 6-10 13L2 9Z\"/><path d=\"M11 3 8 9l4 13 4-13-3-6\"/><path d=\"M2 9h20\"/>",
  "hourglass": "<path d=\"M5 22h14\"/><path d=\"M5 2h14\"/><path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\"/><path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\"/>",
  "flower": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5\"/><path d=\"M12 7.5V9\"/><path d=\"M7.5 12H9\"/><path d=\"M16.5 12H15\"/><path d=\"M12 16.5V15\"/><path d=\"m8 8 1.88 1.88\"/><path d=\"M14.12 9.88 16 8\"/><path d=\"m8 16 1.88-1.88\"/><path d=\"M14.12 14.12 16 16\"/>",
  "wind": "<path d=\"M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2\"/><path d=\"M9.6 4.6A2 2 0 1 1 11 8H2\"/><path d=\"M12.6 19.4A2 2 0 1 0 14 16H2\"/>",
  "droplets": "<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"/><path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"/>",
  "flask": "<path d=\"M10 2v7.31\"/><path d=\"M14 9.3V1.99\"/><path d=\"M8.5 2h7\"/><path d=\"M14 9.3a6.5 6.5 0 1 1-4 0\"/><path d=\"M5.52 16h12.96\"/>",
  "footprints": "<path d=\"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z\"/><path d=\"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z\"/><path d=\"M16 17h4\"/><path d=\"M4 13h4\"/>",
  "layers": "<path d=\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\"/><path d=\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\"/><path d=\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\"/>",
  "history": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/><path d=\"M12 7v5l4 2\"/>",
  "star": "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/>",
  "cloud": "<path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"/>"
};

/** Inline SVG icon (Lucide-style stroke icons). */
function icon(name, size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
}



/* ═══════════════════════════════════════════════
   Product catalogue
   ═══════════════════════════════════════════════ */
const CATALOGUE = {
  'baby-1': {
    vibe: 'kids',
    name: 'Colourful Kids Outfit',
    tag: 'New Arrival',
    price: 'SAR 149',
    desc: 'A burst of colour for your little one. Made from ultra-soft, breathable cotton that keeps tiny adventurers comfortable all day long. Machine washable and built to last through every playground escapade.',
    images: [
      'assets/baby-clothes/baby-1.jpg',
      'assets/baby-clothes/baby-2.jpg',
      'assets/baby-clothes/baby-3.jpg',
    ],
    sizes: ['3M', '6M', '12M', '18M', '2Y', '3Y'],
    badges: [{ i: 'feather', t: 'Soft Fabric' }, { i: 'leaf', t: 'Eco-Friendly' }, { i: 'sparkles', t: 'Handpicked' }],
    related: ['baby-2', 'baby-3', 'baby-4'],
  },
  'baby-2': {
    vibe: 'kids',
    name: 'Soft Cotton Set',
    tag: 'Bestseller',
    price: 'SAR 199',
    desc: 'The bestselling cotton set that parents love. Gentle on sensitive skin, with playful prints that spark imagination. Available in multiple sizes.',
    images: [
      'assets/baby-clothes/baby-2.jpg',
      'assets/baby-clothes/baby-1.jpg',
      'assets/baby-clothes/baby-4.jpg',
    ],
    sizes: ['3M', '6M', '12M', '18M', '2Y'],
    badges: [{ i: 'trophy', t: 'Bestseller' }, { i: 'feather', t: 'Soft Fabric' }],
    related: ['baby-1', 'baby-3', 'baby-4'],
  },
  'baby-3': {
    vibe: 'kids',
    name: 'Playful Print Tee',
    tag: 'Limited',
    price: 'SAR 89',
    desc: 'Limited edition graphic tee with vibrant prints that little ones adore. Lightweight weave keeps them cool whether indoors or out.',
    images: [
      'assets/baby-clothes/baby-3.jpg',
      'assets/baby-clothes/baby-4.jpg',
      'assets/baby-clothes/baby-1.jpg',
    ],
    sizes: ['6M', '12M', '18M', '2Y', '3Y'],
    badges: [{ i: 'zap', t: 'Limited' }, { i: 'palette', t: 'Vibrant Print' }],
    related: ['baby-1', 'baby-2', 'baby-4'],
  },
  'baby-4': {
    vibe: 'kids',
    name: 'Dream Cloud Pyjama',
    tag: 'New',
    price: 'SAR 129',
    desc: 'Sleep tight in cloud-soft pyjamas. Breathable jersey fabric with cute cloud prints — bedtime has never been this magical.',
    images: [
      'assets/baby-clothes/baby-4.jpg',
      'assets/baby-clothes/baby-3.jpg',
      'assets/baby-clothes/baby-2.jpg',
    ],
    sizes: ['6M', '12M', '18M', '2Y', '3Y', '4Y'],
    badges: [{ i: 'moon', t: 'Sleepwear' }, { i: 'feather', t: 'Soft Fabric' }],
    related: ['baby-1', 'baby-2', 'baby-3'],
  },

  'perfume-1': {
    vibe: 'perfume',
    name: 'Dark Oud Noir',
    tag: 'Signature',
    price: 'SAR 450',
    desc: 'An oud of rare depth. Dark resinous woods meet smoky incense and a trail of amber that lingers for hours. The scent of quiet authority.',
    images: [
      'assets/perfume/perfume-1.jpg',
      'assets/perfume/perfume-2.jpg',
      'assets/perfume/perfume-3.jpg',
    ],
    sizes: null,
    badges: [{ i: 'hourglass', t: 'Long-Lasting' }, { i: 'gem', t: 'Rare Ingredients' }, { i: 'flask', t: 'Artisan Bottle' }],
    related: ['perfume-2', 'perfume-3', 'perfume-4'],
  },
  'perfume-2': {
    vibe: 'perfume',
    name: 'Obsidian Amber',
    tag: 'Bestseller',
    price: 'SAR 520',
    desc: 'Warm amber resin anchored by midnight musk and a whisper of vanilla. Rich. Sensual. Unforgettable.',
    images: [
      'assets/perfume/perfume-2.jpg',
      'assets/perfume/perfume-1.jpg',
      'assets/perfume/perfume-4.jpg',
    ],
    sizes: null,
    badges: [{ i: 'trophy', t: 'Bestseller' }, { i: 'wind', t: 'Sillage: Intense' }],
    related: ['perfume-1', 'perfume-3', 'perfume-4'],
  },
  'perfume-3': {
    vibe: 'perfume',
    name: 'Rose Incense',
    tag: 'New',
    price: 'SAR 380',
    desc: 'A paradox of delicate rose petals and bold incense smoke. For those who refuse to choose between soft and powerful.',
    images: [
      'assets/perfume/perfume-3.jpg',
      'assets/perfume/perfume-4.jpg',
      'assets/perfume/perfume-1.jpg',
    ],
    sizes: null,
    badges: [{ i: 'flower', t: 'Floral' }, { i: 'zap', t: 'New Season' }],
    related: ['perfume-1', 'perfume-2', 'perfume-4'],
  },
  'perfume-4': {
    vibe: 'perfume',
    name: 'Steel Vetiver',
    tag: 'Limited',
    price: 'SAR 490',
    desc: 'Cold steel opening gives way to earthy vetiver and leather in this limited-edition statement fragrance. Precision, bottled.',
    images: [
      'assets/perfume/perfume-4.jpg',
      'assets/perfume/perfume-3.jpg',
      'assets/perfume/perfume-2.jpg',
    ],
    sizes: null,
    badges: [{ i: 'zap', t: 'Limited Run' }, { i: 'droplets', t: 'Eau de Parfum' }],
    related: ['perfume-1', 'perfume-2', 'perfume-3'],
  },

  'shoes-1': {
    vibe: 'shoes',
    name: 'Street Runner Pro',
    tag: 'New Drop',
    price: 'SAR 650',
    desc: 'Engineered for the streets. Ultra-responsive cushioning, breathable mesh upper, and a silhouette that turns heads on every block.',
    images: [
      'assets/shoes/shoes-1.jpg',
      'assets/shoes/shoes-2.jpg',
      'assets/shoes/shoes-3.jpg',
    ],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    badges: [{ i: 'footprints', t: 'Premium Sole' }, { i: 'flame', t: 'New Drop' }, { i: 'zap', t: 'Limited' }],
    related: ['shoes-2', 'shoes-3', 'shoes-4'],
  },
  'shoes-2': {
    vibe: 'shoes',
    name: 'Neon Night Kicks',
    tag: 'Limited',
    price: 'SAR 780',
    desc: 'Glow up. Reflective neon detailing and a bold colourway built for those who own the night. Strictly limited.',
    images: [
      'assets/shoes/shoes-2.jpg',
      'assets/shoes/shoes-1.jpg',
      'assets/shoes/shoes-4.jpg',
    ],
    sizes: ['39', '40', '41', '42', '43', '44'],
    badges: [{ i: 'zap', t: 'Limited Edition' }, { i: 'moon', t: 'Night Edition' }],
    related: ['shoes-1', 'shoes-3', 'shoes-4'],
  },
  'shoes-3': {
    vibe: 'shoes',
    name: 'Urban Edge Lows',
    tag: 'Bestseller',
    price: 'SAR 590',
    desc: 'The everyday low-top that refuses to be ordinary. Vulcanised sole, premium leather upper, and a clean profile for maximum versatility.',
    images: [
      'assets/shoes/shoes-3.jpg',
      'assets/shoes/shoes-4.jpg',
      'assets/shoes/shoes-1.jpg',
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    badges: [{ i: 'trophy', t: 'Bestseller' }, { i: 'layers', t: 'Premium Leather' }],
    related: ['shoes-1', 'shoes-2', 'shoes-4'],
  },
  'shoes-4': {
    vibe: 'shoes',
    name: 'Classic Court Air',
    tag: 'Classic',
    price: 'SAR 420',
    desc: 'The timeless court silhouette, rebuilt for modern streets. Clean lines, durable canvas, and an air-cushion unit for all-day comfort.',
    images: [
      'assets/shoes/shoes-4.jpg',
      'assets/shoes/shoes-3.jpg',
      'assets/shoes/shoes-2.jpg',
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45', '46'],
    badges: [{ i: 'trophy', t: 'Classic Icon' }, { i: 'history', t: 'Court Heritage' }],
    related: ['shoes-1', 'shoes-2', 'shoes-3'],
  },
};

/* ═══════════════════════════════════════════════
   Vibe definitions (mirrors main.js)
   ═══════════════════════════════════════════════ */
const VIBES = {
  kids:    { bodyClass: 'vibe-kids' },
  perfume: { bodyClass: 'vibe-perfume' },
  shoes:   { bodyClass: 'vibe-shoes' },
};

/* ═══════════════════════════════════════════════
   Vibe background decorations per category
   ═══════════════════════════════════════════════ */
function buildDeco(vibe, container) {
  container.innerHTML = '';
  if (vibe === 'kids') {
    container.innerHTML = `
      <div class="deco-cloud deco-cloud--1"></div>
      <div class="deco-cloud deco-cloud--2"></div>
      <div class="deco-star deco-star--1">${icon('star', 30)}</div>
      <div class="deco-star deco-star--2">${icon('cloud', 34)}</div>
      <div class="deco-star deco-star--3">${icon('sparkles', 30)}</div>
      <div class="deco-bubble deco-bubble--1"></div>
      <div class="deco-bubble deco-bubble--2"></div>`;
  } else if (vibe === 'perfume') {
    container.innerHTML = `
      <div class="deco-particle deco-particle--1"></div>
      <div class="deco-particle deco-particle--2"></div>
      <div class="deco-particle deco-particle--3"></div>
      <div class="deco-particle deco-particle--4"></div>
      <div class="deco-smoke"></div>`;
  } else if (vibe === 'shoes') {
    container.innerHTML = `
      <div class="deco-grid"></div>
      <div class="deco-spotlight"></div>
      <div class="deco-line deco-line--1"></div>
      <div class="deco-line deco-line--2"></div>`;
  }
}

/* ═══════════════════════════════════════════════
   Apply vibe to body
   ═══════════════════════════════════════════════ */
function applyVibe(vibe) {
  const def = VIBES[vibe];
  if (!def) return;
  Object.values(VIBES).forEach(v => document.body.classList.remove(v.bodyClass));
  document.body.classList.add(def.bodyClass);
  document.body.dataset.vibe = vibe;

  // Update nav dots
  document.querySelectorAll('.vibe-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.vibe === vibe);
  });

  // Update nav active link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.target === vibe);
  });
}

/* ═══════════════════════════════════════════════
   Render product
   ═══════════════════════════════════════════════ */
function renderProduct(product) {
  if (!product) {
    document.getElementById('product-name').textContent = 'Product not found';
    return;
  }

  document.title = `${product.name} — Gulf Store`;

  // Apply vibe immediately
  applyVibe(product.vibe);

  // Build background deco
  const decoCont = document.getElementById('product-bg-deco');
  if (decoCont) buildDeco(product.vibe, decoCont);

  // Info
  document.getElementById('product-tag').textContent   = product.tag;
  document.getElementById('product-name').textContent  = product.name;
  document.getElementById('product-price').textContent = product.price;
  document.getElementById('product-desc').textContent  = product.desc;

  // Main image
  const mainImg = document.getElementById('main-img');
  mainImg.src = product.images[0];
  mainImg.alt = product.name;

  // Thumbnails
  const thumbs = document.getElementById('thumbs');
  thumbs.innerHTML = '';
  product.images.forEach((src, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('role', 'listitem');
    btn.className = `product-gallery__thumb${i === 0 ? ' active' : ''}`;
    btn.setAttribute('aria-label', `View image ${i + 1}`);
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${product.name} view ${i + 1}`;
    img.loading = 'lazy';
    btn.appendChild(img);
    btn.addEventListener('click', () => {
      mainImg.src = src;
      thumbs.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
    });
    thumbs.appendChild(btn);
  });

  // Size selector
  const sizeContainer = document.getElementById('size-selector');
  const sizesEl = document.getElementById('sizes');
  if (product.sizes && product.sizes.length > 0) {
    sizeContainer.style.display = 'block';
    sizesEl.innerHTML = '';
    product.sizes.forEach(size => {
      const btn = document.createElement('button');
      btn.textContent = size;
      btn.style.cssText = `
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: 2px solid var(--vibe-card-border);
        background: var(--vibe-card-bg);
        color: var(--vibe-text);
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
      `;
      btn.addEventListener('click', () => {
        sizesEl.querySelectorAll('button').forEach(b => {
          b.style.background = 'var(--vibe-card-bg)';
          b.style.borderColor = 'var(--vibe-card-border)';
          b.style.color = 'var(--vibe-text)';
        });
        btn.style.background   = 'var(--vibe-accent)';
        btn.style.borderColor  = 'var(--vibe-accent)';
        btn.style.color        = '#fff';
      });
      sizesEl.appendChild(btn);
    });
  } else {
    sizeContainer.style.display = 'none';
  }

  // Badges
  const badgesEl = document.getElementById('product-badges');
  badgesEl.innerHTML = '';
  (product.badges || []).forEach(badge => {
    const span = document.createElement('span');
    span.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.35rem 0.9rem;
      border-radius: 100px;
      background: var(--vibe-tag-bg);
      color: var(--vibe-tag-text);
      white-space: nowrap;
    `;
    const label = typeof badge === 'string' ? { t: badge } : badge;
    if (label.i) span.insertAdjacentHTML('beforeend', icon(label.i, 14));
    span.appendChild(document.createTextNode(label.t));
    badgesEl.appendChild(span);
  });

  // Related products
  const relatedGrid = document.getElementById('related-grid');
  relatedGrid.innerHTML = '';
  (product.related || []).forEach(relId => {
    const rel = CATALOGUE[relId];
    if (!rel) return;
    const article = document.createElement('article');
    article.className = 'product-card';
    article.dataset.vibe = rel.vibe;
    article.innerHTML = `
      <a href="product.html?id=${relId}&vibe=${rel.vibe}" class="product-card__link">
        <div class="product-card__img-wrap">
          <img src="${rel.images[0]}" alt="${rel.name}" class="product-card__img" loading="lazy" />
          <div class="product-card__overlay">
            <span class="product-card__quick">View Product</span>
          </div>
        </div>
        <div class="product-card__info">
          <p class="product-card__tag">${rel.tag}</p>
          <h3 class="product-card__name">${rel.name}</h3>
          <p class="product-card__price">${rel.price}</p>
        </div>
      </a>
    `;
    relatedGrid.appendChild(article);
  });
}

/* ═══════════════════════════════════════════════
   Boot — read URL params
   ═══════════════════════════════════════════════ */
(function boot() {
  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id');
  const vibeHint = params.get('vibe');

  // Apply vibe hint immediately (before product lookup) for fast paint
  if (vibeHint && VIBES[vibeHint]) applyVibe(vibeHint);

  const product = CATALOGUE[id] || null;
  renderProduct(product);
})();

/* ═══════════════════════════════════════════════
   Navbar hide-on-scroll
   ═══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar?.classList.toggle('scrolled', y > 50);
  navbar?.classList.toggle('hidden', y > lastY + 10 && y > 200);
  navbar?.classList.toggle('visible', y < lastY);
  lastY = y;
}, { passive: true });

const navStyle = document.createElement('style');
navStyle.textContent = `
  .navbar.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.12); }
  .navbar.hidden  { transform: translateY(-100%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), background var(--vibe-transition), border-color var(--vibe-transition); }
  .navbar.visible { transform: translateY(0); }

  /* Product page deco — position it */
  .product-page-deco {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }
  .product-layout,
  .products-section {
    position: relative;
    z-index: 1;
  }
`;
document.head.appendChild(navStyle);


/* ═══════════════════════════════════════════════
   Navbar menu + Explore (minimal bar in perfume / shoes vibes)
   ═══════════════════════════════════════════════ */
(function navMenu() {
  const btn = document.getElementById('navMenuBtn');
  const panel = document.getElementById('navMenuPanel');
  const explore = document.getElementById('navExplore');
  if (explore) {
    const sync = () => { explore.href = `index.html#${document.body.dataset.vibe || 'kids'}`; };
    sync();
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['data-vibe'] });
  }
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
