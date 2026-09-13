/**
 * Probe for the case detail page: the media/text rows and the quote row
 * inside #case-rows. Runs inside the page via scripts/compare.mjs on both
 * sites.
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
    if (o.textAlign === "start") o.textAlign = "left";
    return o;
  };
  const textProps = [
    "fontSize",
    "fontWeight",
    "lineHeight",
    "textAlign",
    "textTransform",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "marginTop",
    "marginBottom",
  ];

  const section = document.querySelector("#case-rows");
  const intro = document.querySelector("h1").closest("section");
  const container = section.firstElementChild;
  const rows = [...container.children];
  const footer = document.querySelector("footer");

  return {
    section: pick(section, ["marginTop", "marginBottom"]),
    fromIntro: num(r(section).top - r(intro).bottom),
    container: pick(container, ["width", "maxWidth", "paddingLeft"]),
    toFooter: num(r(footer).top - r(section).bottom),
    rowCount: rows.length,
    rows: rows.map((row, i) => {
      const base = {
        row: pick(row, ["marginTop", "marginBottom"]),
        fromPrev: i ? num(r(row).top - r(rows[i - 1]).bottom) : null,
      };
      const quote = row.querySelector("blockquote");
      if (quote) {
        const span = quote.nextElementSibling;
        return {
          ...base,
          kind: "quote",
          bg: pick(row, ["backgroundColor", "color"]),
          col: pick(row.firstElementChild, ["marginTop"]),
          blockquote: pick(quote, textProps),
          span: pick(span, textProps),
        };
      }
      const cols = [...row.children];
      const info = row.querySelector(".case-info");
      const infoCol = info.parentElement;
      const mediaCol = cols.find((c) => c !== infoCol);
      const media = mediaCol.firstElementChild;
      const img = media.querySelector("img");
      const iframe = media.querySelector("iframe");
      const carousel = media.querySelector(".carousel");
      const above = info.querySelector(".above");
      const h2 = info.querySelector("h2");
      const bar = info.querySelector("img");
      const lead = bar.nextElementSibling;
      const p = lead.querySelector("p");
      const linkContainer = info.querySelector(".link-container");
      const btn = info.querySelector(".btn-cnc");
      return {
        ...base,
        kind: "case",
        mediaCol: pick(mediaCol, []),
        infoCol: pick(infoCol, ["marginTop"]),
        mediaFirst:
          r(mediaCol).left < r(infoCol).left ||
          r(mediaCol).top < r(infoCol).top,
        media: pick(media, ["height"]),
        img: img ? pick(img, ["objectFit"]) : null,
        iframe: iframe ? pick(iframe, []) : null,
        carousel: carousel ? pick(carousel, []) : null,
        info: pick(info, ["paddingTop", "paddingBottom", "textAlign"]),
        above: pick(above, textProps),
        h2: pick(h2, textProps),
        bar: pick(bar, ["marginLeft", "marginBottom", "width"]),
        p: p ? pick(p, [...textProps, "width"]) : null,
        a: pick(lead.querySelector("a"), ["color", "textDecorationLine"]),
        aboveToH2: num(r(h2).top - r(above).bottom),
        h2ToBar: num(r(bar).top - r(h2).bottom),
        barToLead: num(r(lead).top - r(bar).bottom),
        linkContainer: linkContainer
          ? pick(linkContainer, [
              "paddingTop",
              "paddingLeft",
              "width",
              "textAlign",
            ])
          : null,
        // ButtonCnc paints the border as padding on the anchor and the face
        // on an inner span; Gatsby styles the anchor itself.
        btn: btn
          ? {
              ...pick(btn, ["fontSize", "lineHeight", "marginBottom"]),
              ...(({ left, w, h, ...face }) => face)(
                pick(
                  [...btn.children].find((el) => el.textContent.trim()) ?? btn,
                  ["paddingTop", "paddingLeft", "backgroundColor", "color"],
                ),
              ),
              fromLead: num(r(btn).top - r(lead).bottom),
            }
          : null,
      };
    }),
  };
};
