Creator.Objects.vip_billing =
	name: "vip_billing"
	label: "消费记录"
	icon: "apps"
	fields:
        bill_money:
            label:'消费金额'
            type:'number'
            omit:true
        #时间可以用modified
        # bill_time:
        #     label:'时间'
        #     type:'datetime'
        #     omit:true
        bill_location:
            label:'grid'
            type:'text'
            omit:true
        bill_location.$.longitude:
            type:'text'
            label:'经度'
            omit:true
        bill_location.$.latitude:
            type:'text'
            label:'纬度'
            omit:true
        bill_store:
            label:'门店'
            type:'lookup'
            reference_to:'vip_store'
            omit:true
        bill_card:
            label:'会员卡'
            type:'lookup'
            reference_to:'vip_card'
            omit:true
        bill_description:
            label:'备注'
            type:'textarea'
