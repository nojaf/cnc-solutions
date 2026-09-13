#!/usr/bin/env node
/**
 * Compare computed layout between the Gatsby site (8000) and the Astro site (4321).
 *
 * Both dev servers must already be running. This script never starts them.
 *
 * Usage:
 *   node scripts/compare.mjs --selector "footer h4" [--pages /solutions/,/team/]
 *        [--viewports 375,600,800,992,1200] [--limit 10] [--tolerance 2]
 *   node scripts/compare.mjs --probe ./scripts/probes/intro.mjs --pages /team/
 *
 * --selector  Generic mode. Every match (up to --limit) is reported with its
 *             rect and a standard set of computed styles.
 * --probe     Custom mode. Path to an ES module whose default export is a
 *             function that runs *inside the page* and returns a plain object.
 *             It is serialised with .toString(), so it cannot close over
 *             variables from the module.
 *
 * Numbers within --tolerance px are treated as equal. Everything else that
 * differs is printed, grouped by page and viewport. Exit code 1 when any
 * difference is found, so it can gate a check.
 */
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { chromium } from "playwright-core";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((a, i, all) =>
      a.startsWith("--") ? [a.slice(2), all[i + 1] ?? ""] : null,
    )
    .filter(Boolean),
);

const SITES = {
  gatsby: process.env.GATSBY_URL ?? "http://localhost:8000",
  astro: process.env.ASTRO_URL ?? "http://localhost:4321",
};
const pages = (args.pages ?? "/").split(",").filter(Boolean);
const viewports = (args.viewports ?? "375,600,800,992,1200")
  .split(",")
  .map(Number);
const tolerance = Number(args.tolerance ?? 2);
const limit = Number(args.limit ?? 10);

if (!args.selector && !args.probe) {
  console.error(
    "Pass --selector <css> or --probe <file>. See the header of this file.",
  );
  process.exit(2);
}

const STYLE_PROPS = [
  "display",
  "position",
  "width",
  "height",
  "maxWidth",
  "minHeight",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "textTransform",
  "textAlign",
  "color",
  "backgroundColor",
  "gridTemplateColumns",
  "columnGap",
  "rowGap",
  "boxShadow",
];

// Runs inside the page. Keep it self-contained.
const genericProbe = ({ selector, limit, props }) => {
  const num = (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) || String(v).includes(" ")
      ? v
      : Math.round(n * 10) / 10;
  };
  return [...document.querySelectorAll(selector)].slice(0, limit).map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const out = {
      text: (el.textContent ?? "").trim().slice(0, 40),
      top: Math.round((r.top + scrollY) * 10) / 10,
      left: Math.round(r.left * 10) / 10,
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
    };
    for (const p of props) out[p] = num(cs[p]);
    // Bootstrap sets text-align: left explicitly; the browser default reports "start".
    if (out.textAlign === "start") out.textAlign = "left";
    return out;
  });
};

let probe;
if (args.probe) {
  const mod = await import(pathToFileURL(resolve(args.probe)).href);
  probe = mod.default;
  if (typeof probe !== "function")
    throw new Error("--probe module must default-export a function");
}

const flat = (o, prefix = "", out = {}) => {
  if (o === null || typeof o !== "object") {
    out[prefix || "value"] = o;
    return out;
  }
  for (const [k, v] of Object.entries(o)) {
    const key = prefix ? `${prefix}.${k}` : k;
    v !== null && typeof v === "object" ? flat(v, key, out) : (out[key] = v);
  }
  return out;
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const results = {};

for (const [site, base] of Object.entries(SITES)) {
  for (const path of pages) {
    for (const vw of viewports) {
      await page.setViewportSize({ width: vw, height: 900 });
      await page.goto(base + path, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForSelector("main, footer", { timeout: 30000 });
      await page.waitForTimeout(400);
      const data = args.probe
        ? await page.evaluate(probe)
        : await page.evaluate(genericProbe, {
            selector: args.selector,
            limit,
            props: STYLE_PROPS,
          });
      results[`${site}|${path}|${vw}`] = flat(data);
    }
  }
}
await browser.close();

let total = 0;
for (const path of pages) {
  for (const vw of viewports) {
    const g = results[`gatsby|${path}|${vw}`];
    const a = results[`astro|${path}|${vw}`];
    const lines = [];
    for (const k of new Set([...Object.keys(g), ...Object.keys(a)])) {
      const gv = g[k],
        av = a[k];
      if (typeof gv === "number" && typeof av === "number") {
        if (Math.abs(gv - av) > tolerance)
          lines.push(`  ${k}: gatsby=${gv} astro=${av}`);
      } else if (gv !== av) {
        lines.push(
          `  ${k}: gatsby=${JSON.stringify(gv)} astro=${JSON.stringify(av)}`,
        );
      }
    }
    if (lines.length) {
      total += lines.length;
      console.log(`\n### ${path} @ ${vw}px`);
      console.log(lines.join("\n"));
    }
  }
}
console.log(
  total
    ? `\n${total} difference(s) beyond ${tolerance}px.`
    : `\nNo differences beyond ${tolerance}px.`,
);
process.exit(total ? 1 : 0);
