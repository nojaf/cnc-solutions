import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { pageInCulture, useUrl } from "../selectors"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"

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
  const blocks = [...texts, ...images].toSorted(
    (a, b) => a.sortOrder - b.sortOrder || a.key - b.key
  )
  console.log(blocks)
  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={newsPage} />
      <PageIntroduction {...newsPage} />
      <div className="container">
        {blocks.map((block) =>
          block.kind === "newsText" ? (
            <TextBlock {...block} />
          ) : (
            <ImageBlock {...block} />
          )
        )}
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
  }
`
