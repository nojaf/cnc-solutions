import PropTypes from "prop-types"
import React from "react"

function parseHeaderImage(currentPage) {
  return {
    mobile: currentPage["headerImage"]["mobile"],
    tablet: currentPage["headerImage"]["tablet"],
    desktop: currentPage["headerImage"]["desktop"],
    largeDesktop: currentPage["headerImage"]["large_desktop"],
    alt: currentPage["headerImage"]["headerImageAlt"],
  }
}

const Header = ({ currentPage }) => {
  const { alt, mobile, tablet, desktop, largeDesktop } = parseHeaderImage(
    currentPage
  )
  return (
    <header>
      <picture>
        <source media="(min-width: 75em)" srcSet={largeDesktop} />
        <source media="(min-width: 62em)" srcSet={desktop} />
        <source media="(min-width: 48em)" srcSet={tablet} />
        <source media="(min-width: 34em)" srcSet={mobile} />
        <img src={mobile} srcSet={mobile} alt={alt} />
      </picture>
      <div className="edge-container">
        <div className="edge white" />
      </div>
    </header>
  )
}

Header.propTypes = {
  currentPage: PropTypes.shape({
    headerImage: PropTypes.shape({
      mobile: PropTypes.string,
      tablet: PropTypes.string,
      desktop: PropTypes.string,
      "large-desktop": PropTypes.string
    }),
    headerImageAlt: PropTypes.string
  }),
}

Header.defaultProps = {}

export default Header
