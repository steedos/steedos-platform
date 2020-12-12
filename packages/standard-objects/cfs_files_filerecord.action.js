module.exports = {
  online_preview: function (object_name, record_id) {
    var file, fileId, ref, url;
    file = this.record;
    fileId = file != null ? (ref = file._id) != null ? ref : void 0 : void 0;
    
    url = window.location.origin + Steedos.absoluteUrl("/api/files/files/" + fileId + "/" + file.original.name);
    
    // 图片和网页类型附件用浏览器打开
    if (Creator.isImageAttachment(file.original.name) || Creator.isHtmlAttachment(file.original.name)){
      Steedos.openWindow(url);
    }else{
      Creator.officeOnlinePreview(url,file.original.name);
    }
  }
}