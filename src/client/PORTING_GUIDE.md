# Porting Guide: Gatsby (Bootstrap) to Astro (Tailwind)

This document describes the process for porting components from the Gatsby site (localhost:8000) to the Astro site (localhost:4321). It serves as a reference for LLMs and developers working on future component ports.

## Stack Overview

|               | Old Site                                        | New Site                                              |
| ------------- | ----------------------------------------------- | ----------------------------------------------------- |
| Framework     | Gatsby                                          | Astro                                                 |
| Styling       | Bootstrap 4                                     | Tailwind CSS v4                                       |
| CSS approach  | Class-based (Bootstrap utilities + custom SCSS) | Utility-first (Tailwind classes)                      |
| Spacing scale | Arbitrary (Bootstrap defaults)                  | 4px grid (`--spacing: 4px` in `global.css`)           |
| Breakpoints   | Bootstrap 4 defaults                            | Matching Bootstrap 4: sm=576, md=768, lg=992, xl=1200 |

## Process

### 1. Inspect the Gatsby component at each breakpoint

Use Playwright MCP to navigate to the Gatsby site and extract computed styles at each relevant breakpoint. Work **mobile-first**, then `lg`, then `xl`.

**Important:** Do NOT use screenshots (`browser_take_screenshot`) for style comparison — they are inefficient and imprecise. Instead, use `browser_evaluate` with `getComputedStyle()` to extract exact pixel values. This gives you concrete numbers to map to Tailwind classes, rather than eyeballing from images.

```js
// Example: extracting nav styles
const nav = document.querySelector("nav");
const cs = getComputedStyle(nav);
return {
  padding: cs.padding,
  maxWidth: cs.maxWidth,
  height: cs.height,
  fontSize: cs.fontSize,
  fontWeight: cs.fontWeight,
  color: cs.color,
};
```

Key properties to capture:

- **Layout**: `display`, `flexDirection`, `alignItems`, `justifyContent`
- **Spacing**: `padding`, `margin`, `gap`
- **Sizing**: `width`, `height`, `maxWidth`, `minWidth`
- **Typography**: `fontSize`, `fontWeight`, `lineHeight`, `textTransform`, `color`
- **Borders**: `border`, `borderRadius`
- **Effects**: `boxShadow`, `backgroundColor`

Do this for every meaningful element: container, links, buttons, dropdowns, images, etc.

### 2. Snap values to the 4px spacing grid

The Astro site uses `--spacing: 4px`, so all Tailwind spacing utilities are multiples of 4px. Map Gatsby values to the nearest multiple:

| Gatsby value | Nearest 4px | Tailwind class           |
| ------------ | ----------- | ------------------------ |
| 5px          | 4px         | `1` (e.g. `mr-1`)        |
| 7px          | 8px         | `2` (e.g. `ml-2`)        |
| 13px         | 12px        | `3` (e.g. `border-t-12`) |
| 15px         | 16px        | `4` (e.g. `px-4`)        |
| 25px         | 24px        | `6` (e.g. `py-6`)        |
| 30px         | 32px        | `8` (e.g. `py-8`)        |
| 50px         | 48px        | `12` (e.g. `h-12`)       |

**Rules:**

- Prefer the nearest 4px value. A 1-2px deviation is acceptable.
- **Do not use fixed units in Tailwind classes.** No `p-[25px]`, no `leading-[1.7rem]`, no `w-[150px]`. Use the scale: `p-6`, `leading-7`, `w-38`. This is a hard rule, not a preference.
- Bracket notation `[value]` is only allowed when the value is not a length at all (a `calc()`, a `clip-path`, a shadow) or when Tailwind has no utility for the property. A 0.8px difference is never a reason, and neither is that difference adding up over a list. Accept the drift and note it in the summary instead.
- When Tailwind has a built-in class (e.g. `border-l-8` for 8px), use it instead of `border-l-[8px]`.
- The one place exact Gatsby values are kept is the `.cms-content` typography in `global.css`, because font size decides where CMS text wraps. That is plain CSS, not a utility class, and it is the only exception.

### 3. Map Bootstrap patterns to Tailwind

Common translations:

| Bootstrap                | Tailwind                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| `container`              | `mx-auto max-w-240 lg:max-w-240 xl:max-w-285` (with `px-4`)               |
| `navbar-expand-lg`       | Show/hide with `hidden lg:flex` / `lg:hidden`                             |
| `navbar-light`           | Use `text-dark` on links                                                  |
| `dropdown` (hover)       | `relative group` on `<li>`, `hidden group-hover:block` on menu            |
| `dropdown-menu`          | `absolute top-full bg-white border rounded py-2 shadow-md z-50`           |
| `dropdown-item`          | `block py-1 px-6 text-base text-dark hover:text-primary hover:bg-gray-50` |
| `nav-link`               | `text-dark text-base p-2 no-underline hover:text-primary`                 |
| `collapse show` (mobile) | Toggle `hidden` class via JS                                              |

### 4. Handle responsive behavior

- **Desktop dropdowns**: Use CSS `group-hover` — no JavaScript needed.
- **Mobile menus**: Use JavaScript click handlers to toggle `hidden` class.
- **Mobile submenus**: Use a dedicated toggle button per item with JS.

### 5. Extract reusable components

When a pattern repeats 3+ times, extract it into an Astro component. Examples:

- `SolutionSlideshow.astro` — the cnc-block image carousel: sliding track, dots overlapping the text block, triangle arrows, and a `<dialog>` lightbox replacing ekko-lightbox.
- `NavDropdown.astro` — handles both desktop (hover) and mobile (click-toggle) dropdown in one component, with props for:
  - `label`: display text
  - `href?`: optional link URL (omit for non-link labels like language switcher)
  - `items`: array of `{ url, text }`
  - `alignRight?`: right-align the dropdown panel

The component renders **two** `<li>` elements — one with `hidden lg:block` for desktop and one with `lg:hidden` for mobile. This keeps the markup co-located and the parent template clean.

### 6. Verify the result

Use `scripts/compare.mjs`. It loads the same pages on both sites at 375, 600, 800, 992 and 1200px, runs a probe in each, and prints every value that differs by more than 2px. Both dev servers must already be running; the script never starts them.

Generic mode reports rects and common computed styles for every element a selector matches:

```sh
bun run compare --selector "footer h4" --pages /solutions/,/team/
```

For anything with structure (gaps between siblings, a lead column, a grid) write a probe under `scripts/probes/` and pass it. The probe is a default-exported function that runs inside the page and returns a plain object. See `scripts/probes/intro.mjs`.

```sh
bun run compare --probe scripts/probes/intro.mjs --pages /over-ons/,/team/,/solutions/
```

Paste the diff in the summary. Acceptable deviations:

- 1-2px on spacing (due to 4px grid snapping)
- 2-3px on computed height (cascading from snapped child sizes)
- Exact match expected on: font-size, font-weight, color, text-transform, max-width

Measure what the old site renders, not what its stylesheet says. More than once a Sass rule was overridden by a more specific one and the rendered value was the one to copy.

### 7. Interaction behavior

Always check interactive states:

- Hover states on desktop nav links and dropdown items
- Click-to-toggle behavior on mobile hamburger and submenu arrows
- Dropdown open/close behavior
- Arrow rotation on submenu toggle (use `rotate-180` class toggle)

## CMS Images — `getImage()` Pipeline

All images served from the Umbraco backend (`cncsolutions-backend.azurewebsites.net`) **must** be processed through Astro's image pipeline at build time. This eliminates the runtime dependency on the backend — the production site serves only local, optimized files.

The domain is already authorized in `astro.config.mjs`:

```js
image: {
  domains: ["cncsolutions-backend.azurewebsites.net"],
}
```

### `getImageParams()` helper

CMS image URLs include `width` and `height` query parameters (e.g. `?width=500&height=333`). The `getImageParams()` helper in `src/lib/umbraco.ts` parses these to pass explicit dimensions to `getImage()`, avoiding the extra network round-trip that `inferSize` requires. When the URL lacks these params, it falls back to `inferSize: true`.

```ts
import { getImageParams } from "../lib/umbraco";
import { getImage } from "astro:assets";

// Returns { src, width, height } or { src, inferSize: true }
const processed = await getImage(getImageParams(remoteUrl));
```

**Always use `getImageParams()` instead of `inferSize: true` directly.**

### Single-URL images

For images with a single remote URL (e.g. team photos, news images), use `getImage()` with `getImageParams()` in the frontmatter and pass the result's `.src` to a plain `<img>` tag:

```astro
---
import { getImage } from "astro:assets";
import { getImageParams } from "../lib/umbraco";

const processed = await getImage(getImageParams(remoteUrl));
---

<img src={processed.src} alt="..." class="w-full" />
```

### Responsive `<picture>` with multiple URLs

The CMS provides different image URLs per breakpoint (different crops/sizes, not just formats). Use `getImage()` with `getImageParams()` for each variant in the frontmatter, then use the local URLs in `<source>` and `<img>` tags:

```astro
---
import { getImage } from "astro:assets";
import { getImageParams } from "../lib/umbraco";

const mobile = await getImage(getImageParams(data.mobile));
const tablet = await getImage(getImageParams(data.tablet));
const desktop = await getImage(getImageParams(data.desktop));
---

<picture>
  <source media="(min-width: 62em)" srcset={desktop.src} />
  <source media="(min-width: 48em)" srcset={tablet.src} />
  <img src={mobile.src} alt="..." class="w-full" />
</picture>
```

### Batch processing in loops

When images are inside a `.map()` loop (e.g. news thumbnails, team members), process all images upfront in the frontmatter with `Promise.all`, then reference them by index in the template:

```astro
---
import { getImageParams } from "../lib/umbraco";

const processedImages = await Promise.all(
  items.map(async (item) => {
    if (!item.image) return null;
    return getImage(getImageParams(item.image));
  }),
);
---

{items.map((item, i) => <img src={processedImages[i]?.src} alt={item.title} />)}
```

### Important: Do NOT use plain `<img src={remoteUrl}>`

Plain `<img>` tags with remote URLs bypass Astro's pipeline entirely. The images will still reference the backend domain in the built output. Always use `getImage()` (or Astro's `<Image>` component) for CMS images.

Local assets (logos, icons, decorative images) imported via `import` statements are already handled by Astro's build — no changes needed for those.

## Dynamic CMS Content (`.cms-content`)

Global typography styles (`font-size`, `line-height`, `margin`) for `p`, `ul li`, and `ol li` are scoped under the `.cms-content` class in `global.css`. This prevents them from clashing with Tailwind utility classes.

**Rule:** Any dynamic HTML from Umbraco rendered via `set:html` must be wrapped in a container with `class="cms-content"`:

```astro
{content && <div class="cms-content" set:html={content} />}
```

Without `.cms-content`, paragraphs and list items inside CMS content will lack proper font sizing and spacing. Conversely, keeping these styles global would override Tailwind utilities like `m-0` or `text-xs` on regular elements.

## Theme Reference

Defined in `src/styles/global.css`:

```css
@theme {
  --color-primary: #92c256;
  --color-dark: #414042;
  --color-secondary: #6a8dde;
  --color-danger: #e01d31;
  --color-warning: #d69d36;
  --color-success: #66d4ac;
  --color-body: rgba(65, 64, 66, 1);
  --font-body: "Hind", sans-serif;
  --spacing: 4px;

  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}
```

## Lessons

Things that were wrong once. Add to this list whenever the user corrects a port or a comparison surprises you.

- **Bootstrap container caps at every breakpoint**: 540px at sm, 720px at md, 960px at lg, 1140px at xl. Use `sm:max-w-135 md:max-w-180 lg:max-w-240 xl:max-w-285`. Leaving out sm or md makes content wider than the old site on tablets.
- **Bootstrap rows cancel the container padding** with negative margins. A `.row` inside `.container` needs `-mx-4` on the flex wrapper, or the columns start 16px too far in.
- **Bootstrap spacing scale is not the Tailwind one.** `mb-4` is 1.5rem (24px) in Bootstrap, so it maps to `mb-6`. `mb-3` is 1rem, `mb-5` is 3rem.
- **Unscoped rules hide in page stylesheets.** `products-overview.sass` sets `#lead` to 50% width and 55px bottom margin from lg up, and that applies to every page with a lead. Grep all Sass files for an id or class before assuming a rule is page-local.
- **The intro lead is left-aligned** and half width from lg. The above-title is lowercased everywhere except the contact page.
- **Tailwind's reset removes list markers.** CMS content needs `list-disc` / `list-decimal` and `pl-10`, or bullets vanish.
- **CMS text uses Bootstrap's 1.1rem / 1.7rem.** Rounding to 18px / 28px changes where lines wrap and adds whole lines on narrow containers.
- **Bootstrap sets `ul` margin-bottom to 1rem** and `li` line-height comes from the global 1.7rem rule. A list ported as `m-0` with `leading-6` loses about 35px over six items.
- **NavDropdown renders a desktop and a mobile `<li>` per use**, so the desktop list also contains hidden mobile items. Scope DOM queries to `#nav-mobile-menu` or the probe hits the hidden copy.
- **Tailwind `grid-cols-N` is `repeat(N, minmax(0, 1fr))`, Bootstrap-era `1fr` is `minmax(auto, 1fr)`.** With fixed-width items (the 300px product cards at lg) the old site's tracks grow to the item width and overflow the container; Tailwind's tracks stay at 296px and the items overflow their track instead. Use `grid-cols-[repeat(3,minmax(auto,1fr))]` to reproduce it.
- **Fractional scale steps are allowed when a whole line would wrap differently.** The 318px product card is `max-w-79.5` and its 98%-wide content box is `mx-0.75`, because snapping to 320px and 4px moved a line break on the French mobile page. Still no bracket lengths.
- **Bootstrap carousels resize to the active slide** because inactive slides are `display: none`. A sliding track keeps the tallest slide's height, so the probe shows a taller list on mobile whenever the first slide is not the tallest. Accepted, since a fixed height avoids the page jumping between slides.
- **A `display: contents` wrapper lets one list be a flex track on mobile and a grid from md up.** The wrapper is the 100%-wide slide below md and disappears at md, so the card itself becomes the grid item and `m-auto` centers it in the row like the old site. The track's `overflow-hidden` must become `md:overflow-visible`, or the last card of a row, which overflows the container by 10px at lg like the old site, loses its right border.
- **`compare` reports Tailwind shadows as a five-part string** (`shadow-*` composes ring and inset variables). When only the last part matches the Gatsby value, the shadow is identical.
- **Tailwind v4 translate utilities set the `translate` property, not `transform`.** A probe that reads `transform` sees `none` even though the element moved. Compare positions (rect top) instead.
- **Bootstrap carousel indicators sit 1rem above the bottom edge** (`margin-bottom: 1rem`) and each dot carries 10px transparent borders top and bottom, so the list box is 30px tall while the visible dot is 10px. Reproduce with `bottom-4 py-2.5` and compare the visible dot, not the list.
- **Old-site bugs are not always worth copying.** The Gatsby footer container was left-aligned between sm and lg. Reproduce, flag it, and let the user decide.
- **Long single words in the 40px solution heading overflow the 370px text column** between lg and xl on both sites ("isolatieonderdelen"). Fixed with `lg:break-words`; below lg the heading is a 66% box that may overflow into the column without harm, and a plain `break-words` there split "mogelijkheden" at 375px.

## Checklist for each component port

- [ ] Inspect Gatsby component at mobile, lg, and xl breakpoints
- [ ] Record all computed styles (spacing, typography, colors, borders)
- [ ] Map values to 4px grid, noting acceptable deviations
- [ ] Write Astro component using Tailwind utility classes
- [ ] Extract repeated patterns into sub-components
- [ ] Verify desktop hover behavior
- [ ] Verify mobile click/toggle behavior
- [ ] Run `scripts/compare.mjs` at 375, 600, 800, 992 and 1200 and paste the diff
- [ ] Re-verify every page that uses any shared component you changed
- [ ] Process all CMS images through `getImage()` — no plain `<img src={remoteUrl}>`
- [ ] Check for Tailwind warnings (prefer built-in classes over bracket notation)
- [ ] Add anything that surprised you to the Lessons section
