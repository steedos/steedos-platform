Steedos.pushSpace = new SubsManager();

Tracker.autorun (c)->
    # Steedos.pushSpace.reset();
    Steedos.pushSpace.subscribe("raix_push_notifications");

Meteor.startup ->
    if !Steedos.isMobile()
        Steedos.Push = require("push.js");
        
        if Push.debug
            console.log("init notification observeChanges")

        query = db.raix_push_notifications.find();
        #发起获取发送通知权限请求
        Steedos.Push.Permission.request();

        handle = query.observeChanges(added: (id, notification) ->
            console.log(notification)

            # 非主窗口不弹推送消息
            if (window.opener)
                return;
            
            options = 
                iconUrl: ''
                title: notification.title
                body: notification.text
                timeout: 15 * 1000
                onClick: (event) ->
                    console.log(event)
                    if (event.target.tag)
                        FlowRouter.go(event.target.tag)
                    window.focus();
                    this.close();
                    return;

            if notification.payload

                if notification.payload.requireInteraction
                    options.requireInteraction = payload.requireInteraction

                if notification.payload.app == "calendar"
                    options.tag = "/calendar/inbox"
                if notification.payload.instance
                    options.tag = "/workflow/space/" + notification.payload.space + "/inbox/" + notification.payload.instance
            
            if options.title
                Steedos.Push.create(options.title, options);

            if Steedos.isNode()
                # 新版客户端
                if (nw.ipcRenderer)
                    if notification.badge != undefined
                        nw.ipcRenderer.sendToHost('onBadgeChange', false, 0, notification.badge, false, false)
                else
                    # 任务栏高亮显示
                    nw.Window.get().requestAttention(3);

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