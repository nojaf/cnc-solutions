import { graphql, Link, useStaticQuery } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import * as R from "ramda"
import logo from "../images/CNC-Logo.png"
import menuBar from "../images/menu-bar@2X.png"
import { pageInCulture, useUrlsForPage } from "../selectors"

const Navigation = ({ culture, currentPageId }) => {
  const linksQueryResult = useStaticQuery(graphql`
    query pageIds {
      allCulture {
        edges {
          node {
            value
          }
        }
      }
      home {
        url {
          nl
          en
          fr
        }
      }
      solutions {
        umbracoId
        url {
          nl
          en
          fr
        }
        navigationText {
          nl
          en
          fr
        }
      }
      allSolution {
        edges {
          node {
            umbracoId
            url {
              nl
              en
              fr
            }
            navigationText {
              nl
              en
              fr
            }
          }
        }
      }
      products {
        umbracoId
        url {
          nl
          en
          fr
        }
        navigationText {
          nl
          en
          fr
        }
      }
      allProduct {
        edges {
          node {
            umbracoId
            url {
              nl
              en
              fr
            }
            navigationText {
              nl
              en
              fr
            }
          }
        }
      }
      about {
        url {
          nl
          en
          fr
        }
        navigationText {
          nl
          en
          fr
        }
      }
      contact {
        url {
          nl
          en
          fr
        }
        navigationText {
          nl
          en
          fr
        }
      }
    }
  `)

  const changeLanguageUrls = useUrlsForPage(currentPageId)
  const homePage = pageInCulture(culture, linksQueryResult.home)
  const aboutPage = pageInCulture(culture, linksQueryResult.about)
  const contactPage = pageInCulture(culture, linksQueryResult.contact)
  const solutionsPage = pageInCulture(culture, linksQueryResult.solutions)
  const productsPage = pageInCulture(culture, linksQueryResult.products)
  const cultures = R.map(
    R.pipe(R.prop("node"), R.prop("value")),
    linksQueryResult.allCulture.edges
  )
  const solutionItems = linksQueryResult.allSolution.edges.map(({ node }) => {
    return pageInCulture(culture, node)
  })
  const productItems = linksQueryResult.allProduct.edges.map(({ node }) => {
    return pageInCulture(culture, node)
  })

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white container">
      <Link to={homePage.url} className="navbar-brand">
        <img src={logo} alt="CNC Solutions Menubar Logo" />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <img src={menuBar} height={30} alt="" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mt-2">
          <li className="nav-item dropdown">
            <div
              className="dropdown-toggle link-toggle"
              id="solutionsDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Link
                className="nav-link d-inline-block"
                to={solutionsPage.url}
                aria-haspopup="true"
                aria-expanded="false"
              >
                {solutionsPage.navigationText}
              </Link>
            </div>
            <div className="dropdown-menu" aria-labelledby="solutionsDropdown">
              {solutionItems.map(si => {
                return (
                  <Link
                    to={si.url}
                    key={si.umbracoId}
                    className={"dropdown-item"}
                  >
                    {si.navigationText}
                  </Link>
                )
              })}
            </div>
          </li>
          <li className="nav-item dropdown">
            <div
              className="dropdown-toggle link-toggle"
              id="productsDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Link
                className="nav-link d-inline-block"
                to={productsPage.url}
                aria-haspopup="true"
                aria-expanded="false"
              >
                {productsPage.navigationText}
              </Link>
            </div>
            <div className="dropdown-menu" aria-labelledby="productsDropdown">
              {productItems.map(pi => {
                return (
                  <Link
                    to={pi.url}
                    key={pi.umbracoId}
                    className={"dropdown-item"}
                  >
                    {pi.navigationText}
                  </Link>
                )
              })}
            </div>
          </li>
          <li className="nav-item">
            <Link to={aboutPage.url} className="nav-link">
              {aboutPage.navigationText}
            </Link>
          </li>
          <li className="nav-item">
            <Link to={contactPage.url} className="nav-link">
              {contactPage.navigationText}
            </Link>
          </li>
          <li className="nav-item dropdown">
            <div
              id="languageDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              className="nav-link dropdown-toggle"
            >
              {culture}
            </div>
            <div className="dropdown-menu" aria-labelledby="languageDropdown">
              {cultures.map(culture => {
                return (
                  <Link
                    to={changeLanguageUrls[culture]}
                    key={culture}
                    className={"dropdown-item"}
                  >
                    {culture}
                  </Link>
                )
              })}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}

Navigation.propTypes = {
  culture: PropTypes.string.isRequired,
  currentPageId: PropTypes.number.isRequired,
}

export default Navigation
