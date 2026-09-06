/**
 * The 404 page renders its text in nl, en and fr. When the requested path has
 * a /en/ or /fr/ prefix only that language stays visible; any other path shows
 * all three. Runs on `astro:before-swap` so the incoming document is already
 * trimmed when the view transition paints it. 404.astro repeats the same logic
 * in an inline script for hard loads.
 */
export function pickNotFoundLang(doc: Document, pathname: string): void {
  const sections = doc.querySelectorAll<HTMLElement>("section[data-lang]");
  if (sections.length === 0) return;
  const lang = pathname.match(/^\/(en|fr)(\/|$)/)?.[1] ?? null;
  sections.forEach((s) => {
    s.hidden = lang !== null && s.dataset.lang !== lang;
  });
  if (lang) doc.documentElement.lang = lang;
}
