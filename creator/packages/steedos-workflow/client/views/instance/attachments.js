Template.instance_attachments.helpers(InstanceAttachmentTemplate.helpers)

Template.instance_attachments.onCreated(function() {
	self = this;
	self.workflowMainAttachTitle = new ReactiveVar(true);
})

Template.instance_attachments.onRendered(function() {

	self = this;

	var ins = WorkflowManager.getInstance();
	if (!ins)
		self.workflowMainAttachTitle.set(true);

	var current_step = InstanceManager.getCurrentStep();

	var main_attach_count = cfs.instances.find({
		'metadata.instance': ins._id,
		'metadata.current': true,
		'metadata.main': true
	}).count();

	var distribute_main_attach_count = 0;

	if (ins.distribute_from_instance) {
		var start_step = InstanceManager.getStartStep();
		if (start_step.can_edit_main_attach) {
			var distribute_main_attach_count = cfs.instances.find({
				'metadata.instance': ins.distribute_from_instance,
				'metadata.current': true,
				'metadata.main': true
			}).count();
		}
	}

	if ((current_step.can_edit_main_attach == true && (Session.get("box") == "draft" || Session.get("box") == "inbox")) || main_attach_count > 0 || distribute_main_attach_count > 0) {
		self.workflowMainAttachTitle.set(true);
	} else {
		self.workflowMainAttachTitle.set(false);
	}

	//$('.swipebox').swipebox();
});

Template.instance_attachment.helpers({

	can_delete: function(currentApproveId, parent_id) {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false;

		// 分发后的 附件，不可以编辑/删除，也不让上传新的附件
		if (ins.distribute_from_instances && ins.distribute_from_instances.includes(this.metadata.instance)) {
			return false
		}

		// 已经结束的单子不能改附件
		if (ins.state == "completed") {
			return false
		}

		var isDraftOrInbox = false;
		var isFlowEnable = false;
		var isHistoryLenthZero = false;
		var box = Session.get("box");
		var isLocked = false;
		var can_remove_attach = false;

		if (box == "draft" || box == "inbox")
			isDraftOrInbox = true;

		var flow = db.flows.findOne(ins.flow, {
			fields: {
				state: 1
			}
		});
		if (flow && flow.state == "enabled")
			isFlowEnable = true;

		var count = cfs.instances.find({
			'metadata.parent': parent_id
		}).count();
		if (count == 1) isHistoryLenthZero = true;

		var current = cfs.instances.findOne({
			'metadata.parent': parent_id,
			'metadata.current': true
		});

		if (!current)
			return false

		if (current && current.metadata && current.metadata.locked_by)
			isLocked = true;

		var currentApprove = InstanceManager.getCurrentApprove();

		if (!currentApprove)
			return false;

		_.each(ins.traces, function(t) {
			_.each(t.approves, function(a) {
				if (a._id == currentApprove._id) {
					var step = WorkflowManager.getInstanceStep(t.step);
					if (current.metadata.main == true) {
						if (step && step.can_edit_main_attach == true) {
							if (current.metadata.owner == Meteor.userId())
								can_remove_attach = true;
						}
					} else {
						if (step && (step.can_edit_normal_attach == true || step.can_edit_normal_attach == undefined)) {
							if (current.metadata.owner == Meteor.userId())
								can_remove_attach = true;
						}
					}

				}
			})
		})

		return can_remove_attach && isDraftOrInbox && isFlowEnable && isHistoryLenthZero && !isLocked;
	},

	getUrl: function(_rev, isPreview) {
		// url = Meteor.absoluteUrl("api/files/instances/") + attachVersion._rev + "/" + attachVersion.filename;
		if (Steedos.isNode())
			url = window.location.origin + "/api/files/instances/" + _rev;
		else
			url = Steedos.absoluteUrl("api/files/instances/") + _rev;

		if (!(typeof isPreview == "boolean" && isPreview) && !Steedos.isMobile()) {
			url = url + "?download=true";
		}
		return url;
	},

	canView: function(filename) {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false;

		if (Steedos.isNode() && !Steedos.isMobile() && !Steedos.isMac() && NodeManager.isViewType(filename))
			return true;
	},

	canEdit: function(mainFile, filename, locked_by) {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false;

		// 分发后的 附件，不可以编辑/删除，也不让上传新的附件
		if (ins.distribute_from_instances && ins.distribute_from_instances.includes(this.metadata.instance)) {
			return false
		}

		// 已经结束的单子不能改附件
		if (ins.state == "completed") {
			return false
		}

		var locked = false;
		if (locked_by) locked = true;
		if ((Steedos.isIE() || Steedos.isNode()) && (Session.get('box') == 'inbox' || Session.get('box') == 'draft') && !Steedos.isMobile() && !Steedos.isMac() && Steedos.isOfficeFile(filename) && !locked) {
			if (InstanceManager.isCC(ins)) {
				var step = InstanceManager.getCCStep();
				if (step) {
					if (mainFile) {
						return step.can_edit_main_attach
					} else {
						if (step.can_edit_normal_attach == true || step.can_edit_normal_attach == undefined) {
							return true
						}
					}
				}
			} else {
				var current_step = InstanceManager.getCurrentStep();

				if (current_step) {
					if (mainFile) {
						return current_step.can_edit_main_attach
					} else {
						if (current_step.can_edit_normal_attach == true || current_step.can_edit_normal_attach == undefined) {
							return true
						}

					}
				}
			}

		}

		return false;
	},

	IsImageAttachment: function(attachment) {
		if (!attachment)
			return;
		var type = attachment.original.type;
		if (type == "image/tiff")
			return;
		else
			return type.startsWith("image/");
	},

	IsHtmlAttachment: function(attachment) {
		if (!attachment)
			return;
		return attachment.original.type == "text/html"
	},

	isPrint: function() {
		if (Session && Session.get("instancePrint"))
			return true
		else
			false
	},

	locked_info: function(locked_by_name) {
		return TAPi18n.__('workflow_attach_locked_by', locked_by_name);
	},

	can_unlock: function(locked_by) {
		return locked_by == Meteor.userId();
	}
});

Template.instance_attachment.events({
	"click [name='ins_attach_version']": function(event, template) {
		Session.set("attach_parent_id", event.target.dataset.parent);
		Modal.show('ins_attach_version_modal');
	},
	"click .ins_attach_href": function(event, template) {
		// 在手机、安卓和ios设备上弹出窗口显示附件
		// 电脑上使用的是下载附件功能，由于手机上支持大部分文件类型在线预览，所以手机上默认使用打开新窗口查看方式
		if (Steedos.isMobile() || Steedos.isAndroidOrIOS()) {
			Steedos.openWindow(event.target.getAttribute("href"))
			event.stopPropagation()
			return false;
		}
	},
	"click [name='ins_attach_mobile']": function(event, template) {
		var url = event.target.dataset.downloadurl;
		var filename = template.data.name();
		var rev = template.data._id;
		var length = template.data.size();
		Steedos.cordovaDownload(url, filename, rev, length);
	},
	"click [name='ins_attach_isNode']": function(event, template) {
		Session.set('cfs_file_id', event.target.id);
		Session.set('attach_parent_id', event.target.dataset.parent);
		Session.set('attach_instance_id', Session.get("instanceId"));
		Session.set('attach_space_id', Session.get("spaceId"));
		Session.set('attach_box', Session.get("box"));
		// Session.set('attach_edit_time', $.format.date(new Date(), "yyyy-MM-dd HH:mm"));
		// 编辑时锁定
		InstanceManager.lockAttach(event.target.id);

		var url = event.target.dataset.downloadurl;
		var filename = event.target.dataset.name;
		NodeManager.downloadFile(url, filename);
	},
	"click [name='ins_attach_edit']": function(event, template) {
		Session.set("attach_id", event.target.id);
		Session.set('cfs_file_id', event.target.id);
		Session.set('attach_parent_id', event.target.dataset.parent);
		Session.set('cfs_filename', event.target.dataset.name);
		Modal.show('ins_attach_edit_modal');
	},
	"click [name='ins_attach_isView']": function(event, template) {
		Session.set('cfs_file_id', event.target.id);
		Session.set('attach_parent_id', event.target.dataset.parent);
		var url = event.target.dataset.downloadurl;
		var filename = event.target.dataset.name;
		var arg = "Steedos.User.isView";
		NodeManager.downloadFile(url, filename, arg);
	},
	"click [name='ins_attach_preview']": function(event, template) {
		if (event.target.id) {
			if (Steedos.isNode())
				url = window.location.origin + "/api/files/instances/" + event.target.id;
			else
				url = Steedos.absoluteUrl("api/files/instances/") + event.target.id;

			Steedos.openWindow(url);
		}
	},
	"click .ins-attach-delete": function(event, template) {
		var file_id = event.target.id;
		var file_name = event.target.dataset.name;
		if (!file_id) {
			return false;
		}

		swal({
			title: t('workflow_attach_confirm_delete'),
			text: t("workflow_attach_confirm_delete_messages", file_name),
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: t("workflow_attach_confirm"),
			cancelButtonText: t("workflow_attach_cancel"),
			closeOnConfirm: true
		}, function() {
			Meteor.call('cfs_instances_remove', file_id, function(error, result) {
				if (error) {
					toastr.error(error.message);
				}

				if (result) {
					toastr.success(TAPi18n.__('Attachment deleted successfully'));
				}
			})
			return true;
		});
	},

	"click .ins-attach-unlock": function(event, template) {
		InstanceManager.unlockAttach(event.target.id);
	}
})


Template.ins_attach_version_modal.helpers({

	attach_versions: function() {
		var parent = Session.get('attach_parent_id');
		if (!parent) return;

		var ins = WorkflowManager.getInstance();
		if (!ins)
			return;

		var selector = {
			'metadata.parent': parent
		};
		// 如果是被分发的文件，则不显示文件的历史版本
		if (ins.distribute_from_instance) {
			var current = cfs.instances.findOne({
				'metadata.parent': parent,
				'metadata.current': true
			})
			if (ins.distribute_from_instances.includes(current.metadata.instance))
				selector['metadata.current'] = true;
		}

		return cfs.instances.find(selector, {
			sort: {
				uploadedAt: -1
			}
		}).fetch();
	},

	attach_current_version: function() {
		var parent = Session.get('attach_parent_id');
		if (!parent) return;

		return cfs.instances.findOne({
			'metadata.parent': parent,
			'metadata.current': true
		});
	},


	attach_version_info: function(owner_name, uploadedAt) {
		return uploadedAt ? (owner_name + " , " + $.format.date(uploadedAt, "yyyy-MM-dd HH:mm")) : owner_name;
	},

	enabled_add_attachment: function() {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false

		// 已经结束的单子不能改附件
		if (ins.state == "completed") {
			return false
		}

		var parent = Session.get('attach_parent_id');
		if (!parent) return false

		var current = cfs.instances.findOne({
			'metadata.parent': parent,
			'metadata.current': true
		});

		if (!current)
			return false

		// 分发后的 正文、附件，不可以编辑/删除，也不让上传新的正文/附件版本
		if (ins.distribute_from_instances && ins.distribute_from_instances.includes(current.metadata.instance))
			return false

		if (current && current.metadata && current.metadata.locked_by)
			return false

		if (Session.get("box") == "draft" || Session.get("box") == "inbox") {
			if (InstanceManager.isCC(ins)) {
				var step = InstanceManager.getCCStep();
				// 如果是正文 则判断是否有编辑权限
				if (current.metadata.main == true) {
					if (step && step.can_edit_main_attach == true)
						return true
				} else {
					// 如果是附件 则判断是否有编辑权限
					if (step && (step.can_edit_normal_attach == true || step.can_edit_normal_attach == undefined))
						return true
				}
			} else {
				var current_step = InstanceManager.getCurrentStep();
				// 如果是正文 则判断是否有编辑权限
				if (current.metadata.main == true) {
					if (current_step && current_step.can_edit_main_attach == true)
						return true
				} else {
					// 如果是附件 则判断是否有编辑权限
					if (current_step && (current_step.can_edit_normal_attach == true || current_step.can_edit_normal_attach == undefined))
						return true
				}
			}

		}

		return false
	},

	current_can_delete: function(currentApproveId, parent_id) {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false;

		// 已经结束的单子不能改附件
		if (ins.state == "completed") {
			return false
		}

		// 分发后的 正文、附件，不可以编辑/删除，也不让上传新的正文/附件
		if (ins.distribute_from_instances && ins.distribute_from_instances.includes(this.metadata.instance))
			return false

		var isDraftOrInbox = false;
		var isFlowEnable = false;
		var isHistoryLenthZero = false;
		var box = Session.get("box");
		var isLocked = false;
		var can_remove_attach = false;

		if (box == "draft" || box == "inbox")
			isDraftOrInbox = true;

		var flow = db.flows.findOne(ins.flow, {
			fields: {
				state: 1
			}
		});
		if (flow && flow.state == "enabled")
			isFlowEnable = true;

		var count = cfs.instances.find({
			'metadata.parent': parent_id
		}).count();
		if (count == 1) isHistoryLenthZero = true;

		var current = cfs.instances.findOne({
			'metadata.parent': parent_id,
			'metadata.current': true
		});

		if (!current)
			return false;

		if (current && current.metadata && current.metadata.locked_by)
			isLocked = true;

		var currentApprove = InstanceManager.getCurrentApprove();

		if (!currentApprove)
			return false;

		_.each(ins.traces, function(t) {
			_.each(t.approves, function(a) {
				if (a._id == currentApprove._id) {
					var step = WorkflowManager.getInstanceStep(t.step);
					if (current.metadata.main == true) {
						if (step && step.can_edit_main_attach == true) {
							if (current.metadata.owner == Meteor.userId())
								can_remove_attach = true;
						}
					} else {
						if (step && (step.can_edit_normal_attach == true || step.can_edit_normal_attach == undefined)) {
							if (current.metadata.owner == Meteor.userId())
								can_remove_attach = true;
						}
					}

				}
			})
		})

		return can_remove_attach && isDraftOrInbox && isFlowEnable && !isHistoryLenthZero && !isLocked;
	},

	canView: function(filename) {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false;

		if (Steedos.isNode() && !Steedos.isMobile() && !Steedos.isMac() && NodeManager.isViewType(filename))
			return true;
	},

	canEdit: function(mainFile, filename, locked_by) {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false;

		// 已经结束的单子不能改附件
		if (ins.state == "completed") {
			return false
		}

		// 分发后的 正文、附件，不可以编辑/删除，也不让上传新的正文/附件版本
		if (ins.distribute_from_instances && ins.distribute_from_instances.includes(this.metadata.instance))
			return false

		var locked = false;
		if (locked_by) locked = true;
		if ((Steedos.isIE() || Steedos.isNode()) && (Session.get('box') == 'inbox' || Session.get('box') == 'draft') && !Steedos.isMobile() && !Steedos.isMac() && Steedos.isOfficeFile(filename) && !locked) {
			if (InstanceManager.isCC(ins)) {
				var step = InstanceManager.getCCStep();
				if (step) {
					if (mainFile) {
						return step.can_edit_main_attach
					} else {
						if (step.can_edit_normal_attach == true || step.can_edit_normal_attach == undefined) {
							return true
						}
					}
				}
			} else {
				var current_step = InstanceManager.getCurrentStep();
				if (current_step) {
					if (mainFile) {
						return current_step.can_edit_main_attach
					} else {
						if (current_step.can_edit_normal_attach == true || current_step.can_edit_normal_attach == undefined) {
							return true
						}
					}
				}
			}
		}
		return false;
	},

	canConvertToPdf: function(mainFile, filename, locked_by) {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false;

		// 已经结束的单子不能改附件
		if (ins.state == "completed") {
			return false
		}

		// 分发后的 正文、附件，不可以编辑/删除，也不让上传新的正文/附件版本，也不允许转PDF
		if (ins.distribute_from_instances && ins.distribute_from_instances.includes(this.metadata.instance))
			return false

		var locked = false;
		if (locked_by) locked = true;
		if ((Steedos.isIE() || Steedos.isNode()) && (Session.get('box') == 'inbox' || Session.get('box') == 'draft') && !Steedos.isMobile() && !Steedos.isMac() && Steedos.isOfficeFile(filename) && !locked) {
			if (InstanceManager.isCC(ins)) {
				var step = InstanceManager.getCCStep();
				if (step && step.can_edit_main_attach == true)
					return true
			} else {
				var current_step = InstanceManager.getCurrentStep();
				if (current_step) {
					if (mainFile)
						return current_step.can_edit_main_attach
				}
			}
		}
		return false;
	},

	canSign: function(mainFile, filename, locked_by) {
		var ins = WorkflowManager.getInstance();
		if (!ins)
			return false;

		// 已经结束的单子不能改附件
		if (ins.state == "completed")
			return false;

		// 分发后的 正文、附件，不可以编辑/删除，也不让上传新的正文/附件版本，也不允许转PDF
		if (ins.distribute_from_instances && ins.distribute_from_instances.includes(this.metadata.instance))
			return false

		var locked = false;
		if (locked_by) locked = true;
		if ((Steedos.isIE() || Steedos.isNode()) && (Session.get('box') == 'inbox' || Session.get('box') == 'draft') && !Steedos.isMobile() && !Steedos.isMac() && Steedos.isPdfFile(filename) && !locked) {
			if (InstanceManager.isCC(ins)) {
				var step = InstanceManager.getCCStep();
				if (step && step.can_edit_main_attach == true)
					return true
			} else {
				var current_step = InstanceManager.getCurrentStep();
				if (current_step) {
					if (mainFile)
						return current_step.can_edit_main_attach
				}
			}
		}
		return false;
	},

	getUrl: function(_rev, isPreview) {
		// url = Meteor.absoluteUrl("api/files/instances/") + attachVersion._rev + "/" + attachVersion.filename;
		if (Steedos.isNode())
			url = window.location.origin + "/api/files/instances/" + _rev;
		else
			url = Steedos.absoluteUrl("api/files/instances/") + _rev;

		if (!(typeof isPreview == "boolean" && isPreview) && !Steedos.isMobile()) {
			url = url + "?download=true";
		}
		return url;
	},

	locked_info: function(locked_by_name, locked_time) {
		if (locked_time)
			return TAPi18n.__('workflow_attach_locked_by', locked_by_name) + " , " + moment(locked_time).format("YYYY-MM-DD HH:mm");
		else
			return TAPi18n.__('workflow_attach_locked_by', locked_by_name);
	},

	can_unlock: function(locked_by) {
		if (locked_by)
			return Steedos.isSpaceAdmin(Session.get("spaceId"), Meteor.userId()) || (locked_by == Meteor.userId());
	},

	IsImageAttachment: function(attachment) {
		if (!attachment)
			return;
		var type = attachment.original.type;

		if (type == "image/tiff")
			return;
		else
			return type.startsWith("image/");
	},

	IsHtmlAttachment: function(attachment) {
		if (!attachment)
			return;
		return attachment.original.type == "text/html"
	}
})


Template.ins_attach_version_modal.events({

	'change .ins-file-version-input': function(event, template) {

		element = $("#" + event.currentTarget.id)

		if (event.target.files.length > 0) {
			if (!InstanceEvent.run(element, "instance-before-upload")) {
				$("#ins_upload_main_attach").val('')
				return
			}
		}

		if (this.metadata.main == true) {
			InstanceManager.uploadAttach(event.target.files, true, true);
		} else {
			InstanceManager.uploadAttach(event.target.files, true, false);
		}

		$(".ins-file-version-input").val('')
	},
	"click .ins_attach_href": function(event, template) {
		// 在手机、安卓和ios设备上弹出窗口显示附件
		// 电脑上使用的是下载附件功能，由于手机上支持大部分文件类型在线预览，所以手机上默认使用打开新窗口查看方式
		if (Steedos.isMobile() || Steedos.isAndroidOrIOS()) {
			Steedos.openWindow(event.target.getAttribute("href"))
			event.stopPropagation()
			return false;
		}
	},
	"click [name='ins_attach_mobile']": function(event, template) {
		var url = event.target.dataset.downloadurl;
		var filename = this.name();
		var rev = this._id;
		var length = this.size();
		Steedos.cordovaDownload(url, filename, rev, length);
	},
	"click .btn-primary": function(event, template) {
		InstanceManager.unlockAttach(event.target.id);
	},
	"click [name='ins_attach_isNode']": function(event, template) {
		Modal.hide('ins_attach_version_modal');
		Session.set('cfs_file_id', event.target.id);
		Session.set('attach_parent_id', event.target.dataset.parent);
		Session.set('attach_instance_id', Session.get("instanceId"));
		Session.set('attach_space_id', Session.get("spaceId"));
		Session.set('attach_box', Session.get("box"));
		// 编辑时锁定
		InstanceManager.lockAttach(event.target.id);

		var url = event.target.dataset.downloadurl;
		var filename = event.target.dataset.name;
		NodeManager.downloadFile(url, filename);
	},
	"click [name='ins_attach_isView']": function(event, template) {
		Session.set('cfs_file_id', event.target.id);
		Session.set('attach_parent_id', event.target.dataset.parent);
		var url = event.target.dataset.downloadurl;
		var filename = event.target.dataset.name;
		var arg = "Steedos.User.isView";
		NodeManager.downloadFile(url, filename, arg);
	},
	"click [name='ins_attach_preview']": function(event, template) {
		if (event.target.id) {
			if (Steedos.isNode())
				url = window.location.origin + "/api/files/instances/" + event.target.id;
			else
				url = Steedos.absoluteUrl("api/files/instances/") + event.target.id;

			Steedos.openWindow(url);
		}
	},
	"click [name='ins_attach_convert_to_pdf']": function(event, template) {
		Session.set('cfs_file_id', event.target.id);
		Session.set('attach_parent_id', event.target.dataset.parent);
		Session.set('attach_instance_id', Session.get("instanceId"));
		Session.set('attach_space_id', Session.get("spaceId"));
		Session.set('attach_box', Session.get("box"));

		// 转换时锁定
		InstanceManager.lockAttach(event.target.id);

		var url = event.target.dataset.downloadurl;
		var filename = event.target.dataset.name;
		var arg = "Steedos.User.isDocToPdf";
		Modal.hide('ins_attach_version_modal');
		swal({
			title: t("workflow_attach_to_pdf"),
			text: t("workflow_attach_to_pdf_message", filename),
			type: "warning",
			showCancelButton: true,
			confirmButtonText: t("node_office_confirm"),
			cancelButtonText: t("node_office_cancel"),
			closeOnConfirm: true
		}, function(confirm) {
			if (confirm) {
				NodeManager.downloadFile(url, filename, arg);
			} else {
				// 解锁
				InstanceManager.unlockAttach(Session.get('cfs_file_id'));
			}
		})
	},

	"click [name ='ins_attach_signature']": function(event, template) {
		Session.set('cfs_file_id', event.target.id);
		Session.set('attach_parent_id', event.target.dataset.parent);
		Session.set('attach_instance_id', Session.get("instanceId"));
		Session.set('attach_space_id', Session.get("spaceId"));
		Session.set('attach_box', Session.get("box"));

		//签章时锁定
		InstanceManager.lockAttach(event.target.id);

		var arg = "Steedos.User.isSignature";
		var url = event.target.dataset.downloadurl;
		var filename = event.target.dataset.name;

		Modal.hide('ins_attach_version_modal');
		NodeManager.downloadFile(url, filename, arg);
	},

	"click .ins-attach-version-delete": function(event, template) {
		var file_id = event.target.id;
		var file_name = event.target.dataset.name;
		if (!file_id) {
			return false;
		}

		Modal.hide('ins_attach_version_modal');
		swal({
			title: t("workflow_attach_confirm_delete"),
			text: t("workflow_attach_confirm_delete_messages", file_name),
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: t("workflow_attach_confirm"),
			cancelButtonText: t("workflow_attach_cancel"),
			closeOnConfirm: true
		}, function() {
			Meteor.call('cfs_instances_remove', file_id, function(error, result) {
				if (error) {
					toastr.error(error.message);
				}

				if (result) {
					var parent = Session.get('attach_parent_id');
					var current = cfs.instances.find({
						'metadata.parent': parent
					}, {
						sort: {
							uploadedAt: -1
						}
					}).fetch()[0];

					Meteor.call('cfs_instances_set_current', current._id, function(error, result) {
						if (error) {
							toastr.error(error.message);
						}
						if (result) {
							toastr.success(TAPi18n.__('Attachment deleted successfully'));
						}
					})
				}
			})
			return true;
		});
	}

})

Template.ins_attach_version_modal.onRendered(function() {

	var instance = WorkflowManager.getInstance();

	if (!instance)
		return;

	InstanceEvent.initEvents(instance.flow);

})


Template.ins_attach_edit_modal.helpers({

	name: function() {
		return Session.get('cfs_filename');
	}

})

Template.ins_attach_edit_modal.onRendered(function() {

	var cfs_file_id = Session.get('cfs_file_id');
	if (!cfs_file_id)
		return;

	// 编辑时锁定
	InstanceManager.lockAttach(cfs_file_id);

	var f = cfs.instances.findOne({
		_id: cfs_file_id
	});
	if (f) {
		TANGER_OCX_OBJ = document.getElementById("TANGER_OCX_OBJ");
		url = Steedos.absoluteUrl("api/files/instances/") + f._id + "/" + f.name() + "?download=true";
		TANGER_OCX_OBJ.OpenFromURL(url);

		if (f.name().split('.').length < 2)
			return false;

		var fileType = f.name().split('.').pop().toLowerCase();

		if (fileType == ('doc' || 'docx')) {
			//设置office用户名
			with(TANGER_OCX_OBJ.ActiveDocument.Application) {
				UserName = Meteor.user().name;
			}

			TANGER_OCX_OBJ.ActiveDocument.TrackRevisions = true;
		}

	}

	setTimeout(function() {
		// set body height
		var total = document.documentElement.clientHeight;
		var header = document.getElementById("attach_edit_modal_header").offsetHeight;
		document.getElementById("attach_edit_modal_body").style.height = (total - header).toString() + "px";
	}, 1);

})

Template.ins_attach_edit_modal.events({
	// save attach
	'click .btn-primary': function(event, template) {
		var filename = event.target.dataset.filename;

		var TANGER_OCX_OBJ = document.getElementById("TANGER_OCX_OBJ");

		var params = {};
		params.space = Session.get('spaceId');
		params.instance = Session.get('instanceId');
		params.approve = InstanceManager.getMyApprove().id;
		params.owner = Meteor.userId();
		params.owner_name = Meteor.user().name;
		params.isAddVersion = true;
		params.parent = Session.get('attach_parent_id');
		params.locked_by = Meteor.userId();
		params.locked_by_name = Meteor.user().name;
		params.upload_from = "IE";
		params.overwrite = true;

		var main_count = cfs.instances.find({
			'metadata.parent': Session.get('attach_parent_id'),
			'metadata.current': true,
			'metadata.main': true
		}).count();
		if (main_count > 0) {
			params.main = true;
		}

		if (Steedos.isNode())
			url = window.location.orgin + "/api/v4/instances/s3/";
		else
			url = Meteor.absoluteUrl('api/v4/instances/s3/');

		var params_str = $.param(params);

		var data = TANGER_OCX_OBJ.SaveToURL(url, "file", params_str, encodeURIComponent(filename), 0);

		var json_data = eval('(' + data + ')');

		// 先解锁
		InstanceManager.unlockAttach(Session.get('cfs_file_id'));
		// 编辑时锁定
		Session.set('cfs_file_id', json_data['version_id']);

		toastr.success(TAPi18n.__('Attachment was added successfully'));
	},

	// 关闭编辑页面
	'click .btn-default': function(event, template) {
		InstanceManager.unlockAttach(Session.get('cfs_file_id'));
	}

})
