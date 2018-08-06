Creator.Objects.love_result =
	name: "love_result"
	label: "计算结果"
	icon: "event"
	enable_search: true
	fields:
		userA:
			type:'text'
			label:"用户"
			index:true

		scoreA_B:
			type:'[Object]'
			label:"我喜欢的"
		"scoreA_B.$.userB":
			type: "text"
			label:'我喜欢的'
		"scoreA_B.$.BName":
			type: "text"
			label:'他(她)的名字'
		"scoreA_B.$.score":
			label: "匹配度"
			type: "number"
			scale: 2

		scoreB_A:
			type:'[Object]'
			label:"喜欢我的"
		"scoreB_A.$.userB":
			type: "text"
			label:'喜欢我的'
		"scoreB_A.$.BName":
			type: "text"
			label:'他(她)的名字'
		"scoreB_A.$.score":
			label: "匹配度"
			type: "number"
			scale: 2

		score:
			type:'[Object]'
			label:"最适合我的"
		"score.$.userB":
			type: "text"
			label:'最适合我的'
		"score.$.BName":
			type: "text"
			label:'他(她)的名字'
		"score.$.score":
			label: "匹配度"
			type: "number"
			scale: 2
			index: true

		result:
			type:'[Object]'
			label:"匹配的人"
		"result.$.user":
			type: "text"
			label:'匹配的人'
		"result.$.name":
			type: "text"
			label:'他(她)的名字'
		"result.$.score":
			label: "匹配度"
			type: "number"
			scale: 2
		"result.$.comment":
			label: "评论"
			type: "text"
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		member:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
