import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Header from "../components/header"
import underlineWhite from "../images/underline-white.png"
import { pageInCulture, useUrl } from "../selectors"
import PageIntroduction from "../components/pageIntroduction"
import Video from "../components/video"

const AboutRowLink = ({ linkText, linkUrl, culture }) => {
  const url = useUrl(culture, linkUrl)

  return (
    <Link to={url} className="btn-cnc">
      {linkText}
      <span className="corner" />
      <span className="inner-corner" />
    </Link>
  )
}

const AboutRowImage = ({ desktop, medium, small, tablet, altText }) => {
  return (
    <picture>
      <source media="(min-width: 75em)" srcSet={desktop} />
      <source media="(min-width: 62em)" srcSet={tablet} />
      <source media="(min-width: 48em)" srcSet={tablet} />
      <source media="(min-width: 34em)" srcSet={medium} />
      <img className="w-100" src={small} srcSet={small} alt={altText} />
    </picture>
  )
}

const AboutRow = ({ culture, page }) => {
  const currentPage = pageInCulture(culture, page)
  const [imageClass, contentClass] = currentPage.imageRight
    ? ["order-md-1", "order-md-0"]
    : ["order-md-0", "order-md-1"]

  return (
    <section className="about-row-section">
      <div className="container-md p-0">
        <div className="row no-gutters about-row">
          <div className={`col-12 col-md-6 ${imageClass}`}>
            {currentPage.image && (
              <AboutRowImage
                {...currentPage.image}
                altText={currentPage.altText}
              />
            )}
            {currentPage.videoId && (
              <Video
                videoId={currentPage.videoId}
                altText={currentPage.altText}
                controls={true}
                mute={false}
                autoplay={false}
              />
            )}
          </div>
          <div className={`col-12 col-md-6 ${contentClass}`}>
            <div className="container content">
              {currentPage.aboveTitle && (
                <h3 className="above">{currentPage.aboveTitle}</h3>
              )}
              <h2>{currentPage.title}</h2>
              <img
                src={underlineWhite}
                alt={"underline-bar"}
                className="underline-bar"
              />
              <div dangerouslySetInnerHTML={{ __html: currentPage.lead }}></div>
              {currentPage.linkText && (
                <AboutRowLink {...currentPage} culture={culture} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const AboutPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const about = pageInCulture(currentCulture, data.about)
  const rows = data.allAboutRow.edges.map((e) => e.node)

  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
      mainClass="about-page"
    >
      <Header currentPage={about} />
      <PageIntroduction {...about} />
      {rows.map((r) => (
        <AboutRow page={r} culture={currentCulture} key={r.key} />
      ))}
    </Layout>
  )
}
export default AboutPage

export const query = graphql`
  query getAboutPage($umbracoId: Int) {
    about(umbracoId: { eq: $umbracoId }) {
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
    allAboutRow(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      edges {
        node {
          key: id
          name
          image {
            nl {
              desktop
              medium
              small
              tablet
            }
            en {
              desktop
              medium
              small
              tablet
            }
            fr {
              desktop
              medium
              small
              tablet
            }
          }
          imageRight {
            en
            nl
            fr
          }
          title {
            en
            nl
            fr
          }
          aboveTitle {
            en
            nl
            fr
          }
          lead {
            en
            nl
            fr
          }
          linkText {
            en
            nl
            fr
          }
          linkUrl {
            en
            nl
            fr
          }
          altText {
            en
            nl
            fr
          }
          videoId {
            en
            nl
            fr
          }
        }
      }
    }
  }
`
