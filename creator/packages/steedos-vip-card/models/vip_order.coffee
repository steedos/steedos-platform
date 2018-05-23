Creator.Objects.vip_order =
	name: "vip_order"
	label: "订单"
	icon: "order"
	fields:
        customer_name:
            label:'顾客姓名'
            type:'text'
        customer_phone:
            label:'顾客联系方式'
            type:'text'
        merchandise:
            label:'商品'
            type:'lookup'
            reference_to:'merchant'