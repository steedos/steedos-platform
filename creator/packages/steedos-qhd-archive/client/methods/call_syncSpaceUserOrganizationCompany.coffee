Creator.syncSpaceUserOrganizationCompany = (user_ids)->
# ---------------------------------------------------
    if Steedos.isCloudAdmin()
        if Object.prototype.toString.call(user_ids) == "[object Array]"
            spaceId = Steedos.spaceId()
            Meteor.call("syncSpaceUserOrganizationCompany", spaceId, user_ids, 
                (error,result) ->
                    if result
                        console.log 'Success'
                    else
                        console.log 'Error',error
            )
            return
        else
            return 'Parameter should be [object Array]!'
    else
        return 'You are not CloudAdmin!'