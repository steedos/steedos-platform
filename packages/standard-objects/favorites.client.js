Creator.subs["CreatorFavorites"] = new SubsManager();
Meteor.startup(function(){
  Meteor.autorun(function(c){
      spaceId = Session.get("spaceId");
      if(spaceId){
          Creator.subs["CreatorFavorites"].subscribe("myFavorites", spaceId);
      }
  });
});