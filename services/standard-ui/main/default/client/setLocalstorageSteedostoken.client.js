Tracker.autorun(function(e) {
    if (Creator.validated.get()){
        const token = Builder.settings.context.user.authToken;
        if (token) {
            localStorage.setItem("steedos:token", token);
        }
    }
})