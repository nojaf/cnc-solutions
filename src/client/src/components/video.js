import React from "react"
const Video = ({ videoSrcURL, videoTitle, width, height }) => (
  <div className="video">
    <iframe
      src={videoSrcURL}
      title={videoTitle}
      height={175}
      width={"100%"}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      onLoad={(ev) => { ev.currentTarget.height = `${ev.currentTarget.clientWidth / 16 * 9}px`; } }
    />
  </div>
)
export default Video
