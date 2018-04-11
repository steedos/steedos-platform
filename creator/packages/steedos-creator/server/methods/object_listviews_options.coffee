Meteor.methods
    update_filters: (listview_id, filters, filter_scope)->
        Creator.Collections.object_listviews.direct.update({_id: listview_id}, {$set: {filters: filters, filter_scope: filter_scope}})

    update_columns: (listview_id, columns)->
        check(columns, Array)
        
        if columns.length < 1
            throw new Meteor.Error 400, "Select at least one field to display"
        Creator.Collections.object_listviews.update({_id: listview_id}, {$set: {columns: columns}})
