NodeManager = {};

//定义全局变量;
NodeManager.fileSHA1;

var globalWin, path, fs, crypto, exec, child_process;

if (Steedos.isNode()) {
	path = nw.require('path');
	fs = nw.require('fs');
	crypto = nw.require('crypto');
	globalWin = nw.Window.get();
	child_process = nw.require('child_process');
	if (child_process)
		exec = child_process.exec;

	// globalWin添加参数disableClose控制能否退出客户端，默认值为false，可退出
	globalWin.disableClose = false;
}

// 客户端上传附件
NodeManager.uploadAttach = function(fileDataInfo, fileKeyValue, req) {
	var boundaryKey = Math.random().toString(16);
	var enddata = '\r\n----' + boundaryKey + '--';
	var fileinfo = fileDataInfo;
	var filevalue = fileKeyValue;
	var dataLength = 0;
	var dataArr = new Array();
	for (var i = 0; i < fileDataInfo.length; i++) {
		var dataInfo = "\r\n----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"" + fileDataInfo[i].urlKey + "\"\r\n\r\n" + fileDataInfo[i].urlValue;
		var dataBinary = new Buffer(dataInfo, "utf-8");
		dataLength += dataBinary.length;
		dataArr.push({
			dataInfo: dataInfo
		});
	}

	var files = new Array();
	for (var i = 0; i < fileKeyValue.length; i++) {
		var content = "\r\n----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"" + fileKeyValue[i].urlKey + "\"; filename=\"" + encodeURIComponent(path.basename(fileKeyValue[i].urlValue)) + "\r\n" + "Content-Type: " + fileinfo[i].urlValue + "\r\n\r\n";
		var contentBinary = new Buffer(content, 'utf-8'); //当编码为ascii时，中文会乱码。
		files.push({
			contentBinary: contentBinary,
			filePath: fileKeyValue[i].urlValue
		});
	}
	var contentLength = 0;
	for (var i = 0; i < files.length; i++) {
		var filePath = files[i].filePath;
		if (fs.existsSync(filePath)) {
			var stat = fs.statSync(filePath);
			contentLength += stat.size;
		} else {
			contentLength += new Buffer("\r\n", 'utf-8').length;
		}
		contentLength += files[i].contentBinary.length;
	}

	req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
	req.setHeader('Content-Length', dataLength + contentLength + Buffer.byteLength(enddata));

	// 将参数发出
	for (var i = 0; i < dataArr.length; i++) {
		req.write(dataArr[i].dataInfo)
			//req.write('\r\n')
	}

	var fileindex = 0;
	var doOneFile = function() {
		req.write(files[fileindex].contentBinary);
		var currentFilePath = files[fileindex].filePath;
		if (fs.existsSync(currentFilePath)) {
			var fileStream = fs.createReadStream(currentFilePath, {
				bufferSize: 4 * 1024
			});
			fileStream.pipe(req, {
				end: false
			});
			fileStream.on('end', function() {
				fileindex++;
				if (fileindex == files.length) {
					req.end(enddata);
					// 解锁 
					InstanceManager.unlockAttach(Session.get('cfs_file_id'));
				} else {
					doOneFile();
				}
			});
		} else {
			req.write("\r\n");
			fileindex++;
			if (fileindex == files.length) {
				req.end(enddata);
			} else {
				doOneFile();
			}
		}
	};
	if (fileindex == files.length) {
		req.end(enddata);
	} else {
		doOneFile();
	}
}

NodeManager.setUploadRequests = function(filePath, filename, isNewFile, isOverWrite) {

	$(document.body).addClass("loading");
	$('.loading-text').text(TAPi18n.__("workflow_attachment_uploading") + filename + "...");
	var fileDataInfo = [{
		urlKey: "Content-Type",
		urlValue: cfs.getContentType(filename)
	}, {
		urlKey: "instance",
		urlValue: Session.get('attach_instance_id')
	}, {
		urlKey: "space",
		urlValue: Session.get('attach_space_id')
	}, {
		urlKey: "approve",
		urlValue: InstanceManager.getMyApprove().id
	}, {
		urlKey: "owner",
		urlValue: Meteor.userId()
	}, {
		urlKey: "owner_name",
		urlValue: Meteor.user().name
	}, {
		urlKey: "upload_from",
		urlValue: "node"
	}]
	if (!isNewFile){
		fileDataInfo.push({
			urlKey: "isAddVersion",
			urlValue: true
		});
		fileDataInfo.push({
			urlKey: "parent",
			urlValue: Session.get('attach_parent_id')
		});
	}
	if (isOverWrite == true) {
		fileDataInfo.push({
			urlKey: "overwrite",
			urlValue: true
		});
	}
	var main_count = cfs.instances.find({
		'metadata.parent': Session.get('attach_parent_id'),
		'metadata.current': true,
		'metadata.main': true
	}).count();
	if (main_count > 0 || isNewFile == true) {
		fileDataInfo.push({
			urlKey: "main",
			urlValue: true
		});
	}
	var files = [{
			urlKey: "file",
			urlValue: filePath
		}]
		// 上传接口
	OfficeOnline.uploadFile(fileDataInfo, files);

	Modal.hide("attachments_upload_modal");
}

// 签章后作为新附件上传
NodeManager.signPdf = function(filePath, filename){
	$(document.body).addClass("loading");
	$('.loading-text').text(TAPi18n.__("workflow_attachment_uploading") + filename + "...");
	var fileDataInfo = [{
		urlKey: "Content-Type",
		urlValue: cfs.getContentType(filename)
	}, {
		urlKey: "instance",
		urlValue: Session.get('attach_instance_id')
	}, {
		urlKey: "space",
		urlValue: Session.get('attach_space_id')
	}, {
		urlKey: "approve",
		urlValue: InstanceManager.getMyApprove().id
	}, {
		urlKey: "owner",
		urlValue: Meteor.userId()
	}, {
		urlKey: "owner_name",
		urlValue: Meteor.user().name
	}, {
		urlKey: "upload_from",
		urlValue: "node"
	}, {
		urlKey: "is_private",
		urlValue: true
	}]

	var files = [{
			urlKey: "file",
			urlValue: filePath
		}]
		// 上传接口
	OfficeOnline.uploadFile(fileDataInfo, files);

	Modal.hide("attachments_upload_modal");
}

// 获取文件hash值
NodeManager.getFileSHA1 = function(filePath, filename, callback) {
	var fd = fs.createReadStream(filePath);
	var hash = crypto.createHash('sha1');
	hash.setEncoding('hex');
	fd.pipe(hash);
	fd.on('end', function() {
		hash.end();
		var SHA1 = hash.read();
		callback(SHA1);
	});
}

// 使用edit.vbs打开本地office
NodeManager.vbsEditFile = function(download_dir, filename, arg) {
	var filePath = download_dir + filename;
	// 获取华炎云安装路径
	var homePath = process.cwd();

	var cmd = '\"' + homePath + '\"' + '\\vbs\\edit.vbs ' + '\"' + filePath + '\" ' + Meteor.users.findOne().name;

	if (arg == "Steedos.User.isSignature"){
		cmd = 'start "" /wait ' + '\"' + filePath + '\"';
		Modal.show("attachments_sign_modal", { filePath: filePath });
	}else{
		Modal.show("attachments_upload_modal", { filePath: filePath });
	}
	
	// 免费版大小不能超过1M
	var freeMaximumFileSize = 1024 * 1024;

	// 专业版文件大小不能超过100M
	// 读取settings中附件最大限制,默认100M
	var maximumFileSize = 100 * 1024 * 1024;
	var ref, ref1, ref2;
	var attachment_size_limit = ((ref = Meteor.settings) != null ? (ref1 = ref["public"]) != null ? (ref2 = ref1.workflow) != null ? ref2.attachment_size_limit : void 0 : void 0 : void 0) || 100;
	
	if (attachment_size_limit)
		maximumFileSize = attachment_size_limit * 1024 * 1024;

	var limitSize, warnStr;

	var is_paid = WorkflowManager.isPaidSpace(Session.get('spaceId'));

	if (is_paid) {
		limitSize = maximumFileSize;
		warnStr = t("workflow_attachment_paid_size_limit") + attachment_size_limit + "MB";
	} else {
		limitSize = freeMaximumFileSize;
		warnStr = t("workflow_attachment_free_size_limit");
	}
	// 执行vbs编辑word
	var child = exec(cmd);
	//正在编辑
	globalWin.disableClose = true;

	child.on('error', function(error) {
		toastr.error(error);
	});
	child.on('close', function() {
		if (arg == "Steedos.User.isSignature"){
			filename = "签章：" + filename;
			filePath = download_dir + filename;
			
			fs.exists(filePath, function(exists) {
				if (exists == false){
					Modal.hide("attachments_sign_modal");
					InstanceManager.unlockAttach(Session.get('cfs_file_id'));
					toastr.warning(t("node_pdf_error"));
				}
			})
		}

		// 完成编辑
		Modal.hide("attachments_upload_modal");

		// 修改后附件大小
		var states = fs.statSync(filePath);

		// 上传前切换到当前编辑的申请单
		var instance_url = "/workflow/space/" + Session.get('attach_space_id') + "/" + Session.get('attach_box') + "/" + Session.get('attach_instance_id');

		FlowRouter.go(instance_url);

		globalWin.disableClose = false;

		// 判断编辑后的文件hash值是否变化
		NodeManager.getFileSHA1(filePath, filename, function(sha1) {
			if (NodeManager.fileSHA1 != sha1) {
				var setting = {
					title: t("node_office_warning"),
					text: filePath,
					type: "warning",
					showCancelButton: true,
					confirmButtonText: t("node_office_confirm"),
					cancelButtonText: t("node_office_cancel")
				}

				if (states.size > limitSize) {
					setting.closeOnConfirm = false;
				}
				// 提示确认信息
				swal(setting, function(isConfirm) {
					if (isConfirm) {
						if (states.size > limitSize) {
							swal({
								title: warnStr,
								type: "warning",
								confirmButtonText: t("node_office_confirm"),
								closeOnConfirm: true
							}, function() {
								NodeManager.vbsEditFile(download_dir, filename);
							});
						} else {
							if (arg == "Steedos.User.isNewFile"){
								// 正文上传
								NodeManager.setUploadRequests(filePath, filename, true, true);
							}else{
								if (InstanceManager.isAttachLocked(Session.get("attach_instance_id"), Meteor.userId())){
									if (arg == "Steedos.User.isSignature"){
										fs.exists(filePath, function(exists) {
											if (exists == true){
												NodeManager.signPdf(filePath, filename);
											}else{
												Modal.hide("attachments_sign_modal");
												// 解锁 
												InstanceManager.unlockAttach(Session.get('cfs_file_id'));
												toastr.error(t("node_pdf_error"));
											}
										})
									}else{
										NodeManager.setUploadRequests(filePath, filename, false, true);
									}
								}else{
									toastr.warning(t("steedos_desktop_edit_warning"));
								}
							}
						}
					} else {
						// 解锁 
						InstanceManager.unlockAttach(Session.get('cfs_file_id'));
					}
				})
			} else {
				// 解锁 
				InstanceManager.unlockAttach(Session.get('cfs_file_id'));
			}
		})
	})
}

// 编辑文件
NodeManager.downloadFile = function(file_url, filename, arg) {
	//获取系统Documents路径
	var download_dir = process.env.USERPROFILE + "\\Steedos\\";
	fs.exists(download_dir, function(exists) {
		if (exists == true) {
			// 直接下载到本地覆盖之前的同名版本
			OfficeOnline.downloadFile(file_url, download_dir, filename, arg);
		}else {
			// 新建路径并下载附件到本地
			fs.mkdir(download_dir, function(err) {
				if (err) {
					toastr.error(err);
				} else {
					OfficeOnline.downloadFile(file_url, download_dir, filename, arg);
				}
			})
		}
	})
}

// 可查看的文件
NodeManager.isViewType = function(filename){
	if (Steedos.isOfficeFile(filename) || Steedos.isPdfFile(filename) || Steedos.isExcelFile(filename) || Steedos.isTiffFile(filename) || Steedos.isPPTFile(filename) || Steedos.isTextFile(filename))
		return true;
	else
		return false;
}
