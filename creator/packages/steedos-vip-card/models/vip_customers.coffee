Creator.Objects.vip_customers =
	name: "vip_customers"
	label: "客户"
	icon: "client"
	fields:
		name:
			label: '姓名'
			type: 'text'
			group:'-'

		from:
			label: '推荐人'
			type: 'lookup'
			reference_to: 'users'
			omit: true

		froms:
			label: '推荐人历史'
			type: 'lookup'
			reference_to: 'users'
			multiple: true
			omit: true

		space:
			label: '商户'
			omit: true
			omit: true

		owner:
			label: '客户'
			omit: true

		is_member:
			label: '是否会员'
			type: "boolean"
			omit: true

		member_expried:
			label: '会员过期时间'
			type: "datetime"
			omit: true

		invite_code:
			label: '邀请码'
			type: "text"
			omit: true

		share:
			label: '分享ID'
			type: 'lookup'
			reference_to: 'vip_share'
			omit: true

		balance:
			label: "余额"
			type: "number"
			defaultValue: 0
			scale: 2
			omit: true

		cash_back_total:
			label: "累计返现"
			type: "number"
			defaultValue: 0
			scale: 2
			omit: true

		cash_back_percentage:
			label:'返现比例'
			type:'number'
			scale: 2
			omit: true

		cash_back_expired:
			label:"返现有效期"
			type:'datetime'
			omit: true

		questionnaire_progess: # 1:about_me, 2:about_you, 3:questions, 4:completed
			label: '问卷回答进度'
			type: '[text]'
			omit: true


		# cover:
		# 	label:'封面'
		# 	type:'image'


		enable_match:
			label: '开启匹配'
			type: "boolean"
			omit: true

		disable:
			label: '停用'
			type: 'text'
			omit:true

		privacy_protection:
			label: '隐私保护'
			type: 'select'
			multiple:true
			options: "姓名:name,身高:height,年龄:age,现居地:live,家乡:hometown,照片:photos,,兴趣爱好:love_hobby,教育经历:love_educational_experience" #工作经历:love_work_experience
			omit: true

		matching_filter_caculate_time:
			label: '计算是否满足筛选条件的时间'
			type: 'datetime'
			omit: true

		recommend_count_every_day:
			label: '每天可推荐的次数'
			type: 'number'
			defaultValue: 3
			omit:true

		love_test_tags:
			label: '缘分卷测试小结'
			type: '[text]'
			omit: true

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
				if userId
					# userId存在说明是前端新建记录，需要判断重复，反之，后台调用不用判断
					customer = Creator.getCollection("vip_customers").findOne({space: space_id, owner: userId}, fields:{name:1});
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

		"after.update.server.vip_customers":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				qp = doc.questionnaire_progess
				preQP = this.previous.questionnaire_progess
				if _.difference(qp, preQP).includes('love_test') and doc.from
					if doc.recommend_count_every_day < 10
						Creator.getCollection('vip_customers').update({ space: doc.space, owner: doc.from }, { $inc: { recommend_count_every_day: 1 } })
