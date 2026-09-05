/**
 * Probe for an overview tile grid (#case-tiles or #solution-tiles): the
 * container, the grid, every tile's offset and the first tile's parts, plus
 * the gap to the bottom edge. Runs inside the page via scripts/compare.mjs.
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
  const grid = document.querySelector("#case-tiles, #solution-tiles");
  const tiles = [...grid.children];
  const tile = tiles[0];
  const img = tile.querySelector("picture img");
  const box = tile.lastElementChild;
  const h3 = box.querySelector("h3");
  const edge = grid.closest("section").lastElementChild;
  const firstTop = r(tile).top;
  const hover = (el, props) => pick(el, props);
  return {
    container: pick(grid.parentElement, ["maxWidth", "paddingLeft"]),
    grid: pick(grid, [
      "gridTemplateColumns",
      "columnGap",
      "rowGap",
      "marginBottom",
    ]),
    tileCount: tiles.length,
    tileOffsets: tiles.map((el) => ({
      dx: num(r(el).left - r(tile).left),
      dy: num(r(el).top - firstTop),
    })),
    tile: pick(tile, [
      "display",
      "maxHeight",
      "boxShadow",
      "textDecorationLine",
    ]),
    img: pick(img, ["height"]),
    box: pick(box, [
      "minHeight",
      "paddingTop",
      "paddingLeft",
      "backgroundColor",
    ]),
    h3: pick(h3, [
      "fontSize",
      "fontWeight",
      "lineHeight",
      "color",
      "textTransform",
      "textAlign",
      "whiteSpace",
      "marginTop",
    ]),
    gridToEdge: num(r(edge).top - r(grid).bottom),
  };
};
