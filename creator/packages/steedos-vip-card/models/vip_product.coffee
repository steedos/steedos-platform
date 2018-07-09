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
		description:
			label:'商品描述'
			type:'textarea'
			is_wide:true
		
		default_price:
			label:'现价'
			type:'number'
			required:true
			scale: 2
			group:'-'
		compared_price:
			label:'原价'
			type:'number'
			scale: 2
		
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
		gift:
			label:'分享赠礼'
			type:'textarea'
			inlineHelpText:'邀请好友成功购买，可获得增礼。'
			group:'-'
		status:
			label:'上架'
			type:'boolean'
			defaultValue:true
			group:'-'
			#草稿，上架，下架
	list_views:
		all:
			label: "所有"
			columns: ["name", "default_price", "compared_price", "avatar", "categories"]
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
		"before.update.server.product":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if(modifier?.$set?.covers)
					modifier.$set['avatar'] = modifier?.$set?.covers[0]