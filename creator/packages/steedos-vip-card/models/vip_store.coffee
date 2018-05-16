Creator.Objects.vip_store =
	name: "vip_store"
	label: "门店"
	icon: "apps"
	fields:
        store_name:
            label:'店名'
            type:'text'
            omit:true
        store_location:
            label:'grid'
            type:'text'
            omit:true
        store_location.$.longitude:
            type:'text'
            label:'经度'
            omit:true
        store_location.$.latitude:
            type:'text'
            label:'纬度'
            omit:true
        store_business:
            type:'text'
            label:'行业'
            omit:true
        store_principal:
            type:'text'
            label:'负责人'
            omit:true
        store_phone:
            type:'text'
            label:'联系电话'
            omit:true
