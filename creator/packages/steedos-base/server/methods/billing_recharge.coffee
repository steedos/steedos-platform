Meteor.methods
	billing_recharge: (total_fee, space_id, new_id, module_names, end_date, user_count)->
		check total_fee, Number
		check space_id, String 
		check new_id, String 
		check module_names, Array 
		check end_date, String 
		check user_count, Number 

		user_id = this.userId

		listprices = 0
		order_body = []
		db.modules.find({name: {$in: module_names}}).forEach (m)->
			listprices += m.listprice_rmb
			order_body.push m.name_zh

		space = db.spaces.findOne(space_id)
		if not space.is_paid
			space_user_count = db.space_users.find({space:space_id}).count()
			one_month_yuan = space_user_count * listprices
			if total_fee < one_month_yuan*100
				throw new Meteor.Error 'error!', "充值金额应不少于一个月所需费用：￥#{one_month_yuan}"

		result_obj = {}

		attach = {}
		attach.code_url_id = new_id
		WXPay = Npm.require('weixin-pay')

		wxpay = WXPay({
			appid: Meteor.settings.billing.appid,
			mch_id: Meteor.settings.billing.mch_id,
			partner_key: Meteor.settings.billing.partner_key #微信商户平台API密钥
		})

		wxpay.createUnifiedOrder({
			body: order_body.join(","),
			out_trade_no: moment().format('YYYYMMDDHHmmssSSS'),
			total_fee: total_fee,
			spbill_create_ip: '127.0.0.1',
			notify_url: Meteor.absoluteUrl() + 'api/billing/recharge/notify',
			trade_type: 'NATIVE',
			product_id: moment().format('YYYYMMDDHHmmssSSS'),
			attach: JSON.stringify(attach)
		}, Meteor.bindEnvironment(((err, result) -> 
				if err 
					console.error err.stack
				if result
					obj = {}
					obj._id = new_id
					obj.created = new Date
					obj.info = result
					obj.total_fee = total_fee
					obj.created_by = user_id
					obj.space = space_id
					obj.paid = false
					obj.modules = module_names
					obj.end_date = end_date
					obj.user_count = user_count
					db.billing_pay_records.insert(obj)
			), ()->
				console.log 'Failed to bind environment'
			)
		)

		
		return "success"