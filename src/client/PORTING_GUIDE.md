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
- Font-size is the one property kept exact, because it decides where text wraps. Tailwind's type ramp was never on the 4px grid (`text-lg` is 18px, `text-3xl` is 30px), so snapping does not apply to it. When the Gatsby size has no step in the ramp within 1px, add a `--text-<px>` token to `@theme` in `global.css` and use that (`lg:text-40`). The theme block is the inventory of every off-ramp size. Still no bracket lengths. `.cms-content` keeps its values in plain CSS for the same reason.
- Inside a bracket that is allowed (a `calc()`, a grid template), write grid lengths as `--spacing(8)` rather than `32px`, so the value follows the scale.

### 3. Map Bootstrap patterns to Tailwind

Common translations:

| Bootstrap                | Tailwind                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| `container`              | `mx-auto px-4 sm:max-w-135 md:max-w-180 lg:max-w-240 xl:max-w-285`        |
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

- `Carousel.astro` — every Bootstrap carousel on the site (home cases, home news, mobile solutions, solution slideshows): sliding track, dots overlapping the content below, 15% control strips with triangle arrows. `lightbox` opens the desktop crop in a `<dialog>` gallery (replacing ekko-lightbox) instead of following the slide's `href`.
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

`GATSBY_URL` and `ASTRO_URL` override the two servers. That turns the script into a regression check between two Astro builds, for instance the previous commit served with `astro preview --port 4323` against the working tree on 4322:

```sh
GATSBY_URL=http://localhost:4323 ASTRO_URL=http://localhost:4322 bun run compare --selector "body *" --limit 3000 --pages /,/team/
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

{items.map((item, i) => (
  <img src={processedImages[i]?.src} alt={item.title} />
))}
```

### Important: Do NOT use plain `<img src={remoteUrl}>`

Plain `<img>` tags with remote URLs bypass Astro's pipeline entirely. The images will still reference the backend domain in the built output. Always use `getImage()` (or Astro's `<Image>` component) for CMS images.

Local assets (logos, icons, decorative images) imported via `import` statements are already handled by Astro's build — no changes needed for those.

## CMS Files (PDF brochures)

MediaPicker fields can hold files as well as images. PDFs go through `src/pages/downloads/[...file].pdf.ts`, a static endpoint that walks the tree with `collectPdfUrls()` and fetches each file at build time, so the built site does not call the backend for them. In templates, link with `mediaFileHref(remoteUrl)`, which maps `https://.../media/x/y.pdf` to `/downloads/x/y.pdf` and passes other URLs through. Same-origin links also make the `download` attribute work; browsers ignore it cross-origin.

## Contact form (Cloudflare Turnstile)

`ContactController.cs` rejects any post to `/umbraco/api/contact/post` whose
`turnstileToken` does not verify, so the form only works with a Turnstile
widget. Both keys live on the contact page in Umbraco: `turnstileSiteKey` is
read by the template, `turnstileSecretKey` by the backend. Nothing is
configured in the repo.

`Contact.astro` loads `api.js?render=explicit` with `is:inline`, polls for
`window.turnstile`, and renders the widget into `#turnstile-widget` on
`astro:page-load`. On `localhost` it swaps in Cloudflare's always-passing test
key `1x00000000000000000000AA`, because the real key rejects the hostname.
The submit handler reads `getResponse(widgetId)`, refuses to post without a
token, and calls `reset()` only after a failure, since a token is single use.

The test key's dummy token cannot verify against the real secret, so a local
submission always ends on the error text and never sends mail. To test the
whole flow for real, open `/contacteer-ons/?turnstile=live`, which uses the
real site key on localhost. That needs `localhost` added to the widget's
allowed hostnames in the Cloudflare dashboard (without it Turnstile answers
error `110200`, unknown domain) and it sends a real email to the contact
page's `formRecipient`. The flag is ignored anywhere but localhost.

The backend's own contact settings (`tenantId`, `clientId`, `clientSecret`,
`senderEmail`, `formRecipient`, `turnstileSecretKey`) are filtered out of the
tree export in `Graph.fs`, because `/umbraco/api/graph/tree` is public. Until
that backend build is deployed they still arrive in the tree and land in
`.astro/data-store.json` (gitignored, never in `dist/`). Either way, do not
render CMS fields blindly on this page.

## Missing CMS media

A media file deleted from Umbraco makes `getImage()` throw during image generation and fails the whole build. `getTree()` in `src/lib/umbraco.ts` therefore checks every distinct media file once with a HEAD request (about 200, under two seconds) and rewrites any reference that returns 404 to `/media-missing.svg`, a grey placeholder in `public/`. Astro passes local public paths through `getImage()` untouched, so nothing downstream changes. The build log prints a `[umbraco]` warning listing the broken files; treat that as a bug to report to the content team, not as a fixed problem.

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
- **Every Bootstrap carousel on the old site shares one chrome** (10px dots 50px below the image, 15% control strips, 15x20 triangle icons). The first home page port approximated it with in-flow dots and chevrons, which made the carousel 59px taller. Use `Carousel.astro` for all of them and check with `scripts/probes/carousel.mjs`.
- **Old-site bugs are not always worth copying.** The Gatsby footer container was left-aligned between sm and lg. Reproduce, flag it, and let the user decide.
- **Long single words in the 40px solution heading overflow the 370px text column** between lg and xl on both sites ("isolatieonderdelen"). Fixed with `lg:break-words`; below lg the heading is a 66% box that may overflow into the column without harm, and a plain `break-words` there split "mogelijkheden" at 375px.
- **`.cms-content p` in `global.css` is unlayered, so no utility class can override it** (Tailwind utilities live in `@layer utilities`, and unlayered rules always win). To restyle CMS paragraphs on one page, add a scoped `<style>` with `@reference "../styles/global.css"`, target `.wrapper .cms-content :global(p)` for higher specificity, and `@apply` scale utilities there. `Product.astro` does this for the highlight and more-info paragraphs.
- **Gatsby Sass rules on bare elements hit the CMS wrapper too.** `#features .body div { padding: 0 10px }` on the product page applies to the cell _and_ to the `<div dangerouslySetInnerHTML>` inside it, so paragraphs sit 20px in from the heading. Reproduce with `md:px-2.5` on both the cell and the `cms-content` div.
- **Dead Sass rules are easy to port by accident.** `product-detail.sass` sets the feature `h4` to 20px at xl, but the md rule `#features .body div h4` is more specific and keeps it at 16px. The rendered value wins; the xl rule was dropped.
- **Bootstrap's `.container-fluid { width: 1140px }` at xl is a width, not a max-width.** `xl:w-285` matches it and keeps the probe quiet; `xl:max-w-285` renders the same but reports `maxWidth` differently.
- **Two intentional deviations on the product page below md.** The old site set the feature icons flush against their text and let the two more-info buttons sit side by side, wrapping at odd widths (500px). The user asked for `gap-x-4` between icon and text, and for the buttons stacked (`flex-col items-center`), both below md only. The probe reports these as `gridTemplateColumns`, `cells.*.left` and `buttons.1.top` differences at 375 and 600.
- **A `class` prop on `ButtonCnc` is silently dropped** because the component sets `class` after spreading its props. Put spacing on a wrapper (the case page uses `pb-5` on the link container for Gatsby's 20px button margin).
- **The old case page has no mobile image for a single-slide row.** `case.js` aliased the `mobile` crop away in its GraphQL query and then read `image.mobile`, so below md the `<img>` has no `src` and renders 24px tall. The port shows the mobile crop; the probe reports `rows.N.img` and the section height as differences at 375 and 600.
- **`ButtonCnc` is `text-lg leading-7` (18px/28px) for Gatsby's `.btn-cnc` at 1.1rem/1.7rem (17.6px/27.2px).** Heights match on every page; buttons are 4 to 7px wider (0.4px per character plus `px-6` for 23px), and that is accepted. The English S-series page wraps its two more-info buttons at 800px again. Verified with `--selector ".btn-cnc"` on the home, product, case, news, about and contact pages; that generic probe also reports padding, margin and colour on the outer element, which sit on the inner span and wrappers in the port and were never meant to match.
- **Deleting a file under `public/` while the dev server runs breaks every page with an ENOENT for that file.** Tailwind's Vite plugin scans `public/` for class candidates and registers each file as a watch file of `global.css`; Vite then reads every `.svg` watch file to decide about inlining, and the stale list still names the deleted file. Touch `global.css` to make Tailwind rescan; the server recovers without a restart.
- **Analytics only renders in production.** Both Gatsby plugins bailed out unless `NODE_ENV=production`, so `BaseLayout` includes `Analytics.astro` under `import.meta.env.PROD`. Check `dist/index.html` after `astro build` for the gtag and pixel snippets; the dev server never shows them. Page views are sent on `astro:page-load` because the `ClientRouter` swaps pages without a full load.
- **The favicon and web manifest are copied from Gatsby's build output.** `gatsby-plugin-manifest` padded `CNC-Logo.png` into square icons of 48 to 512px; those PNGs live in `public/icons/` with `favicon-32x32.png` and a hand-written `manifest.webmanifest`. Astro's default `favicon.svg` and `favicon.ico` are gone.
- **Prettier re-indents element children, and inside a `<pre>` that indentation is content.** The contact address rendered with its first line pushed 16 spaces in, twice: once written that way, once after the formatter undid the fix. Use `set:text={value}` on a self-closing `<pre>` so there are no children to re-indent.
- **`main.sass` sets `h1, h2` to uppercase, and to 48px/48px from lg up.** A page rule that only overrides `font-size` (contact.sass drops the h2 to 20px) keeps the 48px line-height. Port it as `text-xl leading-6 lg:leading-12 uppercase`, and check `textTransform` on every ported heading.
- **A Bootstrap `.container` can be nested inside a column.** `contact.js` wraps the form in `.col-lg-8 > .container`, insetting it another 15px at every breakpoint. Its max-width never bites there, so only the padding needs reproducing (`px-4` on an inner div). Read the markup, not just the Sass, before matching a column's edge.
- **Bootstrap's `.form-control` is `display: block` and its `label` is `inline-block`.** Ported the other way round, each field loses the label's 2px descender and gains an 8px baseline gap under the input. Over nine fields on the contact page that was a 50px difference in form height.
- **The contact form is 26px shorter than Gatsby's and that is accepted.** `input.form-control` is 25px (`h-6` is 24) and the 14px label's line box is 21px (`text-sm` is 20). Both are 1px snaps, but nine fields accumulate. No bracket lengths to close it.
- **Cloudflare's Turnstile test key renders a dummy widget with no iframe.** A probe that looks for `iframe[src*='challenges.cloudflare']` reports MISSING on both sites and the comparison passes while measuring nothing. Probe the hidden `input[name=cf-turnstile-response]` instead.
- **The contact form hides itself after a successful submit.** Gatsby left the filled-in form sitting above the thank-you alert, which invites a second submit on a spent token. The port adds `hidden` to the `<form>` on a 200 only; a failure keeps it up so the visitor can retry. The `aboveForm` heading stays either way.
- **`Carousel.astro` serves `tablet` at 34em when `mobileLandscape` is not set**, which the case and news carousels want, but the solutions carousel on the old home page only switched crops at 48em. Between 576 and 767px the tablet crop capped at 350px stuck out under the fixed 320x150 dark cover. Pass `mobileLandscape: mobile` there. Probe: `scripts/probes/solutions-carousel.mjs`.
- **The mobile button under the home carousels starts 44px below the image**, not Bootstrap's `mt-4` (24px): the old `.link-container` adds 20px on top. With the dots translated 50px down, `mt-4` put the button over the dots. Use `mt-11` and check with `scripts/probes/carousel-button.mjs` (its `gapDotToBtn` is 10 on Gatsby and 20 on Astro for the same layout, because Gatsby's dot box includes its transparent borders).

- **Tailwind's reset also strips CMS headings.** A `<h2>` inside `set:html` rendered as 16px regular text until `global.css` gained `.cms-content h1..h6` rules: h1/h2 are `text-3xl font-bold uppercase lg:text-5xl` (main.sass), h3 to h6 are Bootstrap's `font-medium leading-tight` at `text-28`, `text-2xl`, `text-xl`, `text-base`, all `mb-2`. `leading-tight` (1.25) is 0.8 to 1.4px off Bootstrap's 1.2 and accepted. `NewsTextBlock.astro` used to carry a scoped h3 rule at 30px with a 16px margin; the rendered Gatsby value was 28px and 8px, so it was dropped in favour of the global rules.

- **Astro 7 defaults `compressHTML` to `'jsx'`**, which strips the whitespace around inline text: `<a> Solutions </a>` is emitted as `<a>Solutions</a>`. Measured on the 5 to 7 upgrade (13 September 2026) by serving the last Astro 5 build next to the Astro 7 build and diffing `body *` plus `body.innerText` on seventeen pages at every viewport: no layout and no visible-text difference, only inline-script minifier output. The default is kept; nothing in the port relies on inter-element whitespace. Astro 7 also fixed the 5.18 loader that treated a 304 on image revalidation as a redirect. Zod 4 came with it: `z` is imported from `astro/zod` and `.passthrough()` became `.loose()`.

- **The home hero must know the video's height before the video arrives.** The first port set the section's min-height from JavaScript on `loadedmetadata`, so between 576 and 992px the hero grew by 57 to 170px once the file loaded, and the handler was attached on `astro:page-load`, which can run after a cached video has already fired the event. The video is 16:9, so the height is now CSS: `sm:min-h-[min(56.25vw,100vh-5rem)]` and `lg:min-h-[min(56.25vw,100vh-7rem)]`. Do not use `aspect-video` for this: when `max-height` caps an aspect-ratio box, CSS transfers the ratio to the width and the hero stops short of the right edge on wide screens. The poster sits under the video as an `<img>` and the video fades in on `playing`. The `<video>` carries no `<source>` in the HTML; the script attaches the webm (2.1 MB, VP9, with an explicit codecs string so Safari can reject it cleanly) and the mp4 (7.6 MB) only when `(min-width: 576px)` matches, because the video is hidden on phones and used to be downloaded there anyway. Verified with a Playwright request log: no `/videos/` request at 375 and 575, the webm at 576 and up.
- **Bootstrap's `min-height` is border-box.** `.hero-content` at lg is `min-height: 600px` with 190px paddings, which totals 600, not 980. Ported as `lg:box-content lg:min-h-150 lg:pt-48 lg:pb-48` the block was 984px and pushed the hero to its `max-height` cap (788 in a 900px viewport) where Gatsby renders the 16:9 video height (675 at 1200). Dropped `lg:box-content`. The block is also `height: 100%` of the hero, which puts the heading 190px from the top whatever the hero height; a percentage cannot resolve against a min-height parent, so the port uses `lg:my-0 lg:grow` on the flex item instead. Gatsby's h1 keeps `width: 50%` at lg and wraps to two lines at 992px; the port has `lg:w-auto` and keeps one line, left as is.

- **The cookie banner pushed its text off-screen on phones.** Gatsby's `#cookies-banner` is one non-wrapping flex row with `justify-content: end`, so at 375px the paragraph's left edge sits at -24px on the old site (-2px in the first port). The port now wraps below sm (`flex-wrap sm:flex-nowrap`, description `basis-full sm:basis-auto`) with the buttons on a row beneath; from sm up the row is unchanged. The description is a `<p>` at `text-lg leading-7` for Bootstrap's 1.1rem/1.7rem, the same rounding as `ButtonCnc`.
- **Sitemap and robots.txt are new in the port.** Neither site had them. `@astrojs/sitemap` with `site: "https://cncsolutions.be"` writes `sitemap-index.xml` and `sitemap-0.xml` (90 URLs, no 404) and `public/robots.txt` points at the index.

## Review of 6 September 2026

Every finding from the full pre-deploy review is closed: the GitHub Actions deploy, the cookie banner reading its copy from Umbraco, the Turnstile script placement, the tablet container caps, the home row download button, the footer heading fallback, the bracket lengths, the container row in the mapping table, the solution rows rendering every block, the bracket colours (now `text-gray-900`, `text-muted` and `hover:text-primary-dark` theme tokens), the unused `currentPageId` prop, and the `astro check` hint on `Analytics.astro`. One difference was kept on purpose: the previous-news link on `NewsPage.astro` points at the nearest older article, where Gatsby pointed at the oldest.

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
