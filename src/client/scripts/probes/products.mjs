/**
 * Probe for the products overview: the card list (carousel below md, grid
 * from md up), the first card's parts and the gap to the bottom edge.
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
  const products = document.querySelector("#products");
  // Gatsby renders the list twice; take whichever one is displayed.
  // Gatsby renders the list twice and hides inactive slides; Astro keeps
  // every slide in a sliding track. Only count cards inside the viewport.
  const visibleProducts = [...products.querySelectorAll(".product")].filter(
    (el) => r(el).width > 0 && r(el).right > 0 && r(el).left < innerWidth,
  );
  const product = visibleProducts[0];
  const header = product.querySelector(".header");
  const img = header.querySelector("img");
  const title = header.querySelector(".title");
  const content = product.querySelector(".content");
  const h3 = content.querySelector("h3");
  const p = content.querySelector("p");
  const corner = content.querySelector(".corner, .content > div:last-child");
  const more = product.querySelector(".more-info");
  const moreCorner = more.querySelector("span:first-of-type");
  const moreInner = more.querySelector("span:last-of-type");
  const prev = [
    ...document.querySelectorAll(".carousel-control-prev, .products-prev"),
  ].find((el) => r(el).width > 0);
  const prevIcon = prev?.firstElementChild;
  const next = [
    ...document.querySelectorAll(".carousel-control-next, .products-next"),
  ].find((el) => r(el).width > 0);
  let edge = products.closest("section").lastElementChild;
  const firstTop = r(visibleProducts[0]).top;
  return {
    container: pick(products.parentElement, ["maxWidth", "paddingLeft"]),
    products: pick(products, ["marginBottom"]),
    visibleCount: visibleProducts.length,
    productOffsets: visibleProducts.map((el) => ({
      dx: num(r(el).left - r(visibleProducts[0]).left),
      dy: num(r(el).top - firstTop),
    })),
    product: pick(product, ["width", "maxWidth"]),
    header: pick(header, ["boxShadow", "textDecorationLine"]),
    img: pick(img, ["width", "height"]),
    title: pick(title, [
      "paddingTop",
      "paddingBottom",
      "backgroundColor",
      "color",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "textAlign",
      "textTransform",
      "boxShadow",
      "marginBottom",
    ]),
    content: pick(content, [
      "borderTopWidth",
      "borderTopColor",
      "paddingTop",
      "paddingLeft",
      "minHeight",
    ]),
    h3: pick(h3, ["fontSize", "fontWeight", "lineHeight", "marginBottom"]),
    p: pick(p, ["fontSize", "lineHeight", "marginBottom", "color"]),
    corner: pick(corner, [
      "borderBottomWidth",
      "borderLeftWidth",
      "borderBottomColor",
    ]),
    more: pick(more, [
      "borderTopWidth",
      "borderTopColor",
      "paddingTop",
      "paddingLeft",
      "backgroundColor",
      "fontSize",
      "lineHeight",
      "color",
      "textDecorationLine",
    ]),
    moreTop: num(r(more).top - r(content).bottom),
    moreCorner: pick(moreCorner, ["borderBottomWidth", "borderBottomColor"]),
    moreInner: pick(moreInner, [
      "borderBottomWidth",
      "borderBottomColor",
      "zIndex",
    ]),
    prev: prev
      ? { ...pick(prev, ["opacity"]), top: num(r(prev).top - r(products).top) }
      : null,
    prevIcon: prevIcon
      ? {
          ...pick(prevIcon, ["borderRightWidth", "borderRightColor"]),
          top: num(r(prevIcon).top - r(products).top),
        }
      : null,
    next: next ? { left: num(r(next).left), w: num(r(next).width) } : null,
    listToEdge: num(r(edge).top - r(products).bottom),
  };
};
