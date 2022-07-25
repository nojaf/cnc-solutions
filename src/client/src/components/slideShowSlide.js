import React from "react"

const SlideShowSlide = ({
  image,
  isActive,
  altText,
  parentUmbracoId,
  link,
}) => {
  const {
    large_desktop,
    desktop,
    tablet,
    mobile_landscape,
    mobile_portrait,
  } = image

  const Anchor = ({ children }) => {
    return link ? (
      <a href={link}>{children}</a>
    ) : (
      <a
        href={desktop}
        className="d-block w-100"
        data-toggle="lightbox"
        data-gallery={`gallery-${parentUmbracoId}`}
      >
        {children}
      </a>
    )
  }
  return (
    <div className={`carousel-item ${isActive ? "active" : ""}`}>
      <Anchor>
        <picture>
          <source media="(min-width: 75em)" srcSet={large_desktop} />
          <source media="(min-width: 62em)" srcSet={desktop} />
          <source media="(min-width: 48em)" srcSet={tablet} />
          <source media="(min-width: 34em)" srcSet={mobile_landscape} />
          <img
            src={mobile_portrait}
            alt={altText}
            className="d-block m-auto w-100"
          />
        </picture>
      </Anchor>
    </div>
  )
}

export default SlideShowSlide
