Creator.Objects.vip_category =
	name: "vip_category"
	label: "卡项"
	icon: "apps"
	fields:
		name:
			label:'名称'
			type:'text'
			required:true
		category:
			label:'类别'
			type:'select'
			options:[
				{label:'次卡',value:'次卡'},
				{label:'折扣卡',value:'折扣卡'},
				{label:'充值卡',value:'充值卡'},
			]
			required:true
		price:
			label:'售价'
			type:'currency'
			required:true
		content:
			label:'内容'
			type:'grid'
			required:true
		"content.$.name":
			label:'服务/产品名称'
			#type:'lookup'
			#reference_to:,此处应该关联商家提供的服务和产品
		"content.$.count":
			label:'次数或件数'
			type:'number'
		discount:
			label:'折扣'
			type:'number'
		recharge_amount:
			label:'充值金额'
			type:'currency'
		present_amount:
			label:'赠送金额'
			type:'currency'
		handsel:
			label:'购卡赠送'
			type:'grid'
		"handsel.$.name":
			label:'服务/产品名称'
			#type:'lookup'
			#reference_to:,此处应该关联商家提供的服务和产品
		"handsel.$.count":
			label:'次数或件数'
			type:'number'        
		count:
			label:'可用次数'
			type:'number'
		start_time:
			label:'开始时间'
			type:'datetime'
		end_date:
			label:'截止时间'
			type:'datetime'
		state:
			label:'状态'
			type:'select'
			options:[
				{label:'未上架',value:'未上架'},
				{label:'上架中',value:'上架中'},
				{label:'已上架',value:'已上架'},
				{label:'已下架',value:'已下架'}
			]
		purchase_count:
			label:'开卡总数'
			type:'number'
		description:
			label:'说明'
			type:'textarea'    
	list_views:
		all:
			label: "全部"
			filter_scope: "space"
			columns: ["name", "content", "purchase_count","state"]
			