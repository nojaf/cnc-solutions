$(function() {
  $(document).on("click", '[data-toggle="lightbox"]', function(event) {
    event.preventDefault()
    if (event.originalEvent.isTrusted) {
      $(this).ekkoLightbox()
    }
  })
})

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script")

tag.src = "https://www.youtube.com/iframe_api"
var firstScriptTag = document.getElementsByTagName("script")[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

function onPlayerReady(event) {
  event.target.mute()
  event.target.setVolume(0) //this can be set from 0 to 100
}

function onYouTubeIframeAPIReady() {
  var $videos = $(".product-image .video")
  $videos.each(function() {
    console.log(this)
    var id = $(this).data("id")
    var width = $(this.parentElement).width()
    var height = width * (9 / 16)
    new YT.Player(this.id, {
      videoId: id,
      width: width,
      height: height,
      playerVars: {
        autoplay: 1, // and 0 means off
        controls: 0,
        showinfo: 0,
        modestbranding: 0,
        loop: 1,
        fs: 0,
        cc_load_policy: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: onPlayerReady,
      },
    })
  })
}
