/**
 * Probe for PageIntroduction: title block, underline, lead and the gap to
 * the content that follows. Runs inside the page via scripts/compare.mjs.
 */
export default () => {
  const num = (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? v : Math.round(n * 10) / 10;
  };
  const pick = (el, props) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const o = {};
    for (const p of props) o[p] = num(cs[p]);
    return o;
  };
  const r = (el) => el.getBoundingClientRect();
  const h1 = document.querySelector("main h1") ?? document.querySelector("h1");
  const section = h1.closest("section");
  const container = section.firstElementChild;
  const h2 = section.querySelector("h2");
  const img = h1.nextElementSibling;
  const lead = document.querySelector("#lead");
  let next = section.nextElementSibling;
  while (next && r(next).height === 0) next = next.nextElementSibling;
  return {
    container: pick(container, ["maxWidth", "paddingLeft", "width"]),
    h2:
      h2 && r(h2).height > 0
        ? pick(h2, ["fontSize", "fontWeight", "lineHeight", "textTransform"])
        : null,
    h1: pick(h1, ["fontSize", "fontWeight", "lineHeight", "textTransform"]),
    img: img
      ? { ...pick(img, ["width", "marginBottom"]), left: num(r(img).left) }
      : "MISSING",
    lead: lead
      ? {
          ...pick(lead, ["width", "textAlign", "marginBottom"]),
          left: num(r(lead).left),
          p: pick(lead.querySelector("p"), [
            "fontSize",
            "lineHeight",
            "marginBottom",
          ]),
          ul: pick(lead.querySelector("ul"), [
            "paddingLeft",
            "listStyleType",
            "marginBottom",
          ]),
        }
      : null,
    h2ToH1: h2 ? num(r(h1).top - r(h2).bottom) : null,
    h1ToImg: img ? num(r(img).top - r(h1).bottom) : null,
    imgToLead: lead && img ? num(r(lead).top - r(img).bottom) : null,
    bottomToNextContent: next ? num(r(next).top - r(lead ?? img).bottom) : null,
  };
};
