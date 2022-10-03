import { pageInCulture, wrapIfSingleton } from "../selectors"
import SlideShowSlide from "./slideShowSlide"
import React from "react"

const SlideShow = ({ culture, umbracoId, slides, color }) => {
  const slideShowSlides = wrapIfSingleton(slides).map((s) =>
    pageInCulture(culture, s)
  )
  console.log("slideShowSlides", slideShowSlides)
  return (
    <div
      className={`carousel slide ${color}`}
      id={`block${umbracoId}Carousel`}
      data-ride="carousel"
    >
      <ol className="carousel-indicators">
        {slideShowSlides.map((s, i) => {
          return (
            <li
              key={`carousel-${umbracoId}-${i}`}
              data-target={`#block${umbracoId}Carousel`}
              data-slide-to={i}
              className={i === 0 ? "active" : ""}
            >
              <div className="inner"></div>
            </li>
          )
        })}
      </ol>
      <div className="carousel-inner">
        {slideShowSlides.map((s, i) => (
          <SlideShowSlide
            {...s}
            isActive={i === 0}
            key={`show-${umbracoId}-slide-${i}`}
          />
        ))}
      </div>
      <a
        className="carousel-control-prev"
        href={`#block${umbracoId}Carousel`}
        role="button"
        data-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href={`#block${umbracoId}Carousel`}
        role="button"
        data-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </a>
    </div>
  )
}

export default SlideShow
