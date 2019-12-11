var store = ReactSteedos.store; 
var loadNotificationsData = ReactSteedos.loadNotificationsData; 

Creator.subs["CreatorNotifications"] = new SubsManager();

Meteor.startup(function(){
    Meteor.autorun(function(c){
        spaceId = Session.get("spaceId");
        if(spaceId){
            Creator.subs["CreatorNotifications"].subscribe("my_notifications", spaceId);
        }
    });

    Meteor.autorun(function(){
        if(Creator.subs["CreatorNotifications"].ready("my_notifications") && Creator.bootstrapLoaded.get()){
            var spaceId = Steedos.spaceId();
            var userId = Steedos.userId();
            if(spaceId && userId && loadNotificationsData){
                Creator.getCollection("notifications").find({space: spaceId, owner: userId}).fetch();
                store.dispatch(loadNotificationsData({id: "steedos-header-notifications"}))
            }
        }
    });
});

Meteor.startup(function(c){
    if(!Steedos.isMobile()){
        if(Push.debug){
            console.log("init my_notifications observeChanges");
        }
        Meteor.autorun(function(){
            if(Creator.subs["CreatorNotifications"].ready("my_notifications") && Creator.bootstrapLoaded.get()){
                var query = Creator.getCollection("notifications").find();
                // 发起获取发送通知权限请求
                onRequestSuccess = function(){
                    console.log("Request my_notifications push permission success.")
                }
                onRequestFailed = function(){
                    console.log("Request my_notifications push permission failed.")
                }
                Steedos.Push.Permission.request(onRequestSuccess, onRequestFailed);
                
                handle = query.observeChanges({
                    added: function(id, notification){
                        console.log(notification);
                        // 非主窗口不弹推送消息
                        if(window.opener)
                            return;

                        var options = {
                            iconUrl: '',
                            title: notification.name,
                            body: notification.text,
                            timeout: 15 * 1000,
                            onClick: function(event){
                                console.log(event)
                                if(event.target.tag){
                                    window.location.href =event.target.tag;
                                }
                                window.focus();
                                this.close();
                                return;
                            }
                        }

                        if(options.title){
                            options.tag = Steedos.absoluteUrl("/api/v4/notifications/" + id + "/read");
                            Steedos.Push.create(options.title, options);
                        }

                        if(Steedos.isNode()){
                            // 新版客户端
                            if(nw.ipcRenderer){
                                if(notification.badge != undefined){
                                    nw.ipcRenderer.sendToHost('onBadgeChange', false, 0, notification.badge, false, false);
                                }
                            }
                            else{
                                // 任务栏高亮显示
                                nw.Window.get().requestAttention(3);
                            }
                        }
                        return;
                    }
                });
            }
        });
    }
});
