Meteor.methods
	setSpaceUserPassword: (space_user_id, space_id, password) ->
		if !this.userId
			throw new Meteor.Error(400, "请先登录")

		spaceUser = db.space_users.findOne({_id: space_user_id, space: space_id})
		user_id = spaceUser.user;
		userCP = db.users.findOne({_id: user_id})
		currentUser = db.users.findOne({_id: this.userId})

		if spaceUser.invite_state == "pending" or spaceUser.invite_state == "refused"
			throw new Meteor.Error(400, "该用户尚未同意加入该工作区，无法修改密码")

		Steedos.validatePassword(password)

		Accounts.setPassword(user_id, password, {logout: true})

		# 如果用户手机号通过验证，就发短信提醒
		if userCP.mobile
			lang = 'en'
			if userCP.locale is 'zh-cn'
				lang = 'zh-CN'
			SMSQueue.send
				Format: 'JSON',
				Action: 'SingleSendSms',
				ParamString: '',
				RecNum: userCP.mobile,
				SignName: '华炎办公',
				TemplateCode: 'SMS_67200967',
				msg: TAPi18n.__('sms.change_password.template', {name:currentUser.name}, lang)

