// var tag = document.createElement("script")
//
// tag.src = "https://www.youtube.com/iframe_api"
// var firstScriptTag = document.getElementsByTagName("script")[0]
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
//
// function onPlayerReady(event) {
//   event.target.mute()
//   event.target.setVolume(0) //this can be set from 0 to 100
// }
//
// function onYouTubeIframeAPIReady() {
//   $(document).ready(function() {
//     const timeoutTime = location.href === "http://localhost:8000/" ? 1000 : 0
//     setTimeout(() => {
//       var $videos = $(".video")
//       $videos.each(function() {
//         console.log(this)
//         var id = $(this).data("id")
//         var width = $(this.parentElement).width()
//         var height = width * (9 / 16)
//         new YT.Player(this.id, {
//           videoId: id,
//           width: width,
//           height: height,
//           playerVars: {
//             autoplay: 1, // and 0 means off
//             controls: 0,
//             showinfo: 0,
//             modestbranding: 0,
//             loop: 1,
//             fs: 0,
//             cc_load_policy: 0,
//             iv_load_policy: 3,
//             rel: 0,
//             wmode: "transparent"
//           },
//           events: {
//             onReady: onPlayerReady,
//           },
//         })
//       })
//     }, timeoutTime)
//   })
// }
//
// $(document).ready(function() {
//   const timeoutTime = location.href === "http://localhost:8000/" ? 1000 : 100
//   setTimeout(() => {
//     const $heroVideo = $("#hero-video")
//     const videoId = $heroVideo.data("video-id")
//     console.log(`videoId`, videoId)
//     // https://codepen.io/dudleystorey/pen/PZyMrd
//     $heroVideo.YTPlayer({
//       fitToBackground: false,
//       videoId: videoId,
//       playerVars: {
//         modestbranding: 0,
//         autoplay: 1,
//         controls: 0,
//         showinfo: 0,
//         branding: 0,
//       },
//     })
//   }, timeoutTime)
// })

$(document).ready(function() {
  $(window).resize(function(){
      $("iframe").each(function () {
          const frame = this;
          frame.height = `${frame.clientWidth / 16 * 9}px`;
      })
  })
});