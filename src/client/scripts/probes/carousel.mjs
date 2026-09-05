/**
 * Probe for the Bootstrap carousel chrome, on every visible carousel of a
 * page: the dots below the image, the control strips and their triangle
 * icons. Runs inside the page via scripts/compare.mjs on both sites.
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
  const carousels = [...document.querySelectorAll(".carousel")].filter(
    (c) => r(c).height > 0,
  );
  return {
    count: carousels.length,
    carousels: carousels.map((c) => {
      const img = [...c.querySelectorAll("picture img")].find(
        (el) => r(el).width > 0 && r(el).right > 0 && r(el).left < innerWidth,
      );
      const dots = c.querySelector(".carousel-indicators, .carousel-dots");
      const dot = dots?.children[0];
      const activeDot = dots?.querySelector(
        ".active div, .carousel-dot > .block",
      );
      const prev = c.querySelector(".carousel-control-prev, .carousel-prev");
      const prevIcon = prev?.firstElementChild;
      const next = c.querySelector(".carousel-control-next, .carousel-next");
      const nextIcon = next?.firstElementChild;
      const rel = (el) => ({
        top: num(r(el).top - r(c).top),
        left: num(r(el).left - r(c).left),
        w: num(r(el).width),
        h: num(r(el).height),
      });
      return {
        id: c.id,
        carousel: pick(c, ["position"]),
        img: img ? rel(img) : null,
        // Bootstrap's dots carry 10px transparent borders, so compare the
        // visible active triangle, not the list box.
        dot: dot
          ? {
              ...pick(dot, ["backgroundColor", "opacity"]),
              h: undefined,
            }
          : null,
        dotPitch:
          dots && dots.children[1]
            ? num(r(dots.children[1]).left - r(dot).left)
            : null,
        activeDot: activeDot
          ? {
              ...rel(activeDot),
              ...pick(activeDot, ["borderBottomWidth", "borderBottomColor"]),
            }
          : null,
        prev: prev
          ? { ...rel(prev), opacity: num(getComputedStyle(prev).opacity) }
          : null,
        prevIcon: prevIcon
          ? {
              ...rel(prevIcon),
              ...pick(prevIcon, ["borderRightWidth", "borderRightColor"]),
            }
          : null,
        next: next ? rel(next) : null,
        nextIcon: nextIcon
          ? {
              ...rel(nextIcon),
              ...pick(nextIcon, ["borderLeftWidth", "borderLeftColor"]),
            }
          : null,
      };
    }),
  };
};
