JsonRoutes.add "post", "/api/push/message", (req, res, next) ->
    if req.body?.pushTopic and req.body.userIds and req.body.data
        message = 
            from: "steedos"
            query:
                appName: req.body.pushTopic
                userId: 
                    "$in": userIds
        if req.body.data.alertTitle?
            message["title"] = req.body.data.alertTitle
        if req.body.data.alert?
            message["text"] = req.body.data.alert
        if req.body.data.badge?
            message["badge"] = req.body.data.badge + ""
        if req.body.data.sound?
            message["sound"] = req.body.data.sound
        #if req.body.data.data?
        #    message["data"] = req.body.data.data
        Push.send message

        res.end("success");



Meteor.methods
    pushSend: (text,title,badge,userId) ->
        if (!userId)
            return;
        Push.send
            from: 'steedos',
            title: title,
            text: text,
            badge: badge,
            query: 
                userId: userId
                appName: "workflow"
