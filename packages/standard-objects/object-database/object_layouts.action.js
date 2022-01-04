module.exports = {
  listenTo: 'objects',

  createDefaulRecordView: function (object_name, record_id, item_element) {
    if(object_name === 'objects' && this.record){
      const objectApiName = this.record.name;
      $("body").addClass("loading");
      const res = Steedos.authRequest(`/service/api/@${objectApiName}/defUiSchema`, { type: 'post', async: false});
      $("body").removeClass("loading");
      if(res.error){
        toastr.error(res.error);
      }else{
        toastr.success(t("Added successfully"));
      }
      FlowRouter.reload();
    }
  },
  createDefaulRecordViewVisible: function(object_name, record_id, record_permissions){
    if(!Creator.isSpaceAdmin()){
        return false
    }
    return true;
  }
}