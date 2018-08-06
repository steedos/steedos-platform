Creator.Objects.vip_product_category =
	name: "vip_product_category"
	label: "商品分类"
	icon: "product_item"
	enable_files:true
	fields:
		name:
			label:'名称'
			type:'text'
			required:true
		sort_no:
			label:'排序号'
			type:'number'
		parent:
			label:'上级分类'
			type:'lookup'
			reference_to:'vip_product_category'
			defaultValue:'全部'
			index:true
			group:'-'
	
	list_views:
		all:
			label: "所有"
			columns: ["name", "sort_no",'parent']
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
	triggers:
		
		"before.insert.server.product_category":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if !doc.parent
					doc.parent = '全部'
		"before.update.server.product_category":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if(modifier?.$set?.parent and modifier?.$set?.parent==doc._id)
					throw new Meteor.Error 500, "上级分类不能等于当前分类"
		
		"after.update.server.product_category":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if !doc.parent
					Creator.getCollection("vip_product_category").direct.update(doc._id,{$set:{parent:'全部'}})	