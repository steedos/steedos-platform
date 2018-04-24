Creator.Objects.object_workflows =
	name: "object_workflows"
	label: "相关流程"
	icon: "apps"
	fields:
		name:
			label: "名称"
			type: "text"
			required: true

		object_name:
			label: "对象"
			type: "master_detail"
			reference_to: "objects"
			required: true
			optionsFunction: ()->
				_options = []
				_.forEach Creator.objectsByName, (o, k)->
					_options.push {label: o.label, value: k, icon: o.icon}
				return _options

		flow_id:
			label: "流程"
			type: "lookup"
			required: true
			reference_to: "flows"

		field_map:
			label: "字段映射关系"
			type: "grid"

		"field_map.$.object_field":
			label: "对象字段"
			type: "text"

		"field_map.$.workflow_field":
			label: "表单字段"
			type: "text"

		sync_attachment:
			label: "附件同步方式"
			type: "select"
			options: "不同步:null,同步最新版本:lastest,同步所有版本:all"
			required: true

	list_views:
		default:
			columns: ["name", "object_name", "flow_id"]
		all:
			label: "对象与流程对应关系"
			filter_scope: "space"
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true