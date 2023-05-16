
db.notifications = new Mongo.Collection('notifications');
Creator.subs["CreatorNotifications"] = new SubsManager();

Meteor.startup(function(){
    Meteor.autorun(function(c){
        spaceId = Session.get("spaceId");
        if(spaceId){
            Creator.subs["CreatorNotifications"].subscribe("my_notifications", spaceId);
        }
    });
});

var handleMyNotifications = function(id, notification){
    console.log(notification);

    // 非主窗口不弹推送消息
    // 为解决老客户端跑workflow/creator项目需要写window.opener.opener两层的判断，调用isNewWindow函数
    if(Steedos.isNewWindow())
        return;

    var options = {
        iconUrl: '',
        title: notification.name,
        body: notification.body,
        timeout: 15 * 1000,
        onClick: function(event){
            console.log(event)
            if(event.target.tag){
                window.location.href = event.target.tag;
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

// var fetchMyNotifications = function(){
//     BuilderCreator.store.dispatch(BuilderCreator.loadNotificationsData({id: "steedos-header-notifications"}))
// }

// Meteor.startup(function(c){
//     Meteor.autorun(function(){
//         if(Creator.subs["CreatorNotifications"].ready("my_notifications") && Creator.bootstrapLoaded.get()){
//             if(Meteor.loggingIn() || Meteor.loggingOut()){
//                 return;
//             }
//             if(!Meteor.userId()){
//                 return;
//             }
//             var query = Creator.getCollection("notifications").find();
//             if(!Steedos.isMobile() && !Steedos.isNode()){
//                 // 手机上和客户端不走push.js
//                 if(Push.debug){
//                     console.log("init my_notifications observeChanges");
//                 }
//                 // 发起获取发送通知权限请求
//                 var onRequestSuccess = function(){
//                     console.log("Request my_notifications push permission success.")
//                 }
//                 var onRequestFailed = function(){
//                     console.log("Request my_notifications push permission failed.")
//                 }
//                 Steedos.Push.Permission.request(onRequestSuccess, onRequestFailed);
//             }

//             query.observeChanges({
//                 added: function(id, notification){
//                     // 订阅到新通知过来时，重新请求通知数据
//                     fetchMyNotifications();
//                     if(!Steedos.isMobile() && !Steedos.isNode()){
//                         // 手机上和客户端不走push.js
//                         handleMyNotifications(id, notification);
//                     }
//                 },
//                 changed: function(id, notification){
//                     // 订阅到新通知过来时，重新请求通知数据
//                     fetchMyNotifications();
//                 },
//                 removed: function(id){
//                     // 通知移除时，重新请求通知数据
//                     fetchMyNotifications();
//                 }
//             });
//             // 初始化界面及切换工作区时，需要请求通知数据
//             fetchMyNotifications();
//         }
//     });
// });


    ; (function () {
        try {
            var rootId = "NotificationsSubscribeRoot";
            var modalRoot = document.getElementById(rootId);
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.setAttribute('id', rootId);
                $("body")[0].appendChild(modalRoot);
            }
            const page = {
                name: "pageNotificationsSubscribe",
                render_engine: "amis",
                schema: {
                    name: "serviceNotificationsSubscribe",
                    id: "serviceNotificationsSubscribe",
                    type: "service",
                    className: "service-notifications-subscribe hidden",
                    body: [{
                        "type": "button",
                        "label": "触发@data.changed",
                        "name": "buttonTriggerDataChange",
                        "className": "button-trigger-data-change-notifications",
                        "onEvent": {
                            "click": {
                                "actions": [
                                    {
                                        "actionType": "broadcast",
                                        "args": {
                                            "eventName": "@data.changed.notifications"
                                        },
                                        "data": {
                                            "type": "${event.data.type}",
                                            "objectName": "notifications",
                                            "recordId": "sss"
                                        }
                                    }
                                ]
                            }
                        },
                    }]
                }
            };
            Meteor.startup(function () {
                const root = $("#" + rootId)[0];
                Tracker.autorun(function (c) {
                    if (Creator.steedosInit.get() && Creator.validated.get() && Creator.subs["CreatorNotifications"].ready("my_notifications")) {
                        Steedos.Page.render(root, page, {});
                        const findVars = (obj, vars) => {
                            try {
                                return vars.length === vars.filter(function (item) {
                                    return item.split(".").reduce(function (sum, n) {
                                        return sum[n];
                                    }, obj) !== undefined;
                                }).length;
                            }
                            catch (ex) {
                                return false;
                            }
                        }
                        const waittingVars = ["SteedosUI.refs.serviceNotificationsSubscribe.getComponentByName"];
                        Promise.all([
                            waitForThing(window, waittingVars, findVars)
                        ]).then(() => {
                            var scope = SteedosUI.refs["serviceNotificationsSubscribe"];
                            var button = scope.getComponentByName("serviceNotificationsSubscribe.buttonTriggerDataChange");
                            button && observeBadgeCount(button);
                        });
                    }
                });
            });

        } catch (error) {
            console.error(error)
        };
    })();


function observeBadgeCount(button) {
    var reload = function (type, doc) {
        console.log("observed notifications change:", type, doc);
        if (doc.space) {
            // space为null的订阅不触发事件，后续有需要再单独处理
            button.props.dispatchEvent('click', {
                type: type
            });
        }
    };
    var callbacks = {
        changed: function (newDoc) {
            reload("changed", newDoc);
        },
        added: function (newDoc) {
            reload("added", newDoc);
        },
        removed: function (oldDoc) {
            reload("removed", oldDoc);
        }
    };
    db.notifications.find().observe(callbacks);
}