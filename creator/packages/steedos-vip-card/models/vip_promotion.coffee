Creator.Objects.vip_promotion =
	name: "vip_promotion"
	label: "优惠活动"
	icon: "apps"
    enable_files:true
	fields:
        name:
            label:'名称'
            type:'text'
            required:true
        descripton:
            label:'详情'
            type:'textarea'
        start_time:
            label:'开始时间'
            type:'datetime'
        end_time:
            label:'截止时间'
            type:'datetime'