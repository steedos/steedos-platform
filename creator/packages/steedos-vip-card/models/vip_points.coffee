Creator.Objects.vip_points =
	name: "vip_points"
	label: "积分"
	icon: "apps"
	fields:
        point_card:
            label:'会员卡'
            type:'lookup'
            reference_to:'vip_card'
            omit:true
        points:
            label:'积分'
            type:'number'
            omit:true
        point_location:
            label:'地点'
            type:'grid'
            omit:true
        point_location.$.longitude:
            type:'text'
            label:'经度'
            omit:true
        point_location.$.latitude:
            type:'text'
            label:'纬度'
            omit:true
        point_store:
            label:'门店'
            type:'lookup'
            reference_to:'vip_store'
            omit:true
        point_billing:
            label:'消费记录'
            type:'lookup'
            reference_to:'vip_billing'
            omit:true