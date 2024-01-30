try {

  var downloadFile = function ({ download_url, file_name, file_size, object_name, record_id, file_id }) {
    $(document.body).addClass("loading");
    $('.loading-text').text(t("workflow_attachment_downloading", file_name));

    var filePath = path.join(process.env.USERPROFILE, "Steedos", file_name);
    var file_url = new URL(Steedos.addTokenTodownloadUrl(Steedos.absoluteUrl("/api/files/files/" + file_id)), window.location.origin);
    // console.log("file_url: ", file_url);
    var request = https;

    if (window.location.protocol == "http:")
      request = http;

    var file = fs.createWriteStream(filePath);

    // 获取客户端版本
    var ua = navigator.userAgent.toLowerCase();
    var win = ua.indexOf("win") > -1 || ua.indexOf("wow") > -1;

    // 下载附件
    var dfile = request.get(encodeURI(file_url.href), function (res) {
      res.on('data', function (data) {
        file.write(data);
      }).on('end', function () {
        file.end();
        setTimeout(function () {
          $(document.body).removeClass('loading');
          $('.loading-text').text("");

          var cmd = 'start "" ' + '\"' + filePath + '\"';

          // 兼容mac客户端
          if (!win)
            cmd = 'open ' + '\"' + filePath + '\"';

          var child = exec(cmd);

          child.on('error', function (error) {
            toastr.error(error);
          });
        }, 500);
      })
    });

    dfile.on('error', function (e) {
      $(document.body).removeClass('loading');
      $('.loading-text').text("");
      toastr.error(e.message);
    })
  }
  setTimeout(function () {
    window.previewFile = function ({ download_url, file_name, file_size, object_name, record_id, file_id, isPreviewButton }) {
      
      if (isPreviewButton) {
        // 图片和网页类型附件用浏览器打开
        if (Creator.isImageAttachment(file_name) || Creator.isHtmlAttachment(file_name)) {
          Steedos.openWindow(download_url);
        } else {
          Creator.officeOnlinePreview(download_url, file_name);
        }
      }

      if (Steedos.isNode()) {
        if (!file_id)
          return;
        
        // 引入全局变量
        fs = nw.require('fs');
        path = nw.require('path');
        http = nw.require('http');
        https = nw.require('https');
        child_process = nw.require('child_process');
        if (child_process)
          exec = child_process.exec;

        // 旧版客户端暂不支持
        var ua = navigator.userAgent.toLowerCase();
        var version = ua.match(/chrome\/([\d.]+)/)[1].split(".")[0];
        var win = ua.indexOf("win") > -1 || ua.indexOf("wow") > -1;

        if (version.to_float() < 70)
          return;

        var download_dir = path.join(process.env.USERPROFILE, "Steedos");

        fs.exists(download_dir, function (exists) {
          if (exists == true) {
            // 直接下载到本地覆盖之前的同名版本
            downloadFile({ file_name, file_id });
          } else {
            // 新建路径并下载附件到本地
            fs.mkdir(download_dir, function (err) {
              if (err) {
                toastr.error(err);
              } else {
                downloadFile({ file_name, file_id });
              }
            })
          }
        })
      }

    }
  }, 5000);
} catch (error) {
  console.log(error);
}