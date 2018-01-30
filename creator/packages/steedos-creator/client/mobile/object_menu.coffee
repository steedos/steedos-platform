Template.objectMenu.onRendered ->
    this.$(".object-menu").animateCss("fadeInRight")

Template.objectMenu.events
    'click .object-menu-back': (event, template)->
        template.$(".object-menu").animateCss "fadeOutRight", ->
            Blaze.remove(template.view)
            FlowRouter.go '/app/menu'