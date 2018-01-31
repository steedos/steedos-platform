Template.objectMenu.onRendered ->
    this.$(".object-menu").removeClass "hidden"
    this.$(".object-menu").animateCss "fadeInRight"

Template.objectMenu.helpers
    app: ()->
        app_id = Template.instance().data.app_id
        return Creator.getApp(app_id)

    object_icon: (object_name)->
        return Creator.getObject(object_name).icon

    object_label: (object_name)->
        return Creator.getObject(object_name).label

    object_url: (object_name)->
        app_id = Template.instance().data.app_id
        return Creator.getObjectUrl(object_name, null, app_id)
        

Template.objectMenu.events
    'click .object-menu-back': (event, template)->
        template.$(".object-menu").animateCss "fadeOutRight", ->
            Blaze.remove(template.view)
            FlowRouter.go '/app/menu'