Template.homeMenu.onRendered ->

Template.homeMenu.helpers Creator.helpers

Template.homeMenu.helpers
    apps: ()->
        apps = []
        _.each Creator.Apps, (v, k)->
            if v.visible != false
                apps.push v
        
        return apps