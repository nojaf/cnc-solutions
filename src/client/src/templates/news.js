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

const monthNamesNl = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
]

const monthNamesEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const monthNamesFr = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

function getMonthName(currentCulture, month) {
  if (currentCulture === "nl") {
    return monthNamesNl[month]
  } else if (currentCulture === "en") {
    return monthNamesEn[month]
  } else if (currentCulture === "fr") {
    return monthNamesFr[month]
  }
}

const NewsPageThumbnail = ({ newsPage, currentCulture, readMoreText }) => {
  const publicationDate = new Date(newsPage.publicationDate)
  const thumbnail = parseNewsPageThumbnail(newsPage)
  return (
    <article className="row news-thumbnail">
      <picture className="col-12 col-lg-6 order-lg-0">
        <source media="(min-width: 75em)" srcSet={thumbnail.desktop} />
        <source media="(min-width: 62em)" srcSet={thumbnail.tablet} />
        <img src={thumbnail.mobile} alt={newsPage.title} />
      </picture>
      <div className="col-12 col-lg-6 order-lg-1">
        <time>
          {publicationDate.getDate().toString().padStart(2, "0")}{" "}
          {getMonthName(currentCulture, publicationDate.getMonth())}{" "}
          {publicationDate.getFullYear()}
        </time>
        <h3>{newsPage.title}</h3>
        <p className="text-muted">{newsPage.overviewLead}</p>
        <div className="text-right">
          <Link to={newsPage.url} className={`btn-cnc`}>
            {readMoreText}
            <span className="corner" />
            <span className="inner-corner" />
          </Link>
        </div>
      </div>
    </article>
  )
}

const NewsPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const news = pageInCulture(currentCulture, data.news)
  const newsPages = data.allNewsPage.nodes.map((newsPage) =>
    pageInCulture(currentCulture, newsPage)
  )
  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
      mainClass="news-page"
    >
      <Header currentPage={news} />
      <PageIntroduction {...news} />
      <main id="news-overview" className="container">
        {newsPages.map((newsPage) => (
          <NewsPageThumbnail
            key={newsPage.umbracoId}
            newsPage={newsPage}
            currentCulture={currentCulture}
            readMoreText={news.readMoreText}
          />
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
      readMoreText {
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
        overviewLead {
          nl
          fr
          en
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
