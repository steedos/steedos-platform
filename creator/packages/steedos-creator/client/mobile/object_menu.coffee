Template.objectMenu.onRendered ->

Template.objectMenu.helpers Creator.helpers

Template.objectMenu.helpers
    app: ()->
        app_id = Session.get("app_id")
        return Creator.getApp(app_id)
    
    object_enabled: (object_name)->
        app_obj = Creator.getObject(object_name)
        return app_obj?.is_enable && !app_obj.hidden && app_obj.permissions.get().allowRead

    object_icon: (object_name)->
        return Creator.getObject(object_name).icon

    object_label: (object_name)->
        return Creator.getObject(object_name).label

    object_url: (object_name)->
        app_id = Session.get("app_id")
        return Creator.getSwitchListUrl(object_name, app_id)
        

Template.objectMenu.events
    'click .show-object-list': (event, template)->
        Modal.show("object_list_modal")

    'click .go-admin-menu': (event, template)->
        FlowRouter.go '/admin'