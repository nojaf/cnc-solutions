$(function() {
    $(document).on("click", '[data-toggle="lightbox"]', function(event) {
        event.preventDefault()
        if (event.originalEvent.isTrusted) {
            $(this).ekkoLightbox()
        }
    })
})