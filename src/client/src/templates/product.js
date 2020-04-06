import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { pageInCulture, useUrl } from "../selectors"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"
import underlineWhite from "../images/underline-white.png"
import Video from "../components/video"

const ProductVideo = ({ videoId, altText }) => {
  const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&rel=0&modestbranding=1&controls=0&showinfo=0&origin=https://cncsolutions.be&playlist=${videoId}&mute=1`
  return (
    <Video videoSrcURL={url} videoTitle={altText} width={640} height={360} />
  )
}

const ProductHighlightRow = ({
  image,
  videoId,
  isMediaRight,
  aboveTitle,
  title,
  lead,
  altText,
}) => {
  return (
    <div className="row no-gutters">
      <div className="col-12 col-md-6">
        <div className="product-image">
          {videoId ? (
            <ProductVideo videoId={videoId} altText={altText} />
          ) : (
            <picture>
              <source media="(min-width: 62em)" srcSet={image.desktop} />
              <source media="(min-width: 48em)" srcSet={image.tablet} />
              <img src={image.mobile} srcSet={image.mobile} alt={altText} />
            </picture>
          )}
        </div>
      </div>
      <div
        className={`col-12 col-md-6 ${isMediaRight ? "order-md-first" : ""}`}
      >
        <div className="product-info">
          <h3 className="above">{aboveTitle}</h3>
          <h2>{title}</h2>
          <img src={underlineWhite} className="underline-bar" alt="" />
          <div dangerouslySetInnerHTML={{ __html: lead }}></div>
        </div>
      </div>
    </div>
  )
}

const Feature = ({ icon, title, lead }) => {
  return (
    <>
      <img src={icon} alt="" />
      <div>
        <h4>{title}</h4>
        <div dangerouslySetInnerHTML={{ __html: lead }}></div>
      </div>
    </>
  )
}

const Features = ({ features, aboveFeature, featureTitle }) => {
  return (
    <section id="features">
      <div className="container">
        <div className="heading">
          <h3 className="above">{aboveFeature}</h3>
          <h2>{featureTitle}</h2>
        </div>
        <div className="body">
          {features.map(f => (
            <Feature key={f.umbracoId} {...f} />
          ))}
        </div>
      </div>
    </section>
  )
}

const MoreInfo = ({
  aboveMoreInfo,
  moreInfoTitle,
  moreInfoLead,
  fileDownloadFile,
  fileDownloadText,
  contactPageLink,
  contactPageText,
  culture,
}) => {
  const contactLink = useUrl(culture, contactPageLink)
  const showDownload = fileDownloadFile && fileDownloadText
  const showContact = contactLink && contactPageText
  return (
    <section id="more-info">
      <div className="container text-center">
        <h3 className="above">{aboveMoreInfo}</h3>
        <h2>{moreInfoTitle}</h2>
        <img src={underlineWhite} className="underline-bar" alt={""} />
        <div dangerouslySetInnerHTML={{ __html: moreInfoLead }}></div>
        {showDownload && (
          <a
            href={fileDownloadFile}
            download
            className="btn-outline-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {fileDownloadText}
            <span className="corner" />
            <span className="inner-corner" />
          </a>
        )}
        {showContact && (
          <Link to={contactLink} className="btn-outline-primary">
            {contactPageText}
            <span className="corner" />
            <span className="inner-corner" />
          </Link>
        )}
      </div>
    </section>
  )
}

export default ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const product = pageInCulture(currentCulture, data.product)
  const productRows = data.allProductRow.nodes.map(n =>
    pageInCulture(currentCulture, n)
  )
  const productFeatures = data.allProductFeature.nodes.map(n =>
    pageInCulture(currentCulture, n)
  )

  return (
    <Layout
      culture={pageContext.culture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={product} />
      <PageIntroduction {...product} />
      <section id="product-highlights">
        <div className="container-fluid px-0">
          {productRows.map(pr => (
            <ProductHighlightRow {...pr} key={pr.umbracoId} />
          ))}
        </div>
      </section>
      <Features features={productFeatures} {...product} />
      <MoreInfo {...product} culture={currentCulture} />
    </Layout>
  )
}
export const query = graphql`
  query getProduct($umbracoId: Int) {
    product(umbracoId: { eq: $umbracoId }) {
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
      aboveFeature {
        nl
        en
        fr
      }
      featureTitle {
        nl
        en
        fr
      }
      aboveMoreInfo {
        nl
        en
        fr
      }
      moreInfoTitle {
        nl
        en
        fr
      }
      moreInfoLead {
        nl
        en
        fr
      }
      fileDownloadFile {
        nl
        en
        fr
      }
      fileDownloadText {
        nl
        en
        fr
      }
      contactPageLink {
        nl
        en
        fr
      }
      contactPageText {
        nl
        en
        fr
      }
    }
    allProductRow(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      nodes {
        umbracoId
        image {
          nl {
            mobile
            tablet
            desktop
          }
          en {
            mobile
            tablet
            desktop
          }
          fr {
            mobile
            tablet
            desktop
          }
        }
        altText {
          nl
          en
          fr
        }
        isMediaRight {
          en
          nl
          fr
        }
        videoId {
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
    allProductFeature(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      nodes {
        key: umbracoId
        icon {
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
  }
`
