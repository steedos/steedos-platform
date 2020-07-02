Creator.Objects.vip_settings =
	name: "vip_settings"
	label: "设置"
	icon: "apps"
	fields:
        industry:
            label: "行业"
            type: "select"
            options:[
                {label:'餐饮',value:'food'},
                {label:'酒店住宿',value:'accommodation'},
                {label:'出行',value:'travel'},
                {label:'休闲娱乐',value:'entertainment'},
                {label:'丽人',value:'beauty'},
                {label:'教育',value:'education'},
                {label:'母婴亲子',value:'parent-child'},
                {label:'运动健身',value:'sport'},
                {label:'家具装修',value:'decoration'},
                {label:'生活服务',value:'life'},
                {label:'宠物',value:'pets'},
                {label:'汽车服务',value:'car'}
            ]
        stores:
            label:'门店'
            type:'master_detail'
            reference_to:'vip_store'
            multiple:true