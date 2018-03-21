Creator.Objects["cfs.files.filerecord"] = 
	name: "cfs.files.filerecord"
	label: "文件版本"
	icon: "drafts"
	enable_search: true
	enable_api: false
	hidden: true
	fields:
		"original.$.name":
			label:"名称"
			type: "text"
		"original.$.size":
			label:"文件大小"
			type: "text"
		"metadata.$.owner_name":
			label:"上传者"
			type: "text"
		uploadedAt: 
			label:"上传时间"
			type: "datetime"
		"metadata.$.parent":
			label:"所属文件"
			type: "master_detail"
			reference_to: "cms_files"


	list_views:
		default:
			columns: ["original.$.name","original.$.size","metadata.$.owner_name","uploadedAt"]
		all:
			filter_scope: "spacex"

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