###
    type: "user"
    object_name: "object_listviews"
    record_id: "{object_name},{listview_id}"
    settings:
        column_width: { field_a: 100, field_2: 150 }
        sort: [["field_a", "desc"]]
    owner: {userId}
###

Meteor.methods
    "tabular_sort_settings": (object_name, list_view_id, sort)->
        userId = this.userId
        setting = Creator.Collections.settings.findOne({object_name: object_name, record_id: "object_listviews", owner: userId})
        if setting
            Creator.Collections.settings.update({_id: setting._id}, {$set: {"settings.#{list_view_id}.sort": sort}})
        else
            doc = 
                type: "user"
                object_name: object_name
                record_id: "object_listviews"
                settings: {}
                owner: userId

            doc.settings[list_view_id] = {}
            doc.settings[list_view_id].sort = sort

            Creator.Collections.settings.insert(doc)

    "tabular_column_width_settings": (object_name, list_view_id, column_width)->
        userId = this.userId
        setting = Creator.Collections.settings.findOne({object_name: object_name, record_id: "object_listviews", owner: userId})
        if setting
            Creator.Collections.settings.update({_id: setting._id}, {$set: {"settings.#{list_view_id}.column_width": column_width}})
        else
            doc = 
                type: "user"
                object_name: object_name
                record_id: "object_listviews"
                settings: {}
                owner: userId

            doc.settings[list_view_id] = {}
            doc.settings[list_view_id].column_width = column_width

            Creator.Collections.settings.insert(doc)

    "grid_settings": (object_name, list_view_id, column_width, sort)->
        userId = this.userId
        setting = Creator.Collections.settings.findOne({object_name: object_name, record_id: "object_gridviews", owner: userId})
        if setting
            # 每次都强制改变_id_actions列的宽度，以解决当用户只改变字段次序而没有改变任何字段宽度时，前端没有订阅到字段次序变更的数据的问题
            column_width._id_actions = if setting.settings["#{list_view_id}"]?.column_width?._id_actions == 46 then 47 else 46
            if sort
                Creator.Collections.settings.update({_id: setting._id}, {$set: {"settings.#{list_view_id}.sort": sort, "settings.#{list_view_id}.column_width": column_width}})
            else
                Creator.Collections.settings.update({_id: setting._id}, {$set: {"settings.#{list_view_id}.column_width": column_width}})
        else
            doc =
                type: "user"
                object_name: object_name
                record_id: "object_gridviews"
                settings: {}
                owner: userId
            
            doc.settings[list_view_id] = {}
            doc.settings[list_view_id].column_width = column_width
            doc.settings[list_view_id].sort = sort

            Creator.Collections.settings.insert(doc)