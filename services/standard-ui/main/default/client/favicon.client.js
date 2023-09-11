
Meteor.startup(function(){
    Tracker.autorun(function(){
        const space = db.spaces.findOne(Steedos.getSpaceId());
        if(space && space.favicon){
            const faviconLink = document.querySelector('link[rel="shortcut icon"]');
            faviconLink.href = Steedos.absoluteUrl("/api/files/avatars/"+space.favicon);
            console.log('update faviconLink.href', faviconLink.href)
        }
    })
})