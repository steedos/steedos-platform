Creator.Objects.billing_record =
    name: "billing_record"
    label: "订单"
    icon: "apps"
    fields:
        paid:
            label: "付款状态"
            type: "boolean"
            omit: true
            hidden: true

        info:
            label: "订单信息"
            type: "object"
            blackbox: true
            omit: true
            hidden: true



