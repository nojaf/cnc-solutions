# Gatsby to Astro Migration Plan

## Overview

Migrate the Gatsby 4 frontend (`src/client/`) to an Astro project, using a git worktree for side-by-side development. This is a full rewrite — we drop Bootstrap, jQuery, and React in favor of Astro components with Tailwind CSS.

## Worktree Setup

- Create branch `astro` from `master`
- Add git worktree at `../cnc-solutions-astro` on the `astro` branch
- Scaffold a fresh Astro project inside `src/client/` of the worktree
- Both folders open in the IDE for constant comparison

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Styling | Tailwind CSS | Utility-first, consistent design tokens, no more 18 SASS partials |
| JS framework | None (Astro islands only where needed) | Site is 95% static HTML |
| Carousel | CSS scroll-snap or lightweight lib | Drop jQuery + Bootstrap JS dependency |
| Lightbox | Modern vanilla JS lightbox (e.g. GLightbox) | No jQuery dependency |
| Dropdowns | CSS + minimal JS | Navigation dropdowns don't need Bootstrap |
| Contact form | Astro island (vanilla JS or small Preact component) | Only truly interactive piece |
| Cookie consent | Vanilla JS island | Simple show/hide + localStorage |
| Image handling | Astro `<Image>` / `<Picture>` with authorized remote domain | All CMS images downloaded + optimized at build time, no runtime dependency on backend |
| Page transitions | Astro View Transitions (`ClientRouter`) | SPA-like navigation without full page reloads |

## Brand Tokens (Tailwind 4 CSS-first config)

Tailwind 4 uses `@theme` directives in CSS instead of `tailwind.config.js`. Custom tokens go in your main CSS file:

```css
@theme {
  --color-primary: #92C256;
  --color-dark: #414042;
  --color-secondary: #6A8DDE;
  --font-body: "Hind", sans-serif;
}
```

This generates utility classes like `bg-primary`, `text-dark`, `text-secondary`, `font-body` automatically.

---

## Migration Checklist

### Phase 0: Project Setup
- [ ] Create `astro` branch and git worktree:
  ```bash
  cd /Users/nojaf/Projects/cnc-solutions
  git branch astro
  git worktree add ../cnc-solutions-astro astro
  ```
  This creates `/Users/nojaf/Projects/cnc-solutions-astro` checked out on the `astro` branch.
  Open both folders in your IDE for side-by-side comparison.
- [ ] Scaffold Astro project in `src/client/` (remove all Gatsby files)
- [ ] Install Tailwind CSS 4 integration (`@astrojs/tailwind`)
- [ ] Configure brand tokens via `@theme` directive in main CSS file (colors, fonts)
- [ ] Configure `image.domains` in `astro.config.mjs` to authorize `cncsolutions-backend.azurewebsites.net` — enables Astro to download and optimize all CMS images at build time
- [ ] Copy `static/` contents to `public/` (videos, CNAME, scripts, email logos)
- [ ] Copy `src/images/` to an appropriate location (e.g. `src/assets/`)
- [ ] Set up Google Font (Hind) loading

### Phase 1: Data Layer (Content Layer API + SignalR)

The Gatsby `sourceNodes` hook fetched the full Umbraco tree, walked it recursively, and created typed GraphQL nodes per content alias. In Astro, this maps to the **Content Layer API** (Astro 5+): custom loaders that fetch from the API and return typed entries queryable via `getCollection()`.

**Single fetch, shared cache:** The Umbraco tree is fetched once per build/dev-start and cached in memory. All collection loaders pull from this shared cache to avoid overfetching.

**Dev-time live updates via SignalR:** An Astro integration connects to the Umbraco SignalR hub (`GatsbyHub`) during `astro dev`. When `nodePublished` fires, the integration clears the tree cache and calls Astro's `refreshContent()` API to re-run all loaders — same DX as the current Gatsby setup.

- [ ] Create `src/lib/umbraco.ts` — single cached fetch of the Umbraco tree, tree-walking helpers, node filtering by alias
- [ ] Port the `pageInCulture()` helper (resolve `{nl,en,fr}` objects to a single culture)
- [ ] Port the `wrapIfSingleton()` helper
- [ ] Build a URL lookup map (replaces `UmbracoUrl` GraphQL nodes)
- [ ] Create `src/content.config.ts` — define content collections with custom loaders:
  - `home`, `solutions`, `solution`, `products`, `product`, `cases`, `case`, `about`, `team`, `news`, `newsPage`, `contact`
  - Each loader calls `getTree()` (cached), filters nodes by alias, returns typed entries
  - Define Zod schemas per collection for type safety
- [ ] Create `src/integrations/umbraco-signalr.ts` — Astro integration (dev-only):
  - On `astro:server:start`, connect SignalR client to the Umbraco `GatsbyHub`
  - On `nodePublished`, clear the tree cache and call `refreshContent()` to re-run loaders
- [ ] Test data fetching by logging output during `astro dev`
- [ ] Test SignalR live refresh: publish a node in Umbraco and verify Astro picks up the change

### Phase 2: Base Layout & Shared Components
- [ ] Create `src/layouts/BaseLayout.astro` — HTML shell with `<head>`, viewport meta, font loading, analytics scripts (gtag, FB pixel), and `<slot />`
- [ ] Create `src/components/Navigation.astro` — responsive nav with dropdowns for Solutions, Products, Cases, About; language switcher; mobile hamburger menu. Port from `navigation.js`
- [ ] Create `src/components/Footer.astro` — 3-column footer with links and Flanders Investment logo. Port from `footer.js`
- [ ] Create `src/components/SEO.astro` — accepts title, description, keywords, lang; renders `<title>`, `<meta>` tags, Open Graph, Twitter card tags. Port from `seo.js`
- [ ] Create `src/components/CookieConsent.astro` — cookie banner with accept/reject, localStorage, gtag/fbq opt-out. Port from `cookies.js`
- [ ] Create `src/components/PageIntroduction.astro` — reusable intro section. Port from `pageIntroduction.js`
- [ ] Create `src/components/Header.astro` — responsive `<picture>` header image. Port from `header.js`
- [ ] Create `src/components/BottomEdge.astro` — decorative edge. Port from `bottomEdge.js`

### Phase 3: Interactive Components (Islands)
- [ ] Create a carousel/slider component (CSS scroll-snap or tiny vanilla JS lib) — replaces all Bootstrap carousels
- [ ] Create a lightbox component (GLightbox or similar) — replaces ekko-lightbox
- [ ] Create `src/components/SlideShow.astro` + `SlideShowSlide.astro` — port from `slideShow.js` / `slideShowSlide.js`
- [ ] Create `src/components/Video.astro` — YouTube embed with responsive aspect ratio. Port from `video.js`
- [ ] Create `src/components/ContactForm.astro` (or island) — controlled form with validation, POST to Umbraco API. Port from `contact.js`

### Phase 4: Routing & Catch-All Page

All routing is handled by a single catch-all `src/pages/[...slug].astro`. This mirrors how Gatsby's `createPages` works — one function that loops over all content types and cultures, mapping each to a template. The catch-all's `getStaticPaths()` iterates over all collections and all 3 cultures, generating a path entry for each. The node's `alias` (content type) determines which template component renders.

**No Astro i18n config needed** — URLs are fully CMS-driven (e.g. `/over-ons/`, `/en/about-us/`, `/fr/a-propos-de-nous/`). We don't use predictable `/[lang]/[slug]` patterns; we just generate pages at the exact URLs Umbraco provides.

```
src/pages/
  [...slug].astro          ← catch-all: getStaticPaths() + template dispatch
  404.astro

src/templates/
  Home.astro               ← port from templates/index.js
  Solutions.astro           ← port from templates/solutions.js
  Solution.astro            ← port from templates/solution.js
  Products.astro            ← port from templates/products.js
  Product.astro             ← port from templates/product.js
  Cases.astro               ← port from templates/cases.js
  Case.astro                ← port from templates/case.js
  About.astro               ← port from templates/about.js
  Team.astro                ← port from templates/team.js
  News.astro                ← port from templates/news.js
  NewsPage.astro            ← port from templates/news-page.js
  Contact.astro             ← port from templates/contact.js
```

- [ ] Create `src/pages/[...slug].astro` with `getStaticPaths()` — loops over all content collections × 3 cultures, generates paths at CMS-provided URLs, dispatches to template component via `alias` → `templateMap` lookup
- [ ] Create `src/pages/404.astro`
- [ ] **Home** (`src/templates/Home.astro`) — hero video, solutions grid, home rows, cases carousel, news carousel
- [ ] **Solutions** (`src/templates/Solutions.astro`) — tile grid
- [ ] **Solution** (`src/templates/Solution.astro`) — grouped content blocks with slideshows, text, videos by row
- [ ] **Products** (`src/templates/Products.astro`) — carousel mobile, grid desktop, type/variants/application metadata
- [ ] **Product** (`src/templates/Product.astro`) — image rows, feature list, CTA
- [ ] **Cases** (`src/templates/Cases.astro`) — tile grid
- [ ] **Case** (`src/templates/Case.astro`) — alternating media/text rows, quote rows
- [ ] **About** (`src/templates/About.astro`) — alternating image/text rows, optional video
- [ ] **Team** (`src/templates/Team.astro`) — member grid with photos
- [ ] **News** (`src/templates/News.astro`) — article thumbnails with date, title, lead
- [ ] **NewsPage** (`src/templates/NewsPage.astro`) — composable blocks: text, image, video; prev/next navigation
- [ ] **Contact** (`src/templates/Contact.astro`) — address/social sidebar + contact form
- [ ] Verify language switcher links resolve correctly across all pages
- [ ] Verify URL structure matches the existing Gatsby site exactly (to preserve SEO)

### Phase 5: Analytics & Third-Party Scripts
- [ ] Google Tag Manager (`GTM-PX6K6L4`) — add gtag script to BaseLayout head
- [ ] Facebook Pixel (`570426677009391`) — add pixel script to BaseLayout
- [ ] FontAwesome Kit (`aadbaa5e13`) — add kit script to BaseLayout head
- [ ] Cookie consent integration — wire accept/reject to gtag opt-out + fbq consent revoke

### Phase 6: Polish & QA
- [ ] Visual comparison: walk through every page type in all 3 languages, compare old vs new
- [ ] Test contact form submission
- [ ] Test cookie consent accept/reject flow
- [ ] Test responsive behavior (mobile nav, carousels, image breakpoints)
- [ ] Test lightbox on slideshow images
- [ ] Verify all external links and internal navigation
- [ ] Check meta tags / Open Graph / Twitter cards with a preview tool
- [ ] Lighthouse audit (performance, accessibility, SEO)
- [ ] Test build (`astro build`) — verify output is fully static

### Phase 7: Deployment
- [ ] Update deploy script (currently `gh-pages` based)
- [ ] Ensure `CNAME` file is in `public/`
- [ ] Verify production build and deploy
- [ ] Remove old Gatsby `src/client/` from master once confident

---

## File Mapping Reference

| Gatsby file | Astro equivalent |
|---|---|
| `gatsby-config.js` | `astro.config.mjs` |
| `gatsby-node.js` `sourceNodes` | `src/content.config.ts` (Content Layer loaders) + `src/lib/umbraco.ts` (shared fetch/cache) |
| `gatsby-node.js` `createPages` | `getStaticPaths()` in `src/pages/[...slug].astro` — loops collections × cultures, dispatches to template components |
| `gatsby-node.js` SignalR listener | `src/integrations/umbraco-signalr.ts` (dev-only, calls `refreshContent()`) |
| `src/html.js` | `src/layouts/BaseLayout.astro` |
| `src/components/layout.js` | `src/layouts/BaseLayout.astro` |
| `src/components/seo.js` | `src/components/SEO.astro` (or inline in layout) |
| `src/components/navigation.js` | `src/components/Navigation.astro` |
| `src/components/footer.js` | `src/components/Footer.astro` |
| `src/components/cookies.js` | `src/components/CookieConsent.astro` |
| `src/components/header.js` | `src/components/Header.astro` |
| `src/components/pageIntroduction.js` | `src/components/PageIntroduction.astro` |
| `src/components/slideShow.js` | `src/components/SlideShow.astro` |
| `src/components/slideShowSlide.js` | `src/components/SlideShowSlide.astro` |
| `src/components/video.js` | `src/components/Video.astro` |
| `src/components/bottomEdge.js` | `src/components/BottomEdge.astro` |
| `src/components/image.js` | (drop — unused) |
| `src/selectors/index.js` | `src/lib/umbraco.ts` (helpers) |
| `src/templates/*.js` | `src/templates/*.astro` (components, not pages — rendered by catch-all) |
| `src/styles/main.sass` + partials | Tailwind utilities + scoped styles where needed |
| `static/*` | `public/*` |

## Notes

- The `.NET backend` in `src/server/` is untouched — we only migrate the frontend.
- The SignalR live-reload is preserved via an Astro integration that listens to `nodePublished` and calls `refreshContent()`. This is dev-only — production builds are triggered by webhook or manual rebuild.
- The `ramda` dependency will be dropped — replaced with plain JS/TS.
- All CMS images (remote URLs from Umbraco) will be processed by Astro's `<Image>` / `<Picture>` components at build time. By authorizing the backend domain, Astro downloads, optimizes, and outputs them as local files — the production site has no runtime dependency on the Umbraco backend for images.
- **View Transitions are enabled** via `<ClientRouter />` in `BaseLayout.astro`. This means client-side navigation swaps page content without a full reload. All `<script>` blocks in components must wrap their logic in `document.addEventListener("astro:page-load", () => { ... })` — this event fires on both initial load and after each client-side navigation. Without it, scripts only run once on the first page load and won't reinitialize when navigating to a new page.
