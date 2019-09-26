Template.force_end_modal.helpers({

})


Template.force_end_modal.events({

    'click #force_end_modal_ok': function (event, template) {
        var reason = $("#force_end_modal_text").val();
        if (!reason) {
            toastr.error(TAPi18n.__("instance_cancel_error_reason_required"));
            return;
        }

        InstanceManager.terminateIns(reason);
    },

})