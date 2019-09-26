OfficeOnline = {}

OfficeOnline.http = {}

OfficeOnline.https = {}

var url, net, path, http, https, fs;

if (Steedos.isNode()) {
	// turn off SSL validation checking
	if (window.location.protocol == "https:") {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	}

	url = nw.require('url');
	net = nw.require('net');
	path = nw.require('path');
	https = nw.require('https');
	http = nw.require('http');
	fs = nw.require('fs');
	child_process = nw.require('child_process');
	if (child_process)
		exec = child_process.exec;

}


// http请求
OfficeOnline.http.downloadFile = function(file_url, download_dir, filename, arg) {
	$(document.body).addClass("loading");
	var loadingText = "";
	if (arg == "Steedos.User.isDocToPdf")
		loadingText = t("workflow_attachment_convert_to_pdf", filename);
	else if (arg == "Steedos.User.isNewFile")
		loadingText = t("workflow_attachment_creating", filename);
	else
		loadingText = t("workflow_attachment_downloading", filename);

	$('.loading-text').text(loadingText);

	var filePath = path.join(download_dir, filename);
	var file = fs.createWriteStream(filePath);
	var dfile = http.get(encodeURI(file_url), function(res) {
		res.on('data', function(data) {
			file.write(data);
		}).on('end', function() {
			file.end();

			if (arg) {
				if ((arg == "Steedos.User.isNewFile") || (arg == "Steedos.User.isSignature")) {
					// 正文上传
					setTimeout(function() {
						// NodeManager.setUploadRequests(filePath, filename, true);
						$(document.body).removeClass('loading');
						$('.loading-text').text("");
						// 获取附件hash值
						NodeManager.getFileSHA1(filePath, filename, function(sha1) {
							NodeManager.fileSHA1 = sha1;
						});
						// 新建后直接打开word文档进行在线编辑
						NodeManager.vbsEditFile(download_dir, filename, arg);
					}, 1000);
				} else {
					if (arg == "Steedos.User.isView") {
						$(document.body).removeClass('loading');
						$('.loading-text').text("");
					}
					// 获取华炎云安装路径
					var homePath = process.cwd();
					var cmd = "";
					if ((arg != "Steedos.User.isDocToPdf") && NodeManager.isViewType(filename))
						cmd = 'start "" ' + '\"' + filePath + '\"';
					else
						cmd = '\"' + homePath + '\"' + '\\vbs\\edit.vbs ' + '\"' + filePath + '\" ' + arg;

					var child = exec(cmd);
					child.on('close', function() {
						// 转换为pdf后需上传
						if (arg == "Steedos.User.isDocToPdf") {
							var pdfName = path.basename(filename, path.extname(filename)) + ".pdf";
							var pdfPath = path.join(download_dir, pdfName);
							fs.exists(pdfPath, function(exists) {
								if (exists == true) {
									NodeManager.setUploadRequests(pdfPath, pdfName);
								} else {
									$(document.body).removeClass('loading');
									$('.loading-text').text("");

									toastr.error(TAPi18n.__('workflow_attachment_wordToPdf_failed'));

									// 解锁
									InstanceManager.unlockAttach(Session.get('cfs_file_id'));
								}
							})
						}
					});
					child.on('error', function(error) {
						toastr.error(error);
					});
				}

			} else {
				$(document.body).removeClass('loading');
				$('.loading-text').text("");
				// 获取附件hash值
				NodeManager.getFileSHA1(filePath, filename, function(sha1) {
					NodeManager.fileSHA1 = sha1;
				});
				// 调用edit.vbs对word文档进行在线编辑
				NodeManager.vbsEditFile(download_dir, filename);
			}
		})
	});
	dfile.on('error', function(e) {
		$(document.body).removeClass('loading');
		$('.loading-text').text("");
		toastr.error(e.message);
	})
}

OfficeOnline.http.uploadFile = function(fileDataInfo, files) {
	// 配置附件上传接口
	var options = {
		host: window.location.hostname,
		port: window.location.port,
		method: "POST",
		path: "/api/v4/instances/s3/"
	}
	var req = http.request(options, function(res) {
		res.on('data', function(chunk) {
			var responseText = JSON.parse(chunk.toString());
			$(document.body).removeClass('loading');
			$('.loading-text').text("");
			if (responseText.errors) {
				responseText.errors.forEach(function(e) {
					toastr.error(e.errorMessage);
				});
				return;
			}

			toastr.success(TAPi18n.__('Attachment was added successfully'));
		});
		// res.setEncoding("utf8");
		res.on('end', function() {

			$(document.body).removeClass('loading');
			$('.loading-text').text("");

			// 成功上传后删除本地文件
			fs.unlinkSync(files[0].urlValue); //由于unlinkSync方法执行后，后面的代码不执行所以将此行代码放至最后
		});
	})

	req.on('error', function(e) {
		$(document.body).removeClass('loading');
		$('.loading-text').text("");
		toastr.error(e.message);
	});

	//上传附件
	NodeManager.uploadAttach(fileDataInfo, files, req);
}

// https请求
OfficeOnline.https.downloadFile = function(file_url, download_dir, filename, arg) {
	$(document.body).addClass("loading");
	var loadingText = "";
	if (arg == "Steedos.User.isDocToPdf")
		loadingText = t("workflow_attachment_convert_to_pdf", filename);
	else if (arg == "Steedos.User.isNewFile")
		loadingText = t("workflow_attachment_creating", filename);
	else
		loadingText = t("workflow_attachment_downloading", filename);

	$('.loading-text').text(loadingText);

	var filePath = path.join(download_dir, filename);
	var file = fs.createWriteStream(filePath);
	var dfile = https.get(encodeURI(file_url), function(res) {
		res.on('data', function(data) {
			file.write(data);
		}).on('end', function() {
			file.end();

			if (arg) {
				if ((arg == "Steedos.User.isNewFile") || (arg == "Steedos.User.isSignature")) {
					// 正文上传
					setTimeout(function() {
						$(document.body).removeClass('loading');
						$('.loading-text').text("");
						// 获取附件hash值
						NodeManager.getFileSHA1(filePath, filename, function(sha1) {
							NodeManager.fileSHA1 = sha1;
						});
						// 新建后直接打开word文档进行在线编辑
						NodeManager.vbsEditFile(download_dir, filename, arg);
					}, 1000);
				} else {
					if (arg == "Steedos.User.isView") {
						$(document.body).removeClass('loading');
						$('.loading-text').text("");
					}
					// 获取华炎云安装路径
					var homePath = process.cwd();
					var cmd = "";
					if ((arg != "Steedos.User.isDocToPdf") && NodeManager.isViewType(filename))
						cmd = 'start "" ' + '\"' + filePath + '\"';
					else
						cmd = '\"' + homePath + '\"' + '\\vbs\\edit.vbs ' + '\"' + filePath + '\" ' + arg;

					var child = exec(cmd);
					child.on('close', function() {
						// 转换为pdf后需上传
						if (arg == "Steedos.User.isDocToPdf") {
							var pdfName = path.basename(filename, path.extname(filename)) + ".pdf";
							var pdfPath = path.join(download_dir, pdfName);
							fs.exists(pdfPath, function(exists) {
								if (exists == true) {
									NodeManager.setUploadRequests(pdfPath, pdfName);
								} else {
									$(document.body).removeClass('loading');
									$('.loading-text').text("");

									toastr.error(TAPi18n.__('workflow_attachment_wordToPdf_failed'));

									// 解锁
									InstanceManager.unlockAttach(Session.get('cfs_file_id'));
								}
							})
						}
					});
					child.on('error', function(error) {
						toastr.error(error);
					});
				}
			} else {
				$(document.body).removeClass('loading');
				$('.loading-text').text("");
				// 获取附件hash值
				NodeManager.getFileSHA1(filePath, filename, function(sha1) {
					NodeManager.fileSHA1 = sha1;
				});
				// 调用edit.vbs对word文档进行在线编辑
				NodeManager.vbsEditFile(download_dir, filename);
			}
		})
	});
	dfile.on('error', function(e) {
		$(document.body).removeClass('loading');
		$('.loading-text').text("");
		toastr.error(e.message);
	})
}


OfficeOnline.https.uploadFile = function(fileDataInfo, files) {
	// 配置附件上传接口
	var options = {
		host: window.location.hostname,
		port: window.location.port,
		method: "POST",
		path: "/api/v4/instances/s3/"
	}
	var req = https.request(options, function(res) {
		res.on('data', function(chunk) {
			var responseText = JSON.parse(chunk.toString());
			$(document.body).removeClass('loading');
			$('.loading-text').text("");
			if (responseText.errors) {
				responseText.errors.forEach(function(e) {
					toastr.error(e.errorMessage);
				});
				return;
			}

			toastr.success(TAPi18n.__('Attachment was added successfully'));
		});
		// res.setEncoding("utf8");
		res.on('end', function() {

			$(document.body).removeClass('loading');
			$('.loading-text').text("");

			// 成功上传后删除本地文件
			fs.unlinkSync(files[0].urlValue); //由于unlinkSync方法执行后，后面的代码不执行所以将此行代码放至最后
		});
	})

	req.on('error', function(e) {
		$(document.body).removeClass('loading');
		$('.loading-text').text("");
		toastr.error(e.message);
	});

	//上传附件
	NodeManager.uploadAttach(fileDataInfo, files, req);
}

//上传附件
OfficeOnline.uploadFile = function(fileDataInfo, files) {
	return OfficeOnline[window.location.protocol.replace(":", "")].uploadFile(fileDataInfo, files);
}

//下载附件
OfficeOnline.downloadFile = function(file_url, download_dir, filename, arg) {
	// 查看模式下文件名为“只读-文件名”
	if (arg) {
		if (arg == "Steedos.User.isView") {
			filename = t("workflow_attachment_isReadOnly") + filename;
		}
	}

	return OfficeOnline[window.location.protocol.replace(":", "")].downloadFile(file_url, download_dir, filename, arg);
}
