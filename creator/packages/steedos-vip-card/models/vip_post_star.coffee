Creator.Objects.vip_star =
	name: "vip_star"
	label: "收藏"
	icon: "apps"
	fields:
        post_id:
            label:'收藏对象'
            type:'lookup'
            reference_to:'vip_post'
        is_cancel:
            label:'是否取消'
            defaultValue:false
