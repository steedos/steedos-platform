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
        
    is_admin: ()->
        app_id = Session.get("app_id")
        return app_id == "admin"
        
    admin_menus: (parent)->
        if parent
            if parent.object_name or parent.template_name
                # 如果本身就是叶子，则直接显示出来，不需要再去找其子菜单了
                if parent.mobile != false
                    return [parent]
                else
                    return []
            else
                return _.filter(Creator.Menus,(menu)-> return menu.parent == parent._id and menu.mobile != false)
        else
            return _.filter(Creator.Menus,(menu)-> return !menu.parent and menu.mobile != false)

    admin_menu_url: (menu)->
        if menu.object_name
            return Creator.getSwitchListUrl(menu.object_name, "admin")
        else if menu.template_name
            return Creator.getRelativeUrl("/app/admin/page/#{menu.template_name}")
        else
            return ""
        

Template.objectMenu.events
    'click .show-object-list': (event, template)->
        $('#mobile_apps_modal').modal 'show'

    'click .go-admin-menu': (event, template)->
        FlowRouter.go '/admin'