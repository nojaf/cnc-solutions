// Home page carousels: image bottom, dot strip and the mobile button below.
export default function probe() {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      top: Math.round(b.top),
      bottom: Math.round(b.bottom),
      height: Math.round(b.height),
    };
  };
  const out = {};
  document.querySelectorAll(".carousel").forEach((c) => {
    const dots = c.querySelector(".carousel-indicators, .carousel-dots");
    if (!dots) return;
    const dot = dots.querySelector("li, button");
    const img = c.querySelector(
      ".carousel-item.active img, .carousel-slide img",
    );
    let btn = null;
    const all = [...document.querySelectorAll(".btn-cnc")];
    for (const b of all) {
      if (
        c.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING &&
        b.offsetParent
      ) {
        btn = b;
        break;
      }
    }
    const btnBox = btn ? r(btn) : null;
    out[c.id] = {
      img: r(img),
      dot: r(dot),
      btn: btnBox,
      gapDotToBtn: btnBox && dot ? btnBox.top - r(dot).bottom : null,
    };
  });
  return out;
}
