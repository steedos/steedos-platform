Creator.Objects.post_star =
	name: "post_star"
	label: "收藏"
	icon: "apps"
	fields:
        post_id:
            label:'收藏对象'
            type:'lookup'
            reference_to:'post'
