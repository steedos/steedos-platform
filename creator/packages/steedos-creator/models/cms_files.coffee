Creator.Objects.cms_files = 
	name: "cms_files"
	label: "Files"
	icon: "drafts"
	fields:
		name: 
			label: "名称"
			type: "text"
		description: 
			label: "描述"
			type: "textarea"
			optional: true
		extention: 
			label: "文件后缀"
			type: "text"
			disabled: true
		size:
			label: "文件大小"
			type: "number"
			disabled: true
		versions:
			type: "file"
			collection: "files"
			multiple: true
			omit: true
		parent:
			type: "lookup"
			omit: true
			reference_to: ()->
				return _.keys(Creator.Objects)


	list_views:
		default:
			columns: ["name", "owner", "modified"]
		all:
			filter_scope: "space"

	permission_set:
		default:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 

	triggers:
		"before.remove.server.default": 
			on: "server"
			when: "before.remove"
			todo: (userId, doc)->
				collection = cfs.files
				collection.remove {"metadata.parent": doc._id}

	actions: 
		new_version:
			label: "上传新版本"
			visible: true
			todo: ()->
				alert("you clicked on new_version button")
		download:
			label: "下载"
			visible: true
			todo: ()->
				alert("you clicked on download button")