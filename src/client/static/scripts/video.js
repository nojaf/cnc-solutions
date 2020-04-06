function correctVideoContainer() {
  $("#hero-video").height($("video").height())
  $("#hero").height($("video").height())
}

$(document).ready(function() {
  $(window).resize(function() {
    $("iframe").each(function() {
      const frame = this
      frame.height = `${(frame.clientWidth / 16) * 9}px`
    })

    correctVideoContainer()
  })

  const video = document.querySelector("video")

  if (video) {
    correctVideoContainer()
  } else {
    setTimeout(correctVideoContainer, 500)
  }
})
