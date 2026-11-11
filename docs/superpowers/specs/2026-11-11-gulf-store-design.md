# Gulf Store — Design Spec

## Intent & Why

Gulf Store is a premium multi-category e-commerce storefront (kids clothes, perfumes, shoes) that uses **scroll-driven vibe transitions** as its signature UX mechanic. Each category owns a distinct visual world — typography, palette, particles/decorations, card style — and the entire site (navbar, background, hero, product cards) morphs smoothly as the user scrolls from one category zone into the next. The same vibe carries through into individual product pages, so the category identity persists throughout the shopping journey.

## Goals
- Premium, editorial feel — no generic e-commerce template look
- Each category has an unmistakably distinct visual identity
- Scroll transitions are smooth, non-jarring, and professional (not gimmicky)
- Product cards, navbar, hero all participate in the vibe shift
- Works on modern browsers; graceful static fallback for older ones

## Non-Goals
- No cart / checkout functionality (MVP)
- No watches category (images not provided)
- No backend / CMS

## Anti-Goals
- Jarring snap cuts between category vibes
- Cluttered layouts that undermine the premium positioning

## Constraints
- Pure HTML + CSS + JS (single or multi-file, no build step)
- Use only images provided in `assets/` folder
- Three categories: Baby Clothes, Perfume, Shoes

## Category Vibes

### 1 — Baby Clothes (Kids)
- Palette: Pastel purple `#A78BDB`, pink `#F9A8D4`, cream `#FFF8F0`, coral `#FF8A80`
- Typography: Rounded, playful (Nunito or Poppins)
- Decorations: Floating stars ⭐, cloud shapes, rainbow elements
- Cards: Soft pastel-colored rounded corners, playful hover
- Hero tagline: "Playful Pieces for Little Dreamers"

### 2 — Perfume
- Palette: Near-black `#0D0D0D`, dark charcoal `#1A1A2E`, gold `#C9A84C`, amber `#D4845A`
- Typography: Serif elegance (Playfair Display), wide letter-spacing
- Decorations: Subtle particle dots, dark smoke/blur overlays
- Cards: Dark glass-morphism panels, gold borders on hover
- Hero tagline: "Let Your Scent Speak First"

### 3 — Shoes
- Palette: Pure black `#000000`, electric purple `#8B5CF6`, white `#FFFFFF`, neon accent `#A855F7`
- Typography: Bold ultra-wide display (Bebas Neue or Impact-style), Japanese-style accents
- Decorations: Grid lines, spotlight beam, angular geometry
- Cards: Dark with purple glow, streetwear editorial
- Hero tagline: "Step Into Your Story"

## Architecture

Single `index.html` with inline or linked `style.css` and `main.js`. Sections:
1. Navbar (fixed, vibe-aware)
2. Hero (category-specific full-height panels stacked vertically)
3. Products grid (per category)
4. Footer

Vibe switching: IntersectionObserver watches each section, updates CSS custom properties on `:root` for smooth color/font transitions. View Transitions API wraps DOM class changes on the body for morph effects between states. CSS `animation-timeline: scroll()` drives subtle parallax per section.

## Approaches Considered

**A — Pure CSS scroll-driven (chosen):** CSS custom properties interpolated by scroll progress, `IntersectionObserver` JS fallback. Smooth, performant, compositor-thread safe. Chosen because it lets opacity/transform stay on the compositor.

**B — GSAP ScrollTrigger:** Powerful but adds a 100 kB+ dependency and a build step, overkill for this.

**C — Snap-scroll sections:** Would work but section snap feels rigid for a premium brand; free-scroll with gentle transitions is more luxurious.
