Meteor.methods
	start_instanceToArchive: (file_ids,space_id) ->
        try
			query = {
                space:space_id
            }
            
            if file_ids?.length > 0
                query._id = {$in: file_ids}

            console.log "query",query

            cfs_file_collection = Creator.Collections["cfs.files.filerecord"]

            cfs_instance_collection = Creator.Collections["cfs.instances.filerecord"]

            cfs_files = cfs_file_collection.find(query, {fields: {_id: 1}}).fetch()

            cfs_files.forEach (cfs_file)->
		        cfs_file = cfs_file_collection.findOne({_id: cfs_file._id})

                record_id = cfs_file?.metadata?.record_id
                
                ins_id = Creator.Collections["archive_wenshu"].findOne({_id:record_id})?.external_id
                
                if cfs_ins
                    # 查到了表单，然后更新字段
                    console.log "cfs_ins",cfs_ins._id
                    cfs_file_collection.update(cfs_file._id, {
                        $set: {
                            'metadata.current': cfs_ins.metadata.current,
                            'metadata.main': cfs_ins.metadata.main,
                            'metadata.is_private': cfs_ins.metadata.is_private
                            }
                        })
                    return "success"
                else
                    throw new Meteor.Error('start_instanceToArchive!', 'instances 未找到该文件')
                
        catch e
			return e