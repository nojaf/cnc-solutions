import React from "react"
import PropTypes from "prop-types"
import underlineWhite from "../images/underline-white.png"

const PageIntroduction = ({ aboveTitle, title, lead }) => {
  return (
    <section>
      <div className="container">
        <div className="text-center mt-5 mb-2">
          <h2 className="above text-lowercase">{aboveTitle}</h2>
          <div className="title-container">
            <h1 className="mb-0">{title}</h1>
            <img
              src={underlineWhite}
              alt={""}
              className="underline-bar"
            />
            <div
              className="text-left"
              id="lead"
              dangerouslySetInnerHTML={{ __html: lead }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}

PageIntroduction.propTypes = {
  aboveTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  lead: PropTypes.string.isRequired,
}

export default PageIntroduction
