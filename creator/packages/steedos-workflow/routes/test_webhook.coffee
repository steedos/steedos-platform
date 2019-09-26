if Meteor.isDevelopment
    JsonRoutes.add 'post', '/test/webhook', (req, res, next) ->
        try

            hashData = req.body
            console.log 'action: ', hashData.action
            console.log 'from_user: ', hashData.from_user
            console.log 'to_users: ', hashData.to_users


            JsonRoutes.sendResult res,
                    code: 200
                    data: {}
        catch e
            console.error e.stack
            JsonRoutes.sendResult res,
                code: 200
                data: { errors: [{errorMessage: e.message}] }