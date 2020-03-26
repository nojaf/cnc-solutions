import React from "react"
import PropTypes from "prop-types"
import Navigation from "./navigation"
import "../styles/main.sass"
import Footer from "./footer"

const Layout = ({ children, culture, currentPageId }) => {
  return (
    <>
      <Navigation culture={culture} currentPageId={currentPageId} />
      <main>{children}</main>
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
