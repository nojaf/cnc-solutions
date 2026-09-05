/**
 * Probe for the product detail page: the highlight rows (image or video
 * beside a text column), the features grid and the more-info call to action.
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
    "marginTop",
    "marginBottom",
  ];

  const highlights = document.querySelector("#product-highlights");
  const intro = document.querySelector("h1").closest("section");
  const rows = [...highlights.firstElementChild.children];
  const features = document.querySelector("#features");
  const heading = features.querySelector(".heading");
  const body = features.querySelector(".body");
  const bodyKids = [...body.children];
  const icons = bodyKids.filter((el) => el.tagName === "IMG");
  const cells = bodyKids.filter((el) => el.tagName !== "IMG");
  const more = document.querySelector("#more-info");
  const moreContainer = more.firstElementChild;
  const moreAbove = moreContainer.querySelector(".above");
  const moreH2 = moreContainer.querySelector("h2");
  const moreBar = moreContainer.querySelector("img");
  const moreBody = moreBar.nextElementSibling;
  const buttons = [...moreContainer.querySelectorAll(".btn-cnc")];

  return {
    highlights: {
      ...pick(highlights, ["marginTop"]),
      fromIntro: num(r(highlights).top - r(intro).bottom),
      container: pick(highlights.firstElementChild, [
        "maxWidth",
        "paddingLeft",
      ]),
    },
    rowCount: rows.length,
    rows: rows.map((row, i) => {
      const cols = [...row.children];
      const info = row.querySelector(".product-info");
      const infoCol = info.parentElement;
      const mediaCol = cols.find((c) => c !== infoCol);
      const media = mediaCol.firstElementChild;
      const img = media.querySelector("img");
      const iframe = media.querySelector("iframe");
      const above = info.querySelector(".above");
      const h2 = info.querySelector("h2");
      const bar = info.querySelector("img");
      const lead = bar.nextElementSibling;
      const p = lead.querySelector("p");
      return {
        row: pick(row, []),
        fromPrev: i ? num(r(row).top - r(rows[i - 1]).bottom) : null,
        mediaCol: pick(mediaCol, []),
        infoCol: pick(infoCol, []),
        mediaFirst:
          r(mediaCol).left < r(infoCol).left ||
          r(mediaCol).top < r(infoCol).top,
        media: pick(media, ["height"]),
        img: img ? pick(img, ["objectFit"]) : null,
        iframe: iframe ? pick(iframe, []) : null,
        info: pick(info, ["paddingTop", "paddingBottom", "textAlign"]),
        above: pick(above, textProps),
        h2: pick(h2, textProps),
        bar: pick(bar, ["marginLeft", "marginBottom"]),
        lead: pick(lead, ["textAlign"]),
        p: p ? pick(p, [...textProps, "paddingTop", "width"]) : null,
        ul: pick(lead.querySelector("ul"), [
          "paddingLeft",
          "marginBottom",
          "listStyleType",
          "textAlign",
        ]),
        li: pick(lead.querySelector("li"), ["fontSize", "lineHeight"]),
        a: pick(lead.querySelector("a"), ["color", "textDecorationLine"]),
        aboveToH2: num(r(h2).top - r(above).bottom),
        h2ToBar: num(r(bar).top - r(h2).bottom),
        barToLead: num(r(lead).top - r(bar).bottom),
      };
    }),
    features: {
      section: pick(features, [
        "paddingTop",
        "paddingBottom",
        "backgroundColor",
        "color",
      ]),
      fromHighlights: num(r(features).top - r(highlights).bottom),
      container: pick(features.firstElementChild, ["maxWidth", "paddingLeft"]),
      heading: pick(heading, ["paddingBottom", "textAlign"]),
      above: pick(heading.querySelector(".above"), textProps),
      h2: pick(heading.querySelector("h2"), textProps),
      body: pick(body, ["gridTemplateColumns", "gridTemplateRows"]),
      count: cells.length,
      icons: icons.map((el) => ({
        ...pick(el, ["marginLeft"]),
        top: num(r(el).top - r(body).top),
      })),
      cells: cells.map((el) => ({
        ...pick(el, ["textAlign", "paddingLeft", "paddingRight"]),
        top: num(r(el).top - r(body).top),
      })),
      h4: pick(cells[0].querySelector("h4"), textProps),
      p: pick(cells[0].querySelector("p"), [
        "fontSize",
        "lineHeight",
        "marginBottom",
        "textAlign",
      ]),
    },
    more: {
      section: pick(more, [
        "paddingTop",
        "paddingBottom",
        "width",
        "marginLeft",
      ]),
      fromFeatures: num(r(more).top - r(features).bottom),
      container: pick(moreContainer, ["maxWidth", "paddingLeft", "textAlign"]),
      above: pick(moreAbove, textProps),
      h2: pick(moreH2, textProps),
      bar: pick(moreBar, ["marginLeft", "marginBottom"]),
      p: pick(moreBody.querySelector("p"), [
        "fontSize",
        "lineHeight",
        "marginTop",
        "marginBottom",
        "textAlign",
      ]),
      buttonCount: buttons.length,
      // ButtonCnc paints the border as padding on the anchor and the face on
      // an inner span; Gatsby styles the anchor itself.
      buttons: buttons.map((b) => ({
        ...pick(b, ["fontSize", "lineHeight"]),
        ...(({ left, w, h, ...face }) => face)(
          pick([...b.children].find((el) => el.textContent.trim()) ?? b, [
            "paddingTop",
            "paddingLeft",
            "backgroundColor",
            "color",
          ]),
        ),
        top: num(r(b).top - r(moreBody).bottom),
      })),
      buttonGap:
        buttons.length > 1
          ? num(r(buttons[1]).left - r(buttons[0]).right)
          : null,
      toFooter: num(r(document.querySelector("footer")).top - r(more).bottom),
    },
  };
};
