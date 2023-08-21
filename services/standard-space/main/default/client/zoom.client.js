Tracker.autorun(function(e) {
    let zoom = "normal";
    let space = db.space_users.findOne({ user: Steedos.userId(), space: Steedos.spaceId() });
    if(space?.zoom){
        zoom = space.zoom;
    }
    if(Steedos.isMobile()){
        $("body").removeClass("zoom-normal").removeClass("zoom-large").removeClass("zoom-extra-large");
        $("body").addClass("zoom-" + zoom);
    }else if(Steedos.isNode()){
        let zoomRate = 1;
        if(zoom == "large"){
            zoomRate = 1.25;
        }else if(zoom == 'extra-large'){
            zoomRate = 2.0;
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var tabId = tabs[0].id;
            chrome.tabs.setZoom(tabId, zoomRate)
        });
    }
})