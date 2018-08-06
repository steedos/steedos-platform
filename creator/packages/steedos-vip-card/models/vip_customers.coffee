Creator.Objects.vip_customers =
	name: "vip_customers"
	label: "客户"
	icon: "person_account"
	fields:
		name:
			label: '姓名'
			type: 'text'

		from:
			label: '推荐人'
			type: 'lookup'
			reference_to: 'users'

		space:
			label: '商户'

		owner:
			label: '客户'

		mobile:
			type: "text"
			label:'手机'

		is_member:
			label: '是否会员'
			type: "boolean"

		member_expried:
			label: '会员过期时间'
			type: "datetime"

		invite_code:
			label: '邀请码'
			type: "text"

		share:
			label: '分享ID'
			type: 'lookup'
			reference_to: 'vip_share'

		balance:
			label: "余额"
			type: "number"
			defaultValue: 0
			scale: 2

		cash_back_total:
			label: "累计返现"
			type: "number"
			defaultValue: 0
			scale: 2

		cash_back_percentage:
			label:'返现比例'
			type:'number'
			scale: 2

		cash_back_expired:
			label:"返现有效期"
			type:'datetime'

		questionnaire_progess: # 1:about_me, 2:about_you, 3:questions, 4:completed
			label: '问卷回答进度'
			type: 'number'
			index:true
		disable:
			label: '停用'
			type: 'text'
			omit:true

	list_views:
		all:
			label: "所有"
			columns: ["name","share","created"]
			filter_scope: "space"
	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true

	triggers:
		"before.insert.server.vip_customers":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				share_id = doc?.share
				space_id = doc?.space
				share_id = doc?.share
				space_id = doc?.space
				customer = Creator.getCollection("vip_customers").findOne({space: space_id, owner: userId});
				if customer
					throw new Meteor.Error 405, "同一商家不能重复新建客户"
				if share_id
					store = Creator.getCollection("vip_store").findOne({_id: space_id}, {fields: {cash_back_enabled:1,cash_back_percentage:1,cash_back_period:1}})
					if(store and store.cash_back_enabled)
						period = store.cash_back_period
						unless period
							period = 90
						expired = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * period)
						doc.cash_back_expired = expired
						doc.cash_back_percentage = store.cash_back_percentage

		"before.update.server.vip_customers":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if not doc.invite_code and modifier.$set and modifier.$set.invite_code
					modifier.$set.is_member = true
					modifier.$set.member_expried = new Date(new Date().getTime() + 365*24*3600*1000)
