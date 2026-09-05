/**
 * Probe for the solution detail page: every cnc-block row with its media
 * column (slideshow or video) and text column, plus the carousel chrome.
 * Runs inside the page via scripts/compare.mjs on both sites.
 */
export default () => {
  const num = (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) || String(v).includes(" ")
      ? v
      : Math.round(n * 10) / 10;
  };
  const r = (el) => el.getBoundingClientRect();
  const pick = (el, props) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const b = r(el);
    const o = { left: num(b.left), w: num(b.width), h: num(b.height) };
    for (const p of props) o[p] = num(cs[p]);
    return o;
  };
  const rows = [...document.querySelectorAll(".cnc-block")];
  return {
    rowCount: rows.length,
    rows: rows.map((section, i) => {
      const cols = [...section.firstElementChild.firstElementChild.children];
      const text = section.querySelector(".text-block");
      const media = cols.find((c) => c !== text);
      const above = text.querySelector(".above");
      const h2 = text.querySelector("h2");
      const bar = text.querySelector("img");
      const body = bar.nextElementSibling;
      const carousel = media.querySelector(".carousel, .solution-slideshow");
      const activeImg = carousel
        ? [...carousel.querySelectorAll("img")].find(
            (el) =>
              r(el).width > 0 && r(el).right > 0 && r(el).left < innerWidth,
          )
        : null;
      const indicators = carousel?.querySelector(
        ".carousel-indicators, .slideshow-dots",
      );
      const dot = indicators?.children[0];
      const activeDot = indicators?.querySelector(
        ".active div, .slideshow-dot > .block",
      );
      const prev = carousel?.querySelector(
        ".carousel-control-prev, .slideshow-prev",
      );
      const prevIcon = prev?.firstElementChild;
      const next = carousel?.querySelector(
        ".carousel-control-next, .slideshow-next",
      );
      const iframe = media.querySelector("iframe");
      const prevSection = rows[i - 1];
      return {
        section: pick(section, [
          "paddingTop",
          "paddingBottom",
          "backgroundColor",
          "color",
        ]),
        gapFromPrev: prevSection
          ? num(r(section).top - r(prevSection).bottom)
          : null,
        container: pick(section.firstElementChild, ["maxWidth", "paddingLeft"]),
        media: pick(media, ["marginTop", "paddingLeft", "order"]),
        text: pick(text, ["marginTop", "paddingLeft", "order"]),
        mediaBeforeText:
          r(media).left < r(text).left || r(media).top < r(text).top,
        above: pick(above, [
          "fontSize",
          "fontWeight",
          "lineHeight",
          "textAlign",
          "textTransform",
          "marginBottom",
        ]),
        h2: pick(h2, [
          "fontSize",
          "fontWeight",
          "lineHeight",
          "textAlign",
          "textTransform",
          "maxWidth",
          "marginLeft",
          "marginBottom",
        ]),
        bar: pick(bar, ["marginLeft", "marginBottom"]),
        body: pick(body, ["textAlign"]),
        p: pick(body.querySelector("p"), [
          "fontSize",
          "lineHeight",
          "marginBottom",
          "color",
        ]),
        ul: pick(body.querySelector("ul"), [
          "paddingLeft",
          "marginBottom",
          "listStyleType",
        ]),
        a: pick(body.querySelector("a"), ["color", "textDecorationLine"]),
        aboveToH2: num(r(h2).top - r(above).bottom),
        h2ToBar: num(r(bar).top - r(h2).bottom),
        barToBody: num(r(body).top - r(bar).bottom),
        carousel: carousel ? pick(carousel, ["position"]) : null,
        img: activeImg ? pick(activeImg, ["width"]) : null,
        // Bootstrap's dots carry 10px transparent borders and 15% side
        // margins, so compare the visible dot, not the list box.
        indicators: indicators
          ? {
              justifyContent: num(getComputedStyle(indicators).justifyContent),
              top: num(r(indicators).top - r(carousel).top),
            }
          : null,
        dot: dot
          ? {
              ...pick(dot, ["backgroundColor", "opacity"]),
              h: undefined,
            }
          : null,
        dotPitch:
          indicators && indicators.children[1]
            ? num(r(indicators.children[1]).left - r(dot).left)
            : null,
        activeDot: activeDot
          ? {
              ...pick(activeDot, ["borderBottomColor", "borderBottomWidth"]),
              top: num(r(activeDot).top - r(carousel).top),
            }
          : null,
        prev: prev
          ? {
              ...pick(prev, ["opacity"]),
              top: num(r(prev).top - r(carousel).top),
            }
          : null,
        prevIcon: prevIcon
          ? pick(prevIcon, [
              "borderRightWidth",
              "borderRightColor",
              "borderTopWidth",
            ])
          : null,
        next: next ? pick(next, []) : null,
        iframe: iframe ? pick(iframe, []) : null,
      };
    }),
  };
};
