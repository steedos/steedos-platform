Creator.Objects.post_category =
	name: "post_category"
	label: "栏目"
	icon: "post"
	enable_files:true
	fields:
		name:
			label:'名称'
			type:'text'
			required:true
			group:'-'
		description:
			label:'描述'
			type:'textarea'
			is_wide:true

		cover:
			label: "封面图"
			type:'image'
			group:'-'

		parent:
			label:'上级栏目'
			type:'lookup'
			reference_to:'post_category'
			group:'-'
		sort_no:
			label:'排序号'
			type:'number'
	list_views:
		all:
			label: "所有"
			columns: ["name", "sort_no", "description"]
			filter_scope: "space"
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		member:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true

