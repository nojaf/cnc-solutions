import React from "react"
import { graphql, Link } from "gatsby"
import { pageInCulture } from "../selectors"
import Layout from "../components/layout"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"

function parseNewsPageThumbnail(newsPage) {
  return {
    desktop: newsPage.thumbnail.desktop,
    large_desktop: newsPage.thumbnail.large_desktop,
    mobile: newsPage.thumbnail.mobile,
  }
}

const NewsPageThumbnail = ({ newsPage, currentCulture }) => {
  const publicationDate = new Date(newsPage.publicationDate[currentCulture])
  const thumbnail = parseNewsPageThumbnail(
    pageInCulture(currentCulture, newsPage)
  )
  return (
    <div>
      <h3>{newsPage.title[currentCulture]}</h3>
      <time>
        {publicationDate.getDate()} / {publicationDate.getMonth() + 1} /{" "}
        {publicationDate.getFullYear()}
      </time>
      <picture>
        <source media="(min-width: 75em)" srcSet={thumbnail.large_desktop} />
        <source media="(min-width: 62em)" srcSet={thumbnail.desktop} />
        <img src={thumbnail.mobile} alt={newsPage.title[currentCulture]} />
      </picture>
    </div>
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
        {newsPages
          .reduce((rows, newsPage, index) => {
            const rowIndex = Math.floor(index / 3)
            if (!rows[rowIndex]) {
              rows[rowIndex] = []
            }
            rows[rowIndex].push(newsPage)
            return rows
          }, [])
          .map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((newsPage) => (
                <div key={newsPage.umbracoId} className="col-12 col-md-4 mb-4">
                  <NewsPageThumbnail
                    newsPage={newsPage}
                    currentCulture={currentCulture}
                  />
                </div>
              ))}
            </div>
          ))}
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
            large_desktop
            mobile
          }
          fr {
            desktop
            large_desktop
            mobile
          }
          nl {
            desktop
            large_desktop
            mobile
          }
        }
      }
    }
  }
`
