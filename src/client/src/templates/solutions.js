import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { pageInCulture } from "../selectors"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"

const Solution = ({ thumbnail, thumbnailAlt, title, url, icon }) => {
  const {
    overview_desktop,
    overview_large_desktop,
    overview_mobile,
    overview_tablet_landscape,
    overview_tablet_portrait,
  } = thumbnail
  return (
    <Link to={url} className="solution-tile">
      <div className="solution-tile-img">
        <picture>
          <source media="(min-width: 75em)" srcSet={overview_large_desktop} />
          <source media="(min-width: 62em)" srcSet={overview_desktop} />
          <source
            media="(min-width: 48em)"
            srcSet={overview_tablet_landscape}
          />
          <source media="(min-width: 34em)" srcSet={overview_tablet_portrait} />
          <img
            src={overview_mobile}
            srcSet={overview_mobile}
            alt={thumbnailAlt}
          />
        </picture>
        <img src={icon} alt={""} className="overlay-icon" />
      </div>
      <div className="solution-tile-title">
        <h3>{title}</h3>
      </div>
    </Link>
  )
}

const SolutionPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const solutions = pageInCulture(currentCulture, data.solutions)
  const solutionItems = data.allSolution.edges.map(({ node }) => {
    return pageInCulture(currentCulture, node)
  })

  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={solutions} />
      <PageIntroduction {...solutions} />
      <section>
        <div className="container">
          <div id="solution-tiles">
            {solutionItems.map(sl => (
              <Solution {...sl} />
            ))}
          </div>
        </div>
        <div className="edge-container w-100">
          <div className="edge"></div>
        </div>
      </section>
    </Layout>
  )
}

export default SolutionPage;
export const query = graphql`
  query {
    solutions {
      url {
        nl
        en
        fr
      }
      id
      headerImage {
        nl {
          mobile
          tablet
          desktop
          large_desktop
        }
        en {
          mobile
          tablet
          desktop
          large_desktop
        }
        fr {
          mobile
          tablet
          desktop
          large_desktop
        }
      }
      headerImageAlt {
        en
        nl
        fr
      }
      aboveTitle {
        nl
        en
        fr
      }
      title {
        nl
        en
        fr
      }
      lead {
        nl
        en
        fr
      }
    }
    allSolution {
      edges {
        node {
          key: umbracoId
          url {
            en
            nl
            fr
          }
          icon {
            nl
            en
            fr
          }
          thumbnail {
            nl {
              homepage_mobile
              homepage_desktop
              homepage_large_desktop
              overview_desktop
              homepage_tablet
              overview_large_desktop
              overview_mobile
              overview_tablet_landscape
              overview_tablet_portrait
            }
            en {
              homepage_mobile
              homepage_desktop
              homepage_large_desktop
              overview_desktop
              homepage_tablet
              overview_large_desktop
              overview_mobile
              overview_tablet_landscape
              overview_tablet_portrait
            }
            fr {
              homepage_mobile
              homepage_desktop
              homepage_large_desktop
              overview_desktop
              homepage_tablet
              overview_large_desktop
              overview_mobile
              overview_tablet_landscape
              overview_tablet_portrait
            }
          }
          thumbnailAlt {
            en
            nl
            fr
          }
          title {
            en
            nl
            fr
          }
        }
      }
    }
  }
`
