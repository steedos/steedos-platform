module.exports = {
  download: function (object_name, record_id) {
    var file, fileId, filename, length, ref, rev, url;
    file = this.record;
    fileId = file != null ? (ref = file.versions) != null ? ref[0] : void 0 : void 0;
    if (fileId) {
      if (Meteor.isCordova) {
        url = Steedos.absoluteUrl("/api/files/files/" + fileId);
        filename = file.name;
        rev = fileId;
        length = file.size;
        return Steedos.cordovaDownload(url, filename, rev, length);
      } else {
        url = Steedos.absoluteUrl("/api/files/files/" + fileId + "?download=true");
        return window.location = url;
      }
    }
  },

  downloadVisible: function (object_name, record_id, record_permissions) {
    var fileRecord;
    if (object_name === Session.get('object_name')) {
      fileRecord = Creator.getObjectRecord();
      if (!fileRecord) {
        return false;
      }
    }
    return true;
  },

  online_preview: function (object_name, record_id) {
    var file, fileId, ref, url;
    file = this.record;

    fileId = file != null ? (ref = file.versions) != null ? ref[0] : void 0 : void 0;
    
    url = window.location.origin + Steedos.absoluteUrl("/api/files/files/" + fileId + "/" + file.name);
    
    // 图片和网页类型附件用浏览器打开
    if (Creator.isImageAttachment(file.name) || Creator.isHtmlAttachment(file.name)){
      Steedos.openWindow(url);
    }else{
      Creator.officeOnlinePreview(url,file.name);
    }
  }
}