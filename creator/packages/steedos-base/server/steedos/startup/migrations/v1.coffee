Meteor.startup ->
    Migrations.add
        version: 1
        name: '在线编辑时，需给文件增加lock 属性，防止多人同时编辑 #429, 附件页面使用cfs显示'
        up: ->
            console.time('upgrade_cfs_instance')
            try
                update_cfs_instance = (parent_id, space_id, instance_id, attach_version, isCurrent)->
                    metadata = {parent: parent_id, owner: attach_version['created_by'], owner_name: attach_version['created_by_name'], space: space_id, instance: instance_id, approve: attach_version['approve']}
                    if isCurrent
                        metadata.current = true

                    cfs.instances.update({_id: attach_version['_rev']}, {$set: {metadata: metadata}})
                i = 0
                db.instances.find({"attachments.current": {$exists: true}}, {sort: {modified: -1}, fields: {space: 1, attachments: 1}}).forEach (ins) ->
                    attachs = ins.attachments
                    space_id = ins.space
                    instance_id = ins._id
                    attachs.forEach (att)->
                        current_ver = att.current
                        parent_id = current_ver._rev
                        update_cfs_instance(parent_id, space_id, instance_id, current_ver, true)

                        if att.historys
                            att.historys.forEach (his) ->
                                update_cfs_instance(parent_id, space_id, instance_id, his, false)

                    i++

            catch e
                console.error(e)

            console.timeEnd('upgrade_cfs_instance')
        down: ->
            console.log('version 1 down')