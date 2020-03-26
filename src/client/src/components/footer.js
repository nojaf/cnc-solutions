import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"
import { pageInCulture } from "../selectors"

const Footer = ({ culture }) => {
  const linksQueryResult = useStaticQuery(graphql`
    query footerLinks {
      solutions {
        umbracoId
        url {
          nl
          en
        }
        navigationText {
          nl
          en
        }
      }
      allSolution {
        edges {
          node {
            umbracoId
            url {
              nl
              en
            }
            navigationText {
              nl
              en
            }
          }
        }
      }
      products {
        umbracoId
        url {
          nl
          en
        }
        navigationText {
          nl
          en
        }
      }
      allProduct {
        edges {
          node {
            umbracoId
            url {
              nl
              en
            }
            navigationText {
              nl
              en
            }
          }
        }
      }
      about {
        url {
          nl
          en
        }
        navigationText {
          nl
          en
        }
      }
      contact {
        url {
          nl
          en
        }
        navigationText {
          nl
          en
        }
      }
    }
  `)

  const aboutPage = pageInCulture(culture, linksQueryResult.about)
  const contactPage = pageInCulture(culture, linksQueryResult.contact)
  const solutionsPage = pageInCulture(culture, linksQueryResult.solutions)
  const productsPage = pageInCulture(culture, linksQueryResult.products)
  const solutionItems = linksQueryResult.allSolution.edges.map(({ node }) => {
    return pageInCulture(culture, node)
  })
  const productItems = linksQueryResult.allProduct.edges.map(({ node }) => {
    return pageInCulture(culture, node)
  })

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-6 col-lg-3">
            <Link to={solutionsPage.url}>
              <h4>{solutionsPage.navigationText}</h4>
            </Link>
            <ul className="list-unstyled">
              {solutionItems.map((s, i) => (
                <li key={i}>
                  <Link to={s.url} key={i}>
                    {s.navigationText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <h4>{productsPage.navigationText}</h4>
            <ul className="list-unstyled">
              {productItems.map((p, i) => (
                <li key={i}>
                  <Link to={p.url}>{p.navigationText}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <Link to={aboutPage.url}>
              <h4 className={"mb-4"}>{aboutPage.navigationText}</h4>
            </Link>
            <Link to={contactPage.url}>
              <h4>{contactPage.navigationText}</h4>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = {}

Footer.defaultProps = {}

export default Footer
