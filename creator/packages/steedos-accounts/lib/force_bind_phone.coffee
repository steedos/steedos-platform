if Meteor.settings?.public?.phone?.forceAccountBindPhone
	if Meteor.isServer
		Meteor.methods
			checkForceBindPhone: (spaces) ->
				check spaces, Array
				space_settings = db.space_settings.find({key:"contacts_no_force_phone_users",space: {$in: spaces}})
				noForceUsers = []
				space_settings.forEach (n,i)->
					if n.values?.length
						noForceUsers = _.union noForceUsers, n.values
				if noForceUsers and noForceUsers.length
					return if noForceUsers.indexOf(Meteor.userId()) > -1 then false else true
				return true

	if Meteor.isClient
		Steedos.isForceBindPhone = false
		checkPhoneStateExpired = ->
			# 过期后把绑定状态还原为未绑定
			expiredDays = Meteor.settings?.public?.phone?.expiredDays
			if expiredDays
				Accounts.disablePhoneWithoutExpiredDays(expiredDays)
		
		unless Steedos.isMobile()
			Accounts.onLogin ()->
				if Accounts.isPhoneVerified()
					checkPhoneStateExpired()
					return
				Meteor.setTimeout ()->
					if Accounts.isPhoneVerified()
						checkPhoneStateExpired()
						return
					spaces = db.spaces.find().fetch().getProperty("_id")
					unless spaces.length
						return
					Meteor.call "checkForceBindPhone", spaces, (error, results)->
						if error
							toastr.error(t(error.reason))
						else
							Steedos.isForceBindPhone = results
						if Steedos.isForceBindPhone and !Accounts.isPhoneVerified()
							# 未验证手机号时，强行跳转到手机号绑定界面
							setupUrl = "/accounts/setup/phone"
							Steedos.isForceBindPhone = false
							# 暂时先停掉手机号强制绑定功能，等国际化相关功能完成后再放开
							# qhd要求放开，CN发版本前要把国际化相关功能完成，否则CN发版本前还是要注释掉该功能
							FlowRouter.go setupUrl
							return

						routerPath = FlowRouter.current()?.path
						# 当前路由本身就在手机验证路由中则不需要提醒手机号未绑定
						if /^\/accounts\/setup\/phone\b/.test routerPath
							return
						# 登录相关路由不需要提醒手机号未绑定
						if /^\/steedos\//.test routerPath
							return
						if Accounts.isPhoneVerified()
							checkPhoneStateExpired()
						else
							setupUrl = Steedos.absoluteUrl("accounts/setup/phone")
							unless Steedos.isForceBindPhone
								toastr.error(null,t("accounts_phone_toastr_alert"),{
									closeButton: true,
									timeOut: 0,
									extendedTimeOut: 0,
									onclick: ->
										Steedos.openWindow(setupUrl,'setup_phone')
								})
				, 200