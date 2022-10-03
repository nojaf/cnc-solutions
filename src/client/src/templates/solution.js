import React from "react"
import { graphql } from "gatsby"
import * as R from "ramda"
import Layout from "../components/layout"
import { pageInCulture, wrapIfSingleton } from "../selectors"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"
import underlineWhite from "../images/underline-white.png"
import underlineDark from "../images/underline-dark.png"
import Video from "../components/video"
import SlideShow from "../components/slideShow"

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

const SolutionBlock = (props) => {
  switch (props.alias) {
    case "solutionSlideshow":
      return <SlideShow {...props} />
    case "solutionText":
      return <SolutionText {...props} />
    case "solutionVideo":
      return <SolutionVideo {...props} />
    default:
      return null
  }
}

function sortSolutionBlock(a, b) {
  if (a.alias === "solutionText") {
    return 1
  } else if (b.alias === "solutionText") {
    return -1
  } else {
    return 0
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
          {blocks.sort(sortSolutionBlock).map((b) => (
            <div className={blockColumn(b)} key={b.umbracoId}>
              <SolutionBlock {...b} culture={culture} color={color} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const SolutionPage = ({ data, pageContext }) => {
  const currentCulture = pageContext.culture
  const solution = pageInCulture(currentCulture, data.solution)
  const rowsMap = R.groupBy(
    (b) => b.row,
    [
      ...wrapIfSingleton(data.solution.slideShows),
      ...wrapIfSingleton(data.solution.texts),
      ...wrapIfSingleton(data.solution.videos),
    ].map((r) => pageInCulture(currentCulture, r))
  )
  const rows = Object.keys(rowsMap).map((k) => rowsMap[k])

  return (
    <Layout
      culture={pageContext.culture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
    >
      <Header currentPage={solution} />
      <PageIntroduction {...solution} />
      {rows.map((r, i) => (
        <SolutionRow key={i} blocks={r} culture={currentCulture} />
      ))}
    </Layout>
  )
}

export default SolutionPage
export const query = graphql`
  query getSolution($umbracoId: Int) {
    solution(umbracoId: { eq: $umbracoId }) {
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
      slideShows: childrenSolutionSlideshow {
        umbracoId
        alias: __typename
        row {
          en
          nl
          fr
        }
        isRight {
          nl
          en
          fr
        }
        umbracoId
        color {
          en
          nl
          fr
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
            fr {
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
            fr
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
          fr
        }
        color {
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
        isRight {
          en
          nl
          fr
        }
        row {
          en
          nl
          fr
        }
      }
      videos: childrenSolutionVideo {
        parentUmbracoId
        umbracoId
        alias: __typename
        videoId {
          en
          nl
          fr
        }
        isRight {
          en
          nl
          fr
        }
        row {
          en
          nl
          fr
        }
        color {
          en
          nl
          fr
        }
      }
    }
  }
`
