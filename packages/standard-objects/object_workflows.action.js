module.exports = {
    forceSync: function (object_name, record_id, fields) {
        $("body").addClass("loading");
        Meteor.call('object_workflows.forcesync', record_id, function (error, result) {
          $("body").removeClass("loading");
          if (error) {
            toastr.error(error.message);
          }
          if (result.error) {
            var errorLi = "";
            var href = `${Steedos.absoluteUrl('workflow/space/' + Session.get('spaceId') + '/monitor/')}`
            result.error.forEach(function (e) {
              errorLi += `<tr><td><a href='${href + e._id}' target='_blank'>${e.name}</a></td><td>${e.message}</td></tr>`;
            })
            swal({
              title: t('object_workflows_sync_history_instances_failed'),
              text: `<div style="height: 400px;overflow: auto;"><table><tbody>${errorLi}</tbody></table></div>`,
              html: true,
              confirmButtonText: t('OK')
            })
          }
          else {
            toastr.success(t('object_workflows_sync_history_instances_success'));
          }
        })
    },
    forceSyncVisible: function(object_name, record_id, record_permissions){
        var perms, record;
      perms = {};
      if (record_permissions) {
        perms = record_permissions;
      } else {
        record = Creator.getObjectRecord(object_name, record_id);
        record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
        if (record_permissions) {
          perms = record_permissions;
        }
      }
      return perms["allowEdit"];
    }
}