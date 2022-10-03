import React from "react"
import { pageInCulture, useUrl } from "../selectors"
import Layout from "../components/layout"
import Header from "../components/header"
import { graphql, Link } from "gatsby"
import PageIntroduction from "../components/pageIntroduction"
import underlineWhite from "../images/underline-white.png"
import Video from "../components/video"
import BottomEdge from "../components/bottomEdge"
import SlideShow from "../components/slideShow"

const ImageOrSlideShow = ({ currentCulture, umbracoId, slides }) => {
  if (slides && slides.length > 1) {
    return (
      <SlideShow
        culture={currentCulture}
        slides={slides}
        umbracoId={umbracoId}
        color={"light"}
      />
    )
  } else {
    const { image, altText } = pageInCulture(currentCulture, slides[0])
    return (
      <picture>
        <source media="(min-width: 62em)" srcSet={image.desktop} />
        <source media="(min-width: 48em)" srcSet={image.tablet} />
        <img src={image.mobile} srcSet={image.mobile} alt={altText} />
      </picture>
    )
  }
}

const CaseRow = (props) => {
  const {
    currentCulture,
    videoId,
    isMediaRight,
    aboveTitle,
    title,
    lead,
    linkUrl,
    linkText,
    slides,
    umbracoId,
  } = props
  const link = useUrl(currentCulture, linkUrl)
  const showLink = link && linkText
  return (
    <div className="row no-gutters">
      <div className="col-12 col-md-6">
        <div className="case-image">
          {videoId ? (
            <Video
              videoId={videoId}
              altText={title}
              mute={false}
              controls={true}
              autoplay={false}
            />
          ) : (
            slides && (
              <ImageOrSlideShow
                currentCulture={currentCulture}
                slides={slides}
                umbracoId={umbracoId}
              />
            )
          )}
        </div>
      </div>
      <div
        className={`col-12 col-md-6 ${isMediaRight ? "order-md-first" : ""}`}
      >
        <div className="case-info">
          <h3 className="above">{aboveTitle}</h3>
          <h2>{title}</h2>
          <img src={underlineWhite} className="underline-bar" alt="" />
          <div dangerouslySetInnerHTML={{ __html: lead }}></div>
          {showLink && (
            <div className={"link-container"}>
              <Link to={link} className="btn-cnc">
                {linkText}
                <span className="corner" />
                <span className="inner-corner" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const QuoteRow = ({ quote, clientName }) => {
  return (
    <div className="row no-gutters quote-row">
      <div className="col-12">
        <blockquote>{quote}</blockquote>
        {clientName && <span>&#45;&nbsp;{clientName}</span>}
      </div>
    </div>
  )
}

const CasePage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const casePage = pageInCulture(currentCulture, data.casePage)
  const rows = [...data.allCaseRow.nodes, ...data.allQuoteRow.nodes]
    .map((n) => pageInCulture(currentCulture, n))
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <Layout
      culture={pageContext.culture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={casePage} />
      <PageIntroduction {...casePage} />
      <section id="case-rows">
        <div className="container-fluid px-0">
          {rows.map((row) => {
            if (row.typeName === "caseRow") {
              return <CaseRow {...row} currentCulture={currentCulture} />
            } else {
              return <QuoteRow {...row} />
            }
          })}
        </div>
      </section>
      <BottomEdge />
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
    allCaseRow(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      nodes {
        key: umbracoId
        umbracoId
        typeName: __typename
        sortOrder
        aboveTitle {
          nl
          fr
          en
        }
        title {
          nl
          fr
          en
        }
        lead {
          nl
          fr
          en
        }
        isMediaRight {
          nl
          fr
          en
        }
        videoId {
          nl
          fr
          en
        }
        linkUrl {
          nl
          fr
          en
        }
        linkText {
          nl
          fr
          en
        }
        slides: childrenCaseSlideshowImage {
          umbracoId
          parentUmbracoId
          image {
            nl {
              large_desktop: desktop
              desktop
              tablet
              mobile_landscape: mobile
              mobile_portrait: mobile
            }
            fr {
              large_desktop: desktop
              desktop
              tablet
              mobile_landscape: mobile
              mobile_portrait: mobile
            }
            en {
              large_desktop: desktop
              desktop
              tablet
              mobile_landscape: mobile
              mobile_portrait: mobile
            }
          }
          altText {
            en
            nl
            fr
          }
        }
      }
    }
    allQuoteRow(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      nodes {
        key: umbracoId
        typeName: __typename
        sortOrder
        quote {
          nl
          en
          fr
        }
        clientName {
          nl
          en
          fr
        }
      }
    }
  }
`
