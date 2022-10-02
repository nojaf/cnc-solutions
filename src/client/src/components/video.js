import React, { useRef, useState, useEffect } from "react"

const Video = ({
  videoId,
  altText,
  width = 640,
  height = 360,
  mute = true,
  controls = false,
}) => {
  const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&rel=0&modestbranding=1&controls=${
    controls ? 1 : 0
  }&showinfo=0&origin=https://cncsolutions.be&playlist=${videoId}&mute=${
    mute ? 1 : 0
  }`
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
        src={url}
        title={altText}
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
