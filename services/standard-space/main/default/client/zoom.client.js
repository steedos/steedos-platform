/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-22 10:36:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-22 22:19:01
 * @Description: 
 */
Tracker.autorun(function(e) {
    let zoom = "normal";
    let space = db.space_users.findOne({ user: Steedos.userId(), space: Steedos.spaceId() });
    if(space && space.zoom){
        zoom = space.zoom;
    }
    if(Steedos.isMobile()){
        $("body").removeClass("zoom-normal").removeClass("zoom-large").removeClass("zoom-extra-large");
        $("body").addClass("zoom-" + zoom);
    }else if(Steedos.isNode()){
        let zoomRate = 1.1;
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