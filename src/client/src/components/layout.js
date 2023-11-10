import React from "react"
import PropTypes from "prop-types"
import Navigation from "./navigation"
import "../styles/main.sass"
import Footer from "./footer"
import SEO from "./seo"

const Layout = ({ children, culture, currentPageId, seo, mainClass = "" }) => {
  return (
    <>
      <SEO {...seo} />
      <Navigation culture={culture} currentPageId={currentPageId} />
      <main className={mainClass}>{children}</main>
      <Footer culture={culture} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  culture: PropTypes.string.isRequired,
  currentPageId: PropTypes.number.isRequired,
}

export default Layout
