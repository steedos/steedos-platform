Creator.Objects.archive_classification = 
	name: "archive_classification"
	icon: "product_item"
	label: "分类表"
	enable_search: true
	fields:
		sort_no:
			type:'Number'
			label:"排序号"
			index:true
		name:
			type:"text"
			label:"分类名称"
			is_name:true
			required:true
			searchable:true
			index:true
		parent:
			type:"lookup"
			label:"上级分类"
			reference_to:"archive_classification"
			multiple:true
		keywords:
			type:"[text]"
			label:"所属部门"
			is_wide:true

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
	list_views:
		all:
			label:"全部"
			filter_scope: "space"
			columns:["sort_no","name","parent","keywords"]