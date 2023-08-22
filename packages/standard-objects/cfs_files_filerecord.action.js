module.exports = {
  online_preview: function (object_name, record_id) {
    var file, fileId, ref, download_url, file_name;
    file = this.record;
    fileId = file != null ? (ref = file._id) != null ? ref : void 0 : void 0;
    
    download_url = window.location.origin + Steedos.absoluteUrl("/api/files/files/" + fileId + "/" + file.original.name);
    file_name = file.original.name;

    window.previewFile({download_url, file_name, isPreviewButton:true})
  }
}