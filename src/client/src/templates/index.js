import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { pageInCulture, useUrl } from "../selectors"
import underlineDark from "../images/underline-dark.png"
import underlineWhite from "../images/underline-white.png"

const Hero = ({
  culture,
  aboveSlogan,
  slogan,
  mobilePlaceholder,
  primaryLink,
  primaryLinkText,
  videoId,
}) => {
  const primaryLinkUrl = useUrl(culture, primaryLink)
  const showLink = primaryLinkText && primaryLinkUrl
  return (
    <section id="hero">
      <div className="hero-content container">
        <p className="above">{aboveSlogan}</p>
        <h1>{slogan}</h1>
        {showLink && (
          <Link to={primaryLinkUrl} className="btn btn-outline-primary">
            {primaryLinkText}
          </Link>
        )}
      </div>
      <div
        id="mobile-stil"
        style={{ backgroundImage: `url(${mobilePlaceholder.mobile})` }}
        className="d-block d-sm-none"
      ></div>
      <div
        id="hero-video"
        className="d-none d-sm-block"
        data-video-id={videoId}
      ></div>
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
  imageRight,
  image,
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
              <img src={phone} srcSet={phone} />
            </picture>
          </div>
          <div
            className={`col-xs-12 col-lg-5 ${
              imageRight ? "order-lg-0" : "order-lg-1"
            }`}
          >
            <h3 className="above text-lowercase">{aboveTitle}</h3>
            <h2>{title}</h2>
            <img src={underline} className="underline-bar" />
            <div dangerouslySetInnerHTML={{ __html: lead }}></div>
            {linkText && linkNode && (
              <div className="link-container">
                <Link to={link} className="btn-outline-primary">
                  {linkText}
                  <span className="corner" />
                  <span className="inner-corner" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const home = pageInCulture(currentCulture, data.home)
  const solutions = data.allSolution.nodes.map(n =>
    pageInCulture(currentCulture, n)
  )
  const homeRows = data.home.childrenHomeRow.map(hr =>
    pageInCulture(currentCulture, hr)
  )
  return (
    <Layout culture={pageContext.culture} currentPageId={pageContext.umbracoId}>
      <Hero culture={currentCulture} {...home} />
      <Solutions {...home} solutions={solutions} culture={currentCulture} />
      {homeRows.map(hr => (
        <HomeRow culture={currentCulture} {...hr} />
      ))}
    </Layout>
  )
}

export const query = graphql`
  query {
    home {
      url {
        nl
        en
      }
      id
      mobilePlaceholder {
        nl {
          mobile
        }
        en {
          mobile
        }
      }
      aboveSlogan {
        nl
        en
      }
      slogan {
        en
        nl
      }
      solutionsTitle {
        en
        nl
      }
      primaryLink {
        nl
        en
      }
      primaryLinkText {
        nl
        en
      }
      videoId {
        en
        nl
      }
      aboveSolutions {
        nl
        en
      }
      solutionsTitle {
        nl
        en
      }
      childrenHomeRow {
        key: id
        theme {
          en
          nl
        }
        aboveTitle {
          en
          nl
        }
        title {
          en
          nl
        }
        lead {
          nl
          en
        }
        linkText {
          en
          nl
        }
        linkNode {
          en
          nl
        }
        imageRight {
          en
          nl
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
        }
        thumbnailAlt {
          nl
          en
        }
        icon {
          nl
          en
        }
        navigationText {
          nl
          en
        }
        title {
          nl
          en
        }
      }
    }
  }
`
