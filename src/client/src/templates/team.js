import { pageInCulture } from "../selectors"
import Layout from "../components/layout"
import Header from "../components/header"
import PageIntroduction from "../components/pageIntroduction"
import React from "react"
import { graphql } from "gatsby"
import underlineWhite from "../images/underline-white.png"

export const query = graphql`
  query getTeamPage($umbracoId: Int) {
    team(umbracoId: { eq: $umbracoId }) {
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
    members: allTeamMember(filter: { parentUmbracoId: { eq: $umbracoId } }) {
      edges {
        node {
          firstName {
            nl
            fr
            en
          }
          lastName {
            nl
            fr
            en
          }
          f:function {
            nl
            fr
            en
          }
          photo {
            nl {
              main
            }
            fr {
              main
            }
            en {
              main
            }
          }
        }
      }
    }
  }
`

const TeamMember = ({firstName, lastName, f, photo}) => {
  return <div className={"team-member"}>
    <h4 className={"above"}>{f}</h4>
    <h3>{firstName} {lastName}</h3>
    <img src={underlineWhite} alt={""} className="underline-bar"/>
    <img src={photo.main} alt={`${firstName} ${lastName}`} />
  </div>
}

const TeamPage = ({data, pageContext}) => {
  const currentCulture = pageContext.culture
  const team = pageInCulture(currentCulture, data.team)
  console.log(data)
  const members = (data.members.edges || [])
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((e) => pageInCulture(currentCulture, e.node));
  
  return (
    <Layout
      culture={currentCulture}
      currentPageId={pageContext.umbracoId}
      seo={pageContext.seo}
      mainClass="team-page"
    >
      <Header currentPage={team}/>
      <PageIntroduction {...team} />
      <div className="container" id="team">
        {members.map((m, i) => {
          return <TeamMember key={`team-member-${i}`} {...m} />
        })}
      </div>
    </Layout>
)
}

export default TeamPage
