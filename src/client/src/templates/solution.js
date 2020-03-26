import React from "react"
import { graphql } from "gatsby"
import * as R from "ramda"
import Layout from "../components/layout"
import { pageInCulture } from "../selectors"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"
import underlineWhite from "../images/underline-white.png"
import underlineDark from "../images/underline-dark.png"
import Video from "../components/video"

function wrapIfSingleton(a) {
  return a ? (R.is(Array, a) ? a : [a]) : []
}

const SlideShowSlide = ({ image, isActive, altText, parentUmbracoId }) => {
  const {
    large_desktop,
    desktop,
    tablet,
    mobile_landscape,
    mobile_portrait,
  } = image
  return (
    <div className={`carousel-item ${isActive ? "active" : ""}`}>
      <a
        href={desktop}
        className="d-block w-100"
        data-toggle="lightbox"
        data-gallery={`gallery-${parentUmbracoId}`}
      >
        <picture>
          <source media="(min-width: 75em)" srcSet={large_desktop} />
          <source media="(min-width: 62em)" srcSet={desktop} />
          <source media="(min-width: 48em)" srcSet={tablet} />
          <source media="(min-width: 34em)" srcSet={mobile_landscape} />
          <img
            src={mobile_portrait}
            alt={altText}
            className="d-block m-auto w-100"
          />
        </picture>
      </a>
    </div>
  )
}

const SolutionSlideShow = ({ culture, umbracoId, slides }) => {
  const slideShowSlides = wrapIfSingleton(slides).map(s =>
    pageInCulture(culture, s)
  )
  return (
    <div
      className="carousel slide"
      id={`block${umbracoId}Carousel`}
      data-ride="carousel"
    >
      <ol className="carousel-indicators">
        {slideShowSlides.map((s, i) => {
          return (
            <li
              key={`carousel-${umbracoId}-${i}`}
              data-target={`#block${umbracoId}Carousel`}
              data-slide-to={i}
              className={i === 0 ? "active" : ""}
            >
              <div className="inner"></div>
            </li>
          )
        })}
      </ol>
      <div className="carousel-inner">
        {slideShowSlides.map((s, i) => (
          <SlideShowSlide
            {...s}
            isActive={i === 0}
            key={`show-${umbracoId}-slide-${i}`}
          />
        ))}
      </div>
      <a
        className="carousel-control-prev"
        href={`#block${umbracoId}Carousel`}
        role="button"
        data-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href={`#block${umbracoId}Carousel`}
        role="button"
        data-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </a>
    </div>
  )
}

const SolutionText = ({ aboveTitle, title, color, lead }) => {
  return (
    <>
      <p className="above">{aboveTitle}</p>
      <h2>{title}</h2>
      <img
        src={color === "dark" ? underlineDark : underlineWhite}
        alt=""
        className="underline-bar"
      />
      <div dangerouslySetInnerHTML={{ __html: lead }}></div>
    </>
  )
}

const SolutionVideo = ({ videoId }) => {
  const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&rel=0&modestbranding=1&controls=0&showinfo=0&origin=https://cncsolutions.be&playlist=${videoId}&mute=1`
  return (
    <Video videoSrcURL={url} videoTitle={"TODO"} width={640} height={360} />
  )
}

const SolutionBlock = props => {
  switch (props.alias) {
    case "solutionSlideshow":
      return <SolutionSlideShow {...props} />
    case "solutionText":
      return <SolutionText {...props} />
    case "solutionVideo":
      return <SolutionVideo {...props} />
    default:
      return null
  }
}

function sortSolutionBlock(a,b){
  if(a.alias === "solutionText") {
    return 1
  }
  else if (b.alias === "solutionText"){
    return -1;
  }
  else {
    return 0;
  }
}

const SolutionRow = ({ blocks, culture }) => {
  const color = blocks.length && blocks[0].color
  const blockColumn = ({ alias, isRight }) =>
    `col-12 mt-lg-0 ${
      alias === "solutionText" ? "col-lg-5 text-block" : "col-lg-7"
    } ${isRight ? "order-lg-1" : "order-lg-0"}`

  return (
    <section className={`cnc-block ${color}`}>
      <div className="container">
        <div className="row">
          {blocks.sort(sortSolutionBlock).map(b => (
            <div className={blockColumn(b)} key={b.umbracoId}>
              <SolutionBlock {...b} culture={culture} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const solution = pageInCulture(currentCulture, data.solution)
  const rowsMap = R.groupBy(
    b => b.row,
    [
      ...wrapIfSingleton(data.solution.slideShows),
      ...wrapIfSingleton(data.solution.texts),
      ...wrapIfSingleton(data.solution.videos),
    ].map(r => pageInCulture(currentCulture, r))
  )
  const rows = Object.keys(rowsMap).map(k => rowsMap[k])

  return (
    <Layout culture={pageContext.culture} currentPageId={pageContext.umbracoId}>
      <Header currentPage={solution} />
      <PageIntroduction {...solution} />
      {rows.map((r, i) => (
        <SolutionRow key={i} blocks={r} culture={currentCulture} />
      ))}
    </Layout>
  )
}
export const query = graphql`
  query getSolution($umbracoId: Int) {
    solution(umbracoId: { eq: $umbracoId }) {
      url {
        en
        nl
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
      }
      headerImageAlt {
        en
        nl
      }
      aboveTitle {
        nl
        en
      }
      title {
        nl
        en
      }
      lead {
        nl
        en
      }
      slideShows: childrenSolutionSlideshow {
        umbracoId
        alias: __typename
        row {
          en
          nl
        }
        isRight {
          nl
          en
        }
        umbracoId
        color {
          en
          nl
        }
        slides: childrenSolutionSlideshowImage {
          umbracoId
          parentUmbracoId
          image {
            en {
              desktop
              large_desktop
              mobile_landscape
              mobile_portrait
              tablet
            }
            nl {
              desktop
              large_desktop
              mobile_landscape
              mobile_portrait
              tablet
            }
          }
          altText {
            en
            nl
          }
        }
      }
      texts: childrenSolutionText {
        parentUmbracoId
        umbracoId
        alias: __typename
        aboveTitle {
          en
          nl
        }
        color {
          en
          nl
        }
        title {
          en
          nl
        }
        lead {
          en
          nl
        }
        isRight {
          en
          nl
        }
        row {
          en
          nl
        }
      }
      videos: childrenSolutionVideo {
        parentUmbracoId
        umbracoId
        alias: __typename
        videoId {
          en
          nl
        }
        isRight {
          en
          nl
        }
        row {
          en
          nl
        }
        color {
          en
          nl
        }
      }
    }
  }
`
