Creator.Objects.vip_order =
	name: "vip_order"
	label: "订单"
	icon: "orders"
	fields:
		name:
			label: "名称"
			type: "text"
			required: true

		out_trade_no:
			label: "订单编号"
			type: "text"
			omit:true
		owner:
			label: '顾客'
			type: 'lookup'
			required: true
			reference_to:'users'

		product_amount:
			label: '商品金额'
			type: 'number'
			scale: 2
			defaultValue: 0
		deliver_amount:
			label: '运费'
			type: 'number'
			scale: 2
			defaultValue: 0
		discount_amount:
			label: '优惠金额'
			type: 'number'
			scale: 2
			defaultValue: 0
		# card_amount:
		# 	label: '会员卡支付金额'
		# 	type: 'number'
		# 	scale: 2
		# 	defaultValue: 0
		amount:
			label: '应付金额'
			type: 'number'
			scale: 2
			defaultValue: 0
			required: true
		amount_paid:
			label: '已付金额'
			type: 'number'
			scale: 2
			defaultValue: 0
		paid_by: # alipay, weixin, bank, cash, card
			label: '支付方式'
			type: 'text'

		card_balance:
			label: '卡内余额'
			type: 'number'
			scale: 2
			defaultValue: 0
		store_balance:
			label: '门店余额'
			type: 'number'
			scale: 2
			defaultValue: 0

		description:
			label: '描述'
			type: 'textarea'
			is_wide:true

		status: # draft购物车, pending待付款, paid待发货，delivered待收货，completed已完成， canceled已取消
			label: '状态'
			type: 'select'
			defaultValue: 'draft'
			options:[
				{label:'购物车',value:'draft'},
				{label:'待付款',value:'pending'},
				{label:'待发货',value:'paid'},
				{label:'待收货',value:'delivered'},
				{label:'已完成',value:'completed'},
				{label:'已取消',value:'canceled'}]
			omit:true
			index:true
		store:
			label:'门店'
			type:'lookup'
			reference_to:'vip_store'
			required: true

		card:
			label:'会员卡'
			type:'master_detail'
			reference_to:'vip_card'
			index:true
		card_rule:
			label:'卡项'
			type:'master_detail'
			reference_to:'vip_card_rule'

		# type: # recharge, pay, ...
		# 	label: '类型'
		# 	type: 'text'
		# 	omit:true
		products:
			label: "商品"
			type: "grid"
		"products.$._id":
			label: "编号"
			type:'text'
		"products.$.name":
			label: "名称"
			type:'text'
		"products.$.default_price":
			label: "单价"
			type: "number"
			scale: 2
		"products.$.count":
			label: "数量"
			type: "number"
		"products.$.avatar":
			label: "头像"
			type:'image'
		"products.$.sum":
			label: "总价"
			type: "number"
			scale: 2
		address:
			label:'收货地址'
			type: "object"
			is_wide:true
			blackbox:true
		invoice_info:
			label:'开票信息'
			type: "object"
			blackbox:true
		invoice_type:
			label:'开票类型'
			type: "text"
			#null,普票，增票
		invoice_detail:
			label:'开票内容'
			type: "text"
		deliver_company:
			label:'快递公司'
			type: "text"
		deliver_no:
			label:'快递单号'
			type: "text"
		deliver_date:
			label:'发货时间'
			type:'datetime'
		expect_deliver_date:
			label:'期望配送日期'
			type:'date'
		comment:
			label:'留言'
			type: "textarea"
			is_wide:true
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false

	list_views:
		all:
			label: "所有"
			columns: ["name","owner", "amount_paid", "description"]
			filter_scope: "space"
		draft:
			label:"购物车"
			columns:["name","owner", "amount", "products"]
			filter_scope: "space"
			filters: [["status", "=", "draft"]]
		pending:
			label:"待付款"
			columns:["name", "owner", "amount", "products"]
			filter_scope: "space"
			filters: [["status", "=", "pending"]]
		paid:
			label:"待发货"
			columns:["name","owner", "amount", "products", "description"]
			filter_scope: "space"
			filters: [["status", "=", "paid"]]
		delivered:
			label:"待收货"
			columns:["name", "owner", "amount", "amount_paid", "address"]
			filter_scope: "space"
			filters: [["status", "=", "delivered"]]
		completed:
			label:"已完成"
			columns:["name","owner", "amount", "products"]
			filter_scope: "space"
			filters: [["status", "=", "completed"]]
		canceled:
			label:"已取消"
			columns:["name","owner", "amount", "products"]
			filter_scope: "space"
			filters: [["status", "=", "canceled"]]
	triggers:
		"before.insert.server.vip_order":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				doc.out_trade_no = moment().format('YYYYMMDDHHmmssSSS') + '001'

		"after.update.server.vip_order":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier.$set?.status is 'paid' and this.previous.status isnt 'paid'
					if doc.card_rule
						amount = doc.amount_paid
						cardId = doc.card
						point = parseInt(doc.amount_paid)
						Creator.getCollection('vip_card').update({ _id: cardId }, { $inc: { balance: amount, points: point }, $set: { is_actived: true } })

				if modifier.$set?.status is 'completed' and this.previous.status isnt 'completed'
					customer = Creator.getCollection('vip_customers').findOne({ space: doc.space, owner: doc.owner })
					if customer and customer.from and customer.share and customer.cash_back_percentage and customer.cash_back_expired
						if customer.cash_back_expired > new Date()
							cashBack = doc.amount_paid*customer.cash_back_percentage
							Creator.getCollection('vip_share_gift').insert({
								name: '转发返现'
								share: customer.share
								order: doc._id
								amount: cashBack
								owner: customer.from
								space: doc.space
							})
							Creator.getCollection('vip_customers').update({ space: doc.space, owner: customer.from }, { $inc: { balance: cashBack } })

	methods:
		# 可通过this获取到object_name, record_id, space_id, user_id; params为request的body
		confirmReceipt: (params) ->
			Creator.getCollection('vip_order').update({ _id: this.record_id, owner: this.user_id, status: 'delivered' },
				{$set: { status: 'completed' } })
			return true
		cancelOrder: (params) ->
			Creator.getCollection('vip_order').update({ _id: this.record_id, owner: this.user_id, status: 'pending' },
				{$set: { status: 'canceled' } })
			return true