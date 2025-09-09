import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { pageInCulture, useUrl } from "../selectors"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"

const NewsPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const newsPage = pageInCulture(currentCulture, data.newsPage)
  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={newsPage} />
      <PageIntroduction {...newsPage} />
    </Layout>
  )
}
export default NewsPage

export const query = graphql`
  query getNewsPage($umbracoId: Int) {
    newsPage(umbracoId: { eq: $umbracoId }) {
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
