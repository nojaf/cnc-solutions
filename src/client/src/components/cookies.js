import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { pageInCulture } from "../selectors"

export default function Cookies({ culture }) {
  const queryResult = useStaticQuery(graphql`
    query cookies {
      home {
        description: cookieDescription {
          nl
          en
          fr
        }
        accept: cookieAccept {
          nl
          en
          fr
        }
        reject: cookieReject {
          nl
          en
          fr
        }
      }
    }
  `)
  const cookieData = pageInCulture(culture, queryResult.home)

  const [hasAccepted, setHasAccepted] = useState(
    typeof window !== "undefined" && localStorage.getItem("cookiesDecision")
  )

  const setCookieDecision = (answer) => {
    return () => {
      if (typeof window !== "undefined") {
        localStorage.setItem("cookiesDecision", answer)
      }
      setHasAccepted(answer)
      if (answer === "disallow" && typeof window !== "undefined") {
        if (window.gaOptout) {
          window.gaOptout()
        }
        if (window.fbq) {
          window.fbq("consent", "revoke")
        }
      }
    }
  }

  return hasAccepted ? null : (
    <div id="cookies-banner" className="bg-dark text-white">
      <p>{cookieData.description}</p>
      <button
        className="btn btn-primary btn-ghost"
        onClick={setCookieDecision("allow")}
      >
        {cookieData.accept}
      </button>
      <button
        className="btn btn-danger"
        onClick={setCookieDecision("disallow")}
      >
        {cookieData.reject}
      </button>
    </div>
  )
}
