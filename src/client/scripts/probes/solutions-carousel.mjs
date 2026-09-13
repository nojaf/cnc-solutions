// Mobile solutions carousel on the home page: slide, image and dark cover box.
export default function probe() {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      left: Math.round(b.left),
      width: Math.round(b.width),
      height: Math.round(b.height),
      top: Math.round(b.top),
    };
  };
  const slide =
    document.querySelector("#solutions .carousel-item.active") ??
    document.querySelector("#solutions .carousel-slide");
  const img = slide?.querySelector("img");
  const cover =
    slide?.querySelector(".cover") ??
    slide?.querySelector("div.absolute.bg-black\\/50");
  return { slide: r(slide), img: r(img), cover: r(cover) };
}
