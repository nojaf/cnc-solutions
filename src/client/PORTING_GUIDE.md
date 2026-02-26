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
- Avoid arbitrary values like `p-[25px]` — use `p-6` (24px) instead.
- Only use bracket notation `[value]` when there is no reasonable Tailwind equivalent and the value matters precisely (rare).
- When Tailwind has a built-in class (e.g. `border-l-8` for 8px), use it instead of `border-l-[8px]`.

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

- `NavDropdown.astro` — handles both desktop (hover) and mobile (click-toggle) dropdown in one component, with props for:
  - `label`: display text
  - `href?`: optional link URL (omit for non-link labels like language switcher)
  - `items`: array of `{ url, text }`
  - `alignRight?`: right-align the dropdown panel

The component renders **two** `<li>` elements — one with `hidden lg:block` for desktop and one with `lg:hidden` for mobile. This keeps the markup co-located and the parent template clean.

### 6. Verify the result

After porting, compare computed styles between both sites at each breakpoint:

```js
// Run on both sites, compare output
() => {
  const el = document.querySelector("nav");
  const cs = getComputedStyle(el);
  return { padding: cs.padding, height: cs.height, maxWidth: cs.maxWidth };
};
```

Acceptable deviations:

- 1-2px on spacing (due to 4px grid snapping)
- 2-3px on computed height (cascading from snapped child sizes)
- Exact match expected on: font-size, font-weight, color, text-transform, max-width

### 7. Interaction behavior

Always check interactive states:

- Hover states on desktop nav links and dropdown items
- Click-to-toggle behavior on mobile hamburger and submenu arrows
- Dropdown open/close behavior
- Arrow rotation on submenu toggle (use `rotate-180` class toggle)

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

## Checklist for each component port

- [ ] Inspect Gatsby component at mobile, lg, and xl breakpoints
- [ ] Record all computed styles (spacing, typography, colors, borders)
- [ ] Map values to 4px grid, noting acceptable deviations
- [ ] Write Astro component using Tailwind utility classes
- [ ] Extract repeated patterns into sub-components
- [ ] Verify desktop hover behavior
- [ ] Verify mobile click/toggle behavior
- [ ] Compare computed styles between both sites at all breakpoints
- [ ] Check for Tailwind warnings (prefer built-in classes over bracket notation)
