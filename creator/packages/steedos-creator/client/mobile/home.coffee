Template.homeMenu.onRendered ->
    this.$(".home-menu").animateCss("fadeIn")

Template.homeMenu.helpers
    apps: ()->
        apps = []
        _.each Creator.Apps, (v, k)->
            if v.visible != false
                apps.push v
        
        console.log apps
        return apps