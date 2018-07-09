import WXPay from '../lib/wxpay.js'

JsonRoutes.add 'post', '/api/steedos/weixin/card/recharge/notify', (req, res, next) ->
	try
		body = ""
		req.on('data', (chunk)->
			body += chunk
		)
		req.on('end', Meteor.bindEnvironment((()->
				xml2js = Npm.require('xml2js')
				parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false })
				parser.parseString(body, (err, result) ->
						# 特别提醒：商户系统对于支付结果通知的内容一定要做签名验证,并校验返回的订单金额是否与商户侧的订单金额一致，防止数据泄漏导致出现“假通知”，造成资金损失
						attach = JSON.parse(result.attach)
						record_id = attach.record_id
						sub_mch_id = attach.sub_mch_id

						if _.isEmpty(sub_mch_id)
							# 支付给普通商户
							wxpay = WXPay({
								appid: Meteor.settings.billing.normal_mch.appid,
								mch_id: Meteor.settings.billing.normal_mch.mch_id,
								partner_key: Meteor.settings.billing.normal_mch.partner_key #微信商户平台API密钥
							})
						else
							# 支付给特约商户
							wxpay = WXPay({
								appid: Meteor.settings.billing.service_mch.appid,
								mch_id: Meteor.settings.billing.service_mch.mch_id,
								partner_key: Meteor.settings.billing.service_mch.partner_key #微信商户平台API密钥
							})

						billRecord = Creator.getCollection('billing_record').findOne(record_id)
						sign = wxpay.sign(_.clone(result))
						if billRecord and billRecord.total_fee is Number(result.total_fee) and sign is result.sign
							Creator.getCollection('billing_record').update({ _id: record_id }, { $set: { paid: true } })
							amount_paid = billRecord.total_fee/100
							order_id = billRecord.order_id
							Creator.getCollection('vip_order').update({ _id: order_id }, { $inc: { amount_paid: amount_paid } })
							order = Creator.getCollection('vip_order').findOne(order_id, { fields: { amount: 1, amount_paid: 1 } })
							if order.amount is order.amount_paid
								Creator.getCollection('vip_order').update({ _id: order_id }, { $set: { status: 'paid' } })

						else
							console.error "recharge notify failed"

				)
			), (err)->
				console.error err.stack
				console.log 'Failed to bind environment'
			)
		)

	catch e
		console.error e.stack

	res.writeHead(200, {'Content-Type': 'application/xml'})
	res.end('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>')

