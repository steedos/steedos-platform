Creator.Objects.billing_record =
    name: "billing_record"
    label: "微信订单"
    icon: "apps"
    fields:
        paid:
            label: "付款状态"
            type: "boolean"
            omit: true
            hidden: true

        weixin_info:
            label: "订单信息"
            type: "object"
            blackbox: true
            omit: true
            hidden: true

        total_fee:
            label: "金额"
            type: "number"
            omit: true
            hidden: true

        order_id:
            label: "订单"
            type: "master_detail"
            reference_to:'vip_order'

        paid_by: # alipay, weixin, bank, cash
            label: '支付方式'
            type: 'text'




