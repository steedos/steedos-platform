Creator.initStatistics = (year, month)->
    if Steedos.isCloudAdmin()
        r = /^[1-9]*[1-9][0-9]*$/
        if !r.test(year)
            return 'Year is not a integer!'
        if !r.test(month)
            return 'Month is not a integer!'
        if year and month
            spaceId = Steedos.spaceId()
            Meteor.call("init_statistics", spaceId, year, month, 
                (error,result) ->
                    console.log 'Success'
            )
            return
        else
            return 'Please input year or month!'
    else
        return 'You are not CloudAdmin!'