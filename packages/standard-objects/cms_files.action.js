module.exports = {
  download: function (object_name, record_id) {
    var file, fileId, ref;
    file = this.record;
    fileId = file != null ? (ref = file.versions) != null ? ref[0] : void 0 : void 0;
    var downloadProps ={
      download_url: Steedos.absoluteUrl("/api/files/files/" + fileId),
      file_name: file.name,
      file_size: file.size,
      object_name,
      record_id,
      file_id: fileId,
    }
    SteedosUI.downloadFile(downloadProps)
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
    var file, fileId, ref1, ref2, ref3, ref4, url;
    file = this.record;

    if (file != null ? file.versions : void 0) {
      fileId = file != null ? (ref1 = file.versions) != null ? ref1[0] : void 0 : void 0;
    } else {
      fileId = file != null ? (ref2 = file.__super) != null ? (ref3 = ref2.record) != null ? (ref4 = ref3.versions) != null ? ref4[0] : void 0 : void 0 : void 0 : void 0;
    }
    
    url = window.location.origin + Steedos.absoluteUrl("/api/files/files/" + fileId + "/" + file.name);
    
    // 图片和网页类型附件用浏览器打开
    if (Creator.isImageAttachment(file.name) || Creator.isHtmlAttachment(file.name)){
      Steedos.openWindow(url);
    }else{
      Creator.officeOnlinePreview(url,file.name);
    }
  }
}