Creator.Objects.instances =
	name: "instances"
	icon: "task"
	label: "申请单"
	fields:
		name:
			label:"文件标题"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			is_wide: true
			#index:true
		flow:
			label:"流程"
			type: "master_detail"
			reference_to: "flows"
			readonly: true
		flow_version:
			label:"流程版本号"
			type: "string"
			hidden: true
		form:
			label:"表单"
			type: "master_detail"
			reference_to: "forms"
			readonly: true
		form_version:
			label:"表单版本号"
			type: "string"
			hidden: true
		submitter:
			label:"提交者"
			type: "master_detail"
			reference_to: "users"
			readonly: true
		submitter_name:
			type: "string"
			label:"提交者"
			hidden: true
		submit_date:
			type: "datetime"
			label:"提交日期"
		applicant:
			type: "lookup"
			label:"申请人"
			reference_to: "users"
		applicant_name:
			type: "string"
			label:"申请人"
			hidden: true
		applicant_organization:
			type: "lookup"
			label:"申请人部门"
			reference_to: "organizations"
		applicant_organization_name:
			type: "string"
			label:"申请人部门名称"
			hidden: true
		applicant_organization_fullname:
			type: "string"
			label:"申请人部门全称"
			hidden: true
		code:
			label:"公式"
			type: "string"
			hidden: true
		values:
			blackbox: true
			omit: true
			label:"申请单内容"
			hidden: true
		inbox_users:
			type: "string"
			type: "lookup"
			multiple: true
			reference_to: "users"
			label:"待办处理人"
		outbox_users:
			type: "string"
			type: "lookup"
			multiple: true
			reference_to: "users"
			label:"已办处理人"
		traces:
			type: [Object]
			blackbox: true
			omit: true
			label:"步骤审批"
			hidden: true
		attachments:
			type: [Object]
			blackbox: true
			omit: true
			label:"附件"
			hidden: true
		flow_name:
			type: "string"
			label:"流程名"
			hidden: true
		category_name:
			type: "string"
			label:"流程分类"
			hidden: true
		state:
			type: "string"
			label:"申请单状态"

		is_recorded:
			type: "boolean"
			label:"已归档"
		is_archived:
			type: "boolean"
			label:"已归档(旧)"
			hidden: true
		is_deleted:
			type: "boolean"
			label:"已删除"
			hidden: true

		related_instances:
			type: "string"
			type: "lookup"
			multiple: true
			reference_to: "instances"
			label:"相关申请单"
			is_wide: true
			
		record_ids:
			label:"记录ID"
			type: "grid"
			omit: true
			hidden: true

		"record_ids.$.o":
			type: "text"
			hidden:true
		"record_ids.$.ids":
			type: "[text]"
			hidden:true

	list_views:
		all:
			label:'所有'
			filter_scope: "space"
			columns: ["name", "applicant", "applicant_organization", "modified"]
		inbox:
			label: "待办文件"
			filter_scope: "space"
			filters: [["inbox_users", "=", "{userId}"]]
		outbox:
			label: "已办文件"
			filter_scope: "space"
			filters: [["outbox_users", "=", "{userId}"]]

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true

	actions:
		view_instance:
			label: "查看申请单"
			visible: true
			on: "record"
			todo: (object_name, record_id, fields)->
				uobj = {}
				uobj["box"] = 'monitor'
				uobj["X-User-Id"] = Meteor.userId()
				uobj["X-Auth-Token"] = Accounts._storedLoginToken()
				workflowUrl = window.location.protocol + '//' + window.location.hostname + '/'
				Steedos.openWindow(workflowUrl + "workflow/space/" + Session.get("spaceId") + "/print/" + record_id + "?" + $.param(uobj), "",'width=900,height=750,scrollbars=yes,EnableViewPortScale=yes,toolbarposition=top,transitionstyle=fliphorizontal,menubar=yes,closebuttoncaption=  x  ')