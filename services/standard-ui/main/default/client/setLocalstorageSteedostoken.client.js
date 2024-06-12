Tracker.autorun(function(e) {
    if (Creator.validated.get()){
        const token = Creator.USER_CONTEXT.user.authToken;
        if (token) {
            localStorage.setItem("steedos:token", token);
        }
    }
})