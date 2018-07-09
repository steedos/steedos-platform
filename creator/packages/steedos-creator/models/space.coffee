Creator.Objects.spaces =
	name: "spaces"
	label: "工作区"
	icon: "groups"
	fields:
		name:
			label: "名称"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			index:true
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
		owner:
			label: "所有者"
			type: "lookup"
			reference_to: "users"
			disabled: true
			omit: false
		admins:
			label: "管理员"
			type: "lookup"
			reference_to: "users"
			multiple: true
		apps:
			label: "应用"
			type: "lookup"
			reference_to: "apps"
			multiple: true
		avatar:
			label:'头像'
			type:'image'
		cover:
			label:'封面照片'
			type:'image'
		location:
			label:'地址'
			type:'location'
			system: 'gcj02'
		phone:
			label:'联系电话'
			type:'text'
	list_views:
		all:
			label:"所有"
			columns: ["name"]
			filter_scope: "all"
			filters: [["_id", "=", "{spaceId}"]]
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		member:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true