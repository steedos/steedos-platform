import WXPay from '../lib/wxpay.js'

JsonRoutes.add 'post', '/api/billing/recharge', (req, res, next) ->
    try
        current_user_info = payManager.check_authorization(req.res)
        user_id = current_user_info._id

        body = req.body

        data = {}
        check total_fee, Number
        check space_id, String

        listprices = 0
        order_body = '会员充值'

        attach = {}
        attach.record_id = Creator.getCollection('billing_record')._makeNewID()

        wxpay = WXPay({
            appid: Meteor.settings.billing.appid,
            mch_id: Meteor.settings.billing.mch_id,
            partner_key: Meteor.settings.billing.partner_key #微信商户平台API密钥
        })

        result = wxpay.createUnifiedOrder({
            body: order_body,
            out_trade_no: moment().format('YYYYMMDDHHmmssSSS'),
            total_fee: total_fee,
            spbill_create_ip: '127.0.0.1',
            notify_url: Meteor.absoluteUrl() + 'api/billing/recharge/notify',
            trade_type: 'JSAPI', # 小程序取值如下：JSAPI
            product_id: moment().format('YYYYMMDDHHmmssSSS'),
            attach: JSON.stringify(attach),
            sub_appid: '?',
            sub_mch_id: '?',
            openid: '?',
            sub_openid: '?'
        })

        obj = {
            _id: attach.record_id
            paid: false
            info: result
        }

        Creator.getCollection('billing_record').insert(obj)

        JsonRoutes.sendResult res,
            code: 200
            data: data
    catch e
        console.error e.stack
        JsonRoutes.sendResult res,
            code: 200
            data: { errors: [ { errorMessage: e.message } ] }

