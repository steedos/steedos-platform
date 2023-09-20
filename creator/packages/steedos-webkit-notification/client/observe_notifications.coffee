Steedos.pushSpace = new SubsManager();

Steedos.isElectron = ()->
	# mac上华信客户端nw为空造成Steedos.isElectron函数目前返回结果不对 #1487
	return Steedos.isNode() && nw.ipcRenderer

Steedos.isNewWindow = ()->
	if Steedos.isNode()
		if Steedos.isElectron() && window.opener
			# 新版本客户端
			return true
		else if window.opener and window.opener.opener
			# 老版本客户端
			# window.opener.opener不为空说明是新窗口，用两层opener是因为主窗口本来就有一层opener
			return true
	else if (window.opener)
		return true;

Tracker.autorun (c)->
	# Steedos.pushSpace.reset();
	Steedos.pushSpace.subscribe("raix_push_notifications");

if !Steedos.isMobile()
	Steedos.Push = require("push.js");

Steedos.playNodeBadge =  (badgeCount)->
	if Steedos.isNode()
		# 新版客户端
		if (nw.ipcRenderer)
			unless badgeCount
				badgeCount = 0
			nw.ipcRenderer.sendToHost('onBadgeChange', false, 0, badgeCount, false, false)
		else
			# 任务栏高亮显示
			nw.Window.get().requestAttention(3);

Meteor.startup ->
	if !Steedos.isMobile()
		if Push.debug
			console.log("init notification observeChanges")

		query = db.raix_push_notifications.find();
		#发起获取发送通知权限请求
		onRequestSuccess = ()->
			console.log("Request push permission success.")
		onRequestFailed = ()->
			console.log("Request push permission failed.")
		Steedos.Push.Permission.request(onRequestSuccess, onRequestFailed);

		handle = query.observeChanges(added: (id, notification) ->
			console.log(notification)

			# 非主窗口不弹推送消息
			# 为解决老客户端跑workflow/creator项目需要写window.opener.opener两层的判断，调用isNewWindow函数
			if Steedos.isNewWindow()
				return;
			
			options = 
				iconUrl: ''
				title: notification.title
				body: notification.text
				timeout: 15 * 1000
				onClick: (event) ->
					console.log(event)
					if (event.target.tag)
						if (event.target.tag.startsWith("/api/v4/notifications") || event.target.tag.startsWith("/api/workflow/instance/"))
							Steedos.openWindow(event.target.tag)
						else
							FlowRouter.go(event.target.tag)
					window.focus();
					this.close();
					return;
			
			if notification.payload
				if notification.payload.requireInteraction
					options.requireInteraction = notification.payload.requireInteraction
					delete options.timeout

				if notification.payload.notifications_id
					options.tag = "/api/v4/notifications/" + notification.payload.notifications_id + "/read"
				if notification.payload.app == "calendar"
					options.tag = "/calendar/inbox"
				if notification.payload.instance
					options.tag = "/api/workflow/instance/" + notification.payload.instance
			
			if options.title
				Steedos.Push.create(options.title, options);

			# add sound
			msg = new Audio("/sound/notification.mp3")
			msg.play();

			Steedos.playNodeBadge(notification.badge)
			return;
		)
	else

		if Push.debug
			console.log("add addListener")

		Push.onNotification = (data) ->
			box = 'inbox'# inbox、outbox、draft、pending、completed
			if data && data.payload
				if data.payload.space and data.payload.instance
					instance_url = '/workflow/space/' + data.payload.space + '/' + box + '/' + data.payload.instance
					# 执行下面的代码会有BUG:会把下一步骤处理人的手机APP强行跳转到待审核相应单子。见：手机app申请人提交申请单，下一步处理人恰好审批王处于打开状态时，下一步处理人的ios app会刷新 #1018
					# window.open instance_url
			return

		#后台运行时，点击推送消息
		Push.addListener 'startup', (data) ->
			if Push.debug
				console.log 'Push.Startup: Got message while app was closed/in background:', data
			Push.onNotification data

		#关闭进程时，点击推送消息
		Push.addListener 'message', (data) ->
			if Push.debug
				console.log 'Push.Message: Got message while app is open:', data
			Push.onNotification data
			return