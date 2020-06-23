import React, { useRef, useState, useEffect } from "react"

const Video = ({ videoSrcURL, videoTitle, width, height }) => {
  const video = useRef(null)
  const [videoHeight, setVideoHeight] = useState(175)

  useEffect(() => {
    const resizeListener = () => {
      if (video.current) {
        setVideoHeight((video.current.clientWidth / 16) * 9)
      }
    }
    // set resize listener
    window.addEventListener("resize", resizeListener)

    if (video.current) {
      setVideoHeight((video.current.clientWidth / 16) * 9)
    }

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener)
    }
  }, [video])

  return (
    <div className="video">
      <iframe
        src={videoSrcURL}
        title={videoTitle}
        height={videoHeight}
        width={"100%"}
        ref={video}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowFullScreen
      />
    </div>
  )
}

export default Video
