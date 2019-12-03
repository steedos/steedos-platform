var store = ReactSteedos.store; 
var loadNotificationsData = ReactSteedos.loadNotificationsData; 

Creator.subs["CreatorNotifications"] = new SubsManager();

Meteor.startup(function(c){
	Meteor.autorun(function(c){
        spaceId = Session.get("spaceId");
        if(spaceId){
            Creator.subs["CreatorNotifications"].subscribe("my_notifications", spaceId);
        }
    });

    Meteor.autorun(()=>{
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

