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
		store:
			label:'门店'
			type:'lookup'
			reference_to:'vip_store'
			required: true

		card:
			label:'会员卡'
			type:'master_detail'
			reference_to:'vip_card'

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
				if modifier.$set?.status is 'completed' and this.previous.status isnt 'completed'
					if doc.type is 'recharge'
						console.log 'recharge'
						amount = doc.amount
						cardId = doc.card
						point = parseInt(doc.amount)
						if doc.is_actived
							Creator.getCollection('vip_card').update({ _id: cardId }, { $inc: { balance: amount, points: point } })
						else
							Creator.getCollection('vip_card').update({ _id: cardId }, { $inc: { balance: amount, points: point }, $set: { is_actived: true } })
							#用户没有已经加入商户工作区时，先加入
							space_user = Creator.getCollection("space_users").findOne({user: doc.owner, space: doc.space}, {fields: {_id: 1}})
							if !space_user
								u = Meteor.users.findOne(doc.owner, { fields: { name: 1 } })
								WXMini.addUserToSpace(doc.owner, doc.space, u.name, "member")

						newestCard = Creator.getCollection('vip_card').findOne(cardId, { fields: { balance: 1 } })
						Creator.getCollection('vip_billing').insert({
							amount: amount
							store: doc.store
							card: cardId
							description: doc.name
							owner: doc.owner
							space: doc.space
							balance: newestCard.balance
						})
					else if doc.type is 'pay'
						console.log 'pay'
						point = parseInt(doc.amount)
						if point > 0
							Creator.getCollection('vip_card').update({ _id: doc.card }, { $inc: { points: point } })