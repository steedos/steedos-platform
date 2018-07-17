import WXPay from '../lib/wxpay.js'
import util from '../lib/util.js'

JsonRoutes.add 'post', '/api/steedos/weixin/card/recharge', (req, res, next) ->
    try
        current_user_info = payManager.check_authorization(req, res)
        user_id = current_user_info._id

        body = req.body
        amount = body.amount
        order_id = body.order_id

        sub_appid = req.headers['appid']

        check amount, Number
        check order_id, String
        check sub_appid, String

        order = Creator.getCollection('vip_order').findOne(order_id, { fields: { space: 1, store: 1, amount: 1, amount_paid: 1, name: 1, out_trade_no: 1 } })

        if not order
            throw new Meteor.Error('error', "未找到订单")

        store = Creator.getCollection('vip_store').findOne(order.store, { fields: { mch_id: 1 } })

        if  amount > (order.amount - order.amount_paid)
            throw new Meteor.Error('error', "付款金额超出剩余应付款金额")

        if not store
            throw new Meteor.Error('error', "未找到门店")

        # sub_mch_id = '1504795791'
        sub_mch_id = store.mch_id # 由于此字段非必填，所以当此字段值为空时 支付到steedos
        console.log 'sub_mch_id: ', sub_mch_id

        returnData = {}

        order_body = order.name || '消费'

        attach = {}
        attach.record_id = Creator.getCollection('billing_record')._makeNewID()
        attach.sub_mch_id = sub_mch_id

        sub_openid = ''
        current_user_info.services.weixin.openid.forEach (o) ->
            if not sub_openid and o.appid is sub_appid
                sub_openid = o._id

        totalFee = parseInt(amount*100)
        out_trade_no = order.out_trade_no + Creator.getCollection('billing_record').find({ order_id: order_id }).count()
        orderData = {
            body: order_body,
            out_trade_no: out_trade_no,
            total_fee: totalFee,
            spbill_create_ip: '127.0.0.1',
            notify_url: Meteor.absoluteUrl() + 'api/steedos/weixin/card/recharge/notify',
            trade_type: 'JSAPI', # 小程序取值如下：JSAPI
            attach: JSON.stringify(attach)
        }

        if _.isEmpty(sub_mch_id)
            # 支付给普通商户
            wxpay = WXPay({
                appid: sub_appid, # 小程序ID
                mch_id: Meteor.settings.billing.normal_mch.mch_id,
                partner_key: Meteor.settings.billing.normal_mch.partner_key #微信商户平台API密钥
            })
            orderData.openid = sub_openid
        else
            # 支付给特约商户
            wxpay = WXPay({
                appid: Meteor.settings.billing.service_mch.appid, # 公众号ID
                mch_id: Meteor.settings.billing.service_mch.mch_id,
                partner_key: Meteor.settings.billing.service_mch.partner_key #微信商户平台API密钥
            })
            orderData.sub_appid = sub_appid
            orderData.sub_mch_id = sub_mch_id
            orderData.sub_openid = sub_openid

        result = wxpay.createUnifiedOrder(orderData, Meteor.bindEnvironment(((err, result) ->
                if err
                    console.error err.stack
                if result and result.return_code is 'SUCCESS' and result.result_code is 'SUCCESS'
                    obj = {
                        _id: attach.record_id
                        paid: false
                        weixin_info: result
                        total_fee: totalFee
                        owner: user_id
                        space: order.space
                        order_id: order_id
                        out_trade_no: out_trade_no
                    }

                    Creator.getCollection('billing_record').insert(obj)

                    Creator.getCollection('vip_order').update({ _id: order_id }, { $set: { status: 'pending' } })

                    returnData.timeStamp = Math.floor(Date.now() / 1000) + ""
                    returnData.nonceStr = util.generateNonceString()
                    returnData.package = "prepay_id=#{result.prepay_id}"
                    returnData.paySign = wxpay.sign({
                        appId: sub_appid
                        timeStamp: returnData.timeStamp
                        nonceStr: returnData.nonceStr
                        package: returnData.package
                        signType: 'MD5'
                    })
                else
                    console.error result
            ), ()->
                console.log 'Failed to bind environment'
            )
        )

        JsonRoutes.sendResult res,
            code: 200
            data: returnData
    catch e
        console.error e.stack
        JsonRoutes.sendResult res,
            code: 200
            data: { errors: [ { errorMessage: e.message } ] }

