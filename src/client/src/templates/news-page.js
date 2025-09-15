import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { pageInCulture } from "../selectors"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"
import Video from "../components/video"

const VideoBlock = ({ videoId }) => {
  return (
    <div className="news-video">
      <Video videoId={videoId} autoplay={false} controls={true} mute={false} />
    </div>
  )
}

const TextBlock = ({ content }) => {
  return (
    <div
      className="news-text"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  )
}

const ImageBlock = ({ image, altText, caption, isFullWidth }) => {
  const imgTag = (
    <img
      className={isFullWidth ? "full-width" : ""}
      src={image}
      alt={altText}
    />
  )
  return (
    <div className="news-image">
      {caption ? (
        <figure>
          {imgTag}
          <figcaption>{caption}</figcaption>
        </figure>
      ) : (
        imgTag
      )}
    </div>
  )
}

const NewsPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const newsPage = pageInCulture(currentCulture, data.newsPage)
  const texts = data.texts.nodes.map((node) =>
    pageInCulture(currentCulture, node)
  )
  const images = data.images.nodes.map((node) =>
    pageInCulture(currentCulture, node)
  )
  const videos = data.videos.nodes.map((node) =>
    pageInCulture(currentCulture, node)
  )
  const blocks = [...texts, ...images, ...videos].toSorted(
    (a, b) => a.sortOrder - b.sortOrder || a.key - b.key
  )
  const previousNewsLinkText = data.news.previousNewsLinkText[currentCulture]
  const nextNewsLinkText = data.news.nextNewsLinkText[currentCulture]
  const otherNews = data.otherNews.nodes
    .map((node) => {
      const otherNews = pageInCulture(currentCulture, node)
      return {
        ...otherNews,
        publicationDate: new Date(otherNews.publicationDate),
      }
    })
    .toSorted(
      (a, b) => a.publicationDate.getTime() - b.publicationDate.getTime()
    )
  const currentNewsDate = new Date(newsPage.publicationDate)
  const previousNews = otherNews.find(
    (otherNews) =>
      otherNews.publicationDate.getTime() < currentNewsDate.getTime()
  )
  const nextNews = otherNews.find(
    (otherNews) =>
      otherNews.publicationDate.getTime() > currentNewsDate.getTime()
  )

  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={newsPage} />
      <PageIntroduction {...newsPage} />
      <div className="container">
        {blocks.map((block) => {
          switch (block.kind) {
            case "newsText":
              return <TextBlock {...block} />
            case "newsImage":
              return <ImageBlock {...block} />
            case "newsVideo":
              return <VideoBlock {...block} />
            default:
              return null
          }
        })}
      </div>
      <div className="container" id="news-detail-navigation">
        {previousNews ? (
          <Link to={previousNews.url}>{previousNewsLinkText}</Link>
        ) : (
          <span>&nbsp;</span>
        )}
        {nextNews && <Link to={nextNews.url}>{nextNewsLinkText}</Link>}
      </div>
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
      publicationDate {
        nl
        en
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
    texts: allNewsText(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      nodes {
        key: umbracoId
        kind: __typename
        sortOrder
        content {
          nl
          en
          fr
        }
      }
    }
    images: allNewsImage(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      nodes {
        key: umbracoId
        kind: __typename
        sortOrder
        image {
          nl
          en
          fr
        }
        altText {
          nl
          fr
          en
        }
        caption {
          nl
          fr
          en
        }
        isFullWidth {
          nl
          fr
          en
        }
      }
    }
    videos: allNewsVideo(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      nodes {
        key: umbracoId
        kind: __typename
        sortOrder
        videoId {
          nl
          en
          fr
        }
      }
    }
    otherNews: allNewsPage(filter: { umbracoId: { ne: $umbracoId } }) {
      nodes {
        umbracoId
        publicationDate {
          nl
          en
          fr
        }
        url {
          nl
          en
          fr
        }
      }
    }
    news {
      previousNewsLinkText {
        nl
        fr
        en
      }
      nextNewsLinkText {
        nl
        fr
        en
      }
    }
  }
`
