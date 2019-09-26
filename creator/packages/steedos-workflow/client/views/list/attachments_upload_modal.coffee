Template.attachments_upload_modal.onRendered ->
    $(".attachments_upload_modal-body").css("max-height", ($(window).height()-140) + "px");