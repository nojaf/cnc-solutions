import React, { useEffect, useRef, useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { pageInCulture, useUrl } from "../selectors"
import underlineDark from "../images/underline-dark.png"
import underlineWhite from "../images/underline-white.png"
import HomeVideoMp4 from "../videos/home.mp4"
import HomeVideoWebm from "../videos/home.webm"

const Hero = ({
  culture,
  aboveSlogan,
  slogan,
  mobilePlaceholder,
  firstFrameVideo,
  primaryLink,
  primaryLinkText,
}) => {
  const primaryLinkUrl = useUrl(culture, primaryLink)
  const showLink = primaryLinkText && primaryLinkUrl
  const videoEl = useRef(null)
  const [videoHeight, setVideoHeight] = useState(200)

  useEffect(() => {
    if (videoEl.current) {
      setVideoHeight(videoEl.current.clientHeight)
    }
  }, [videoEl, setVideoHeight])

  return (
    <section id="hero" style={{ height: videoHeight }}>
      <div className="hero-content container">
        <p className="above">{aboveSlogan}</p>
        <h1>{slogan}</h1>
        {showLink && (
          <Link to={primaryLinkUrl} className="btn btn-cnc">
            {primaryLinkText}
          </Link>
        )}
      </div>
      <div
        id="mobile-stil"
        style={{ backgroundImage: `url(${mobilePlaceholder.mobile})` }}
        className="d-block d-sm-none"
      ></div>
      <div id="hero-video" style={{ height: videoHeight }}>
        <video
          autoPlay
          loop
          muted
          poster={firstFrameVideo.scene}
          ref={videoEl}
        >
          <source src={HomeVideoMp4} type="video/mp4" />
          <source src={HomeVideoWebm} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="overlay"></div>
      <div className="edge-container">
        <div className="edge"></div>
      </div>
    </section>
  )
}

const SolutionSlide = ({
  umbracoId,
  culture,
  isActive,
  thumbnail,
  thumbnailAlt,
  icon,
  title,
}) => {
  const url = useUrl(culture, umbracoId)
  const { homepage_mobile, homepage_tablet } = thumbnail
  return (
    <Link to={url} className={`carousel-item ${isActive && "active"}`}>
      <picture>
        <source media="(min-width: 48em)" srcSet={homepage_tablet} />
        <img
          src={homepage_mobile}
          srcSet={homepage_mobile}
          alt={thumbnailAlt}
        />
      </picture>
      <div className="cover"></div>
      <div className="carousel-caption">
        <img src={icon} alt={title} />
        <h5>{title}</h5>
      </div>
    </Link>
  )
}

const SolutionTile = ({
  culture,
  umbracoId,
  icon,
  thumbnail,
  thumbnailAlt,
  navigationText,
}) => {
  const url = useUrl(culture, umbracoId)
  const { homepage_desktop, homepage_large_desktop } = thumbnail
  return (
    <Link to={url}>
      <picture>
        <source media="(min-width: 75em)" srcSet={homepage_large_desktop} />
        <source media="(min-width: 62em)" srcSet={homepage_desktop} />
        <img
          src={homepage_desktop}
          alt={thumbnailAlt}
          className="bg"
          srcSet={homepage_desktop}
        />
      </picture>
      <img src={icon} alt="" className="icon" />
      <div className="overlay">
        <img src={icon} alt="" className="icon" />
        <h3>{navigationText}</h3>
      </div>
    </Link>
  )
}

const Solutions = ({ aboveSolutions, solutionsTitle, solutions, culture }) => {
  return (
    <section id="solutions" className="bg-dark text-white">
      <p className="above">{aboveSolutions}</p>
      <div className="title-container">
        <h2>{solutionsTitle}</h2>
        <img src={underlineDark} alt={""} />
      </div>
      <div className="carousel slide d-lg-none" id="solutionsCarousel">
        <div className="carousel-inner">
          {solutions.map((s, i) => (
            <SolutionSlide
              key={s.umbracoId}
              {...s}
              culture={culture}
              isActive={i === 0}
            />
          ))}
        </div>
        <a
          className="carousel-control-prev"
          href="#solutionsCarousel"
          role="button"
          data-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#solutionsCarousel"
          role="button"
          data-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </a>
      </div>
      <div className="container" id="solution-links">
        {solutions.map(s => (
          <SolutionTile culture={culture} key={s.umbracoId} {...s} />
        ))}
      </div>
    </section>
  )
}

const HomeRow = ({
  culture,
  theme,
  aboveTitle,
  title,
  lead,
  linkText,
  linkNode,
  fileDownloadFile,
  imageRight,
  image,
  altText,
}) => {
  const underline = theme === "dark" ? underlineDark : underlineWhite
  const link = useUrl(culture, linkNode)
  const { phone, tablet, desktop, largeDesktop } = image

  return (
    <section className={`home-row ${theme}`}>
      <div className="container">
        <div className="row">
          <div
            className={`col-xs-12 col-lg-7 ${
              imageRight ? "order-lg-1" : "order-lg-0"
            }`}
          >
            <picture>
              <source media="(min-width: 75em)" srcSet={largeDesktop} />
              <source media="(min-width: 62em)" srcSet={desktop} />
              <source media="(min-width: 48em)" srcSet={tablet} />
              <img src={phone} srcSet={phone} alt={altText} />
            </picture>
          </div>
          <div
            className={`col-xs-12 col-lg-5 ${
              imageRight ? "order-lg-0" : "order-lg-1"
            }`}
          >
            <h3 className="above text-lowercase">{aboveTitle}</h3>
            <h2>{title}</h2>
            <img src={underline} className="underline-bar" alt={""} />
            <div dangerouslySetInnerHTML={{ __html: lead }}></div>
            {linkText && linkNode && (
              <div className="link-container">
                <Link to={link} className={`btn-cnc ${theme}`}>
                  {linkText}
                  <span className="corner" />
                  <span className="inner-corner" />
                </Link>
              </div>
            )}
            {linkText && fileDownloadFile && (
              <div className="link-container">
                <a
                  href={fileDownloadFile}
                  download
                  className="btn-cnc"
                  rel="noreferrer"
                  target="_blank"
                >
                  {linkText}
                  <span className="corner" />
                  <span className="inner-corner" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const IndexPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const home = pageInCulture(currentCulture, data.home)
  const solutions = data.allSolution.nodes.map(n =>
    pageInCulture(currentCulture, n)
  )
  const homeRows = data.home.childrenHomeRow.map(hr =>
    pageInCulture(currentCulture, hr)
  )
  return (
    <Layout
      culture={pageContext.culture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Hero culture={currentCulture} {...home} />
      <Solutions {...home} solutions={solutions} culture={currentCulture} />
      {homeRows.map(hr => (
        <HomeRow culture={currentCulture} {...hr} />
      ))}
    </Layout>
  )
}

export default IndexPage;
export const query = graphql`
  query {
    home {
      url {
        nl
        en
        fr
      }
      id
      mobilePlaceholder {
        nl {
          mobile
        }
        en {
          mobile
        }
        fr {
          mobile
        }
      }
      firstFrameVideo {
        nl {
          scene
        }
        fr {
          scene
        }
        en {
          scene
        }
      }
      aboveSlogan {
        nl
        en
        fr
      }
      slogan {
        en
        nl
        fr
      }
      solutionsTitle {
        en
        nl
        fr
      }
      primaryLink {
        nl
        en
        fr
      }
      primaryLinkText {
        nl
        en
        fr
      }
      videoId {
        en
        nl
        fr
      }
      aboveSolutions {
        nl
        en
        fr
      }
      solutionsTitle {
        nl
        en
        fr
      }
      childrenHomeRow {
        key: id
        theme {
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
          nl
          en
          fr
        }
        linkText {
          en
          nl
          fr
        }
        linkNode {
          en
          nl
          fr
        }
        imageRight {
          en
          nl
          fr
        }
        image {
          en {
            phone
            tablet
            desktop
            largeDesktop
          }
          nl {
            phone
            tablet
            desktop
            largeDesktop
          }
          fr {
            phone
            tablet
            desktop
            largeDesktop
          }
        }
        altText {
          nl
          en
          fr
        }
      }
    }
    allSolution {
      nodes {
        umbracoId
        thumbnail {
          nl {
            homepage_mobile
            homepage_tablet
            homepage_desktop
            homepage_large_desktop
          }
          en {
            homepage_mobile
            homepage_tablet
            homepage_desktop
            homepage_large_desktop
          }
          fr {
            homepage_mobile
            homepage_tablet
            homepage_desktop
            homepage_large_desktop
          }
        }
        thumbnailAlt {
          nl
          en
          fr
        }
        icon {
          nl
          en
          fr
        }
        navigationText {
          nl
          en
          fr
        }
        title {
          nl
          en
          fr
        }
      }
    }
  }
`
