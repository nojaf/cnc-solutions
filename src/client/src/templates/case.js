import React from "react"
import { pageInCulture } from "../selectors"
import Layout from "../components/layout"
import Header from "../components/header"
import { graphql } from "gatsby"
import PageIntroduction from "../components/pageIntroduction"

const CasePage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const casePage = pageInCulture(currentCulture, data.casePage)

  return (
    <Layout
      culture={pageContext.culture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={casePage} />
      <PageIntroduction {...casePage} />
    </Layout>
  )
}
export default CasePage
export const query = graphql`
  query getCase($umbracoId: Int) {
    casePage: case(umbracoId: { eq: $umbracoId }) {
      umbracoId
      url {
        en
        nl
        fr
      }
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
  }
`
