calculateParents = (parentId)->
	parents = [];
	while (parentId)
		if parentId!='全部'
			parents.push(parentId)
		parentOrg = Creator.getCollection('vip_product_category').findOne(parentId, {fields:{parent: 1, name: 1}});
		if (parentOrg)
			parentId = parentOrg.parent
		else
			parentId = null
	return parents

calculateChildren = ()->
	children = []
	childrenObjs = Creator.getCollection('vip_product_category').findOne(parent, {fields: {_id:1}});
	childrenObjs.forEach (child) ->
		children.push(child._id);
	return children;

Creator.Objects.vip_product =
	name: "vip_product"
	label: "商品"
	icon: "product"
	enable_files:true
	fields:
		name:
			label:'名称'
			type:'text'
			is_wide:true
			required:true
			sortable: true
		description:
			label:'商品描述'
			type:'textarea'
			is_wide:true
		
		default_price:
			label:'现价'
			type:'number'
			required:true
			scale: 2
			sortable: true
			group:'-'
		compared_price:
			label:'原价'
			type:'number'
			scale: 2
			sortable: true
		
		covers:
			label:'轮播图'
			type:'image'
			multiple:true
			required:true
			group:'-'
		images:
			label:'详情描述图'
			type:'image'
			multiple:true
		avatar:
			label:'封面'
			type:'image'
			omit:true
		# video:
		# 	label:'视频'
		# 	type:'video'
		category:
			label:'所属分类'
			type:'lookup'
			reference_to:'vip_product_category'
			multiple:true
			group:'-'
		categories:
			label:'分类'
			type:'lookup'
			reference_to:'vip_product_category'
			multiple:true
			group:'-'
		tags:
			label:'标签'
			type:'text'
		vendor:
			label:'供应商'
			type:'text' 
		weight:
			label:'重量'
			type:'number'   
			scale: 2
		# gift:
		# 	label:'分享赠礼'
		# 	type:'textarea'
		# 	inlineHelpText:'邀请好友成功购买，可获得增礼。'
		# 	group:'-'
		status:
			label:'上架'
			type:'boolean'
			defaultValue:true
			group:'-'
			#草稿，上架，下架
	list_views:
		all:
			label: "所有"
			columns: ["name", "default_price", "compared_price", "avatar", "category"]
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
		member:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
	triggers:
		
		"before.insert.server.product":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if(doc.covers)
					doc.avatar = doc.covers[0]
				if(doc.category)
					doc.category.forEach (category)->
						product_category = Creator.getCollection("vip_product_category").findOne(category,{fields:{parent:1}})
						if product_category.parent
							parents = []
							parents = _.union(parents,calculateParents(product_category.parent))
							doc.categories = _.union(doc.categories,parents)
					doc.categories = _.union(doc.categories,doc.category)
		
		"after.update.server.product":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if(modifier?.$set?.covers)
					modifier.$set['avatar'] = modifier?.$set?.covers[0]
				if(modifier?.$set?.category)
					categories = []
					modifier.$set.category.forEach (category)->
						product_category = Creator.getCollection("vip_product_category").findOne(category,{fields:{parent:1}})
						if product_category.parent
							parents = []
							parents = _.union(parents,calculateParents(product_category.parent))
							categories = _.union(categories, parents)
					modifier.$set['categories'] = _.union(categories,modifier.$set.category)
					Creator.getCollection("vip_product").direct.update(doc._id,{$set:{categories:_.union(categories,modifier.$set.category)}})