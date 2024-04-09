module.exports = { 
createDefaultRecordView:function (object_name, record_id, item_element) {
    if(object_name === 'objects' && this.record && this.record.record){
      const objectApiName = this.record.record.name;
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
createDefaultRecordViewVisible:function(object_name, record_id, record_permissions, data){
    if(!Creator.isSpaceAdmin() || data.record.name == 'users'){
        return false
    }
    return true;
  }
 }