import React from "react"
import { graphql, Link } from "gatsby"
import { pageInCulture } from "../selectors"
import Layout from "../components/layout"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"

function parseNewsPageThumbnail(newsPage) {
  return {
    desktop: newsPage.thumbnail.desktop,
    tablet: newsPage.thumbnail.tablet,
    mobile: newsPage.thumbnail.mobile,
  }
}

const NewsPageThumbnail = ({ newsPage, currentCulture }) => {
  const publicationDate = new Date(newsPage.publicationDate[currentCulture])
  const thumbnail = parseNewsPageThumbnail(
    pageInCulture(currentCulture, newsPage)
  )
  return (
    <a href={newsPage.url[currentCulture]} className="news-thumbnail">
      <article>
        <h3>{newsPage.title[currentCulture]}</h3>
        <time>
          {publicationDate.getDate().toString().padStart(2, "0")}/
          {(publicationDate.getMonth() + 1).toString().padStart(2, "0")}/
          {publicationDate.getFullYear()}
        </time>
        <picture>
          <source media="(min-width: 75em)" srcSet={thumbnail.desktop} />
          <source media="(min-width: 62em)" srcSet={thumbnail.tablet} />
          <img src={thumbnail.mobile} alt={newsPage.title[currentCulture]} />
        </picture>
      </article>
    </a>
  )
}

const NewsPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const news = pageInCulture(currentCulture, data.news)
  const newsPages = data.allNewsPage.nodes
  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
      mainClass="news-page"
    >
      <Header currentPage={news} />
      <PageIntroduction {...news} />
      <main className="container">
        <div className="row news-grid">
          {newsPages.map((newsPage) => (
            <NewsPageThumbnail
              key={newsPage.umbracoId}
              newsPage={newsPage}
              currentCulture={currentCulture}
            />
          ))}
        </div>
      </main>
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
    allNewsPage(sort: { fields: publicationDate___nl, order: DESC }) {
      nodes {
        umbracoId
        url {
          en
          fr
          nl
        }
        title {
          en
          fr
          nl
        }
        publicationDate {
          en
          fr
          nl
        }
        thumbnail {
          en {
            desktop
            tablet
            mobile
          }
          fr {
            desktop
            tablet
            mobile
          }
          nl {
            desktop
            tablet
            mobile
          }
        }
      }
    }
  }
`
