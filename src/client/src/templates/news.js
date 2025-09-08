import React from "react"
import { graphql, Link } from "gatsby"
import { pageInCulture } from "../selectors"
import Layout from "../components/layout"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"

const NewsPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const news = pageInCulture(currentCulture, data.news)
  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
      mainClass="news-page"
    >
      <Header currentPage={news} />
      <PageIntroduction {...news} />
      <div>NewsPage {JSON.stringify(currentCulture)}</div>
    </Layout>
  )
}

export default NewsPage
export const query = graphql`
  query {
    news {
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
        en
        nl
        fr
      }
      title {
        en
        nl
        fr
      }
      lead {
        en
        nl
        fr
      }
    }
  }
`
