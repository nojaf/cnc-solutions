import React from "react"
import { graphql, Link } from "gatsby"
import { pageInCulture } from "../selectors"
import Header from "../components/header"
import Layout from "../components/layout"
import PageIntroduction from "../components/pageIntroduction"

const Case = ({ thumbnail, thumbnailAlt, title, url }) => {
  const {
    overview_desktop,
    overview_large_desktop,
    overview_mobile,
    overview_tablet_landscape,
    overview_tablet_portrait,
  } = thumbnail
  return (
    <Link to={url} className="case-tile">
      <div className="case-tile-img">
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
      </div>
      <div className="case-tile-title">
        <h3>{title}</h3>
      </div>
    </Link>
  )
}

const CasesPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const cases = pageInCulture(currentCulture, data.cases)
  const caseItems = data.allCase.edges.map(({ node }) => {
    return pageInCulture(currentCulture, node)
  })

  return (
    <Layout
      culture={pageContext.culture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={cases} />
      <PageIntroduction {...cases} />
      <section>
        <div className="container">
          <div id="case-tiles">
            {caseItems.map((sl) => (
              <Case {...sl} />
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

export default CasesPage
export const query = graphql`
  query {
    cases {
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
    allCase {
      edges {
        node {
          key: umbracoId
          url {
            en
            nl
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
