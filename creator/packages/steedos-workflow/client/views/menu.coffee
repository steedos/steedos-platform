Template.workflow_menu.helpers

    boxName: ->
        if Session.get("box")
            return t(Session.get("box"))

    # designer: ->
    #     apps = Steedos.getSpaceApps()
    #     rev = undefined
    #     apps.forEach (i) ->
    #       if i.name == 'Flow Designer'
    #         rev = i

    #     return rev;

    spaces: ()->
        spaceId = Session.get("spaceId")
        p = []
        s = db.spaces.find({}, {fields: {_id: 1, name: 1}})
        l = t('workflow_left_parenthesis')
        r = t('workflow_right_parenthesis')
        s.forEach (sp)->
            badge = Steedos.getBadge("workflow", sp._id)
            if badge
                p.push({_id: sp._id, name: l+sp.name+r, inbox_count: badge})
        
        if p.length == 1 && p[0]._id == spaceId
            p[0].name = undefined

        if p.length == 0
            p.push({_id: spaceId})
        return p
