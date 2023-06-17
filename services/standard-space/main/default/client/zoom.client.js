Tracker.autorun(function(e) {
    let zoom = "normal";
    let space = db.space_users?.findOne();
    if(space?.zoom){
        zoom = space.zoom;
    }
    $("body").removeClass("zoom-normal").removeClass("zoom-large").removeClass("zoom-extra-large");
    $("body").addClass("zoom-" + zoom);
})