Meteor.methods
	sync_zhusong: (spaces, record_ids) ->
		try
			if spaces and record_ids
				query = {
					space: {$in: spaces},
					external_id: {$exists: true}
				}
				if record_ids?.length > 0
					query._id = { $in: record_ids }
				
				record_objs = Creator.Collections["archive_wenshu"].find(query, {fields: {_id: 1,external_id: 1}}).fetch()
				record_objs.forEach (record_obj)->
					instance = Creator.Collections["instances"].findOne({_id: record_obj.external_id}, {fields: {values: 1}})
					if instance
						zhusong = instance?.values["主送"] || ""
						if instance?.values["页数"]
							yeshu = parseInt(instance?.values["页数"])+1
						else
							yeshu = 1
						Creator.Collections["archive_wenshu"].update(
							{_id: record_obj._id}, {
							$set: {
								prinpipal_receiver: zhusong,
								total_number_of_pages: yeshu
								}})
				return 'success'
			else
				return 'No spaces and record_ids'
		catch e
			error = e
			return error
	
	syncEcode: (spaces, year) ->
		try
			if spaces and year
				# 查找当年度不存在电子文件号的文件
				query = {
					space: {$in: spaces},
					year: year
				}
				console.log "query",query
				record_objs = Creator.Collections["archive_wenshu"].find(query,
					{fields: {_id: 1, year: 1, archival_category_code: 1,fonds_name: 1}}).fetch()
				console.log "record_objs",record_objs?.length
				record_objs.forEach (record)->
					# 更新电子文件号
					if record?.fonds_name and record?.archival_category_code and record?.year and record?._id
						fonds_name_code = Creator.Collections["archive_fonds"].findOne(record.fonds_name,{fields:{code:1}})?.code
						year = record.year
						id = record._id
						electronic_record_code = fonds_name_code + "WS" + year + id
						console.log "record._id",record._id
						Creator.Collections["archive_wenshu"].direct.update(record._id,
							{$set:{electronic_record_code:electronic_record_code}})

				return 'success'
			else
				return 'No spaces and record_ids'
		catch e
			error = e
			return error
	
	syncFond: (spaces, record_ids) ->
		try
			if spaces and record_ids
				query = {
					space: {$in: spaces}
				}
				if record_ids?.length > 0
					query._id = { $in: record_ids }
				
				record_objs = Creator.Collections["archive_wenshu"].find(query, {fields: {_id: 1,external_id: 1}}).fetch()
				record_objs.forEach (record_obj)->
					instance = Creator.Collections["instances"].findOne({_id: record_obj.external_id}, {fields: {values: 1}})
					if instance
						# 查找全宗
						console.log "instance"
						# Creator.Collections["archive_wenshu"].update(
						# 	{_id: record_obj._id}, {
						# 	$set: {
						# 		prinpipal_receiver: zhusong,
						# 		total_number_of_pages: yeshu
						# 		}})
				return 'success'
			else
				return 'No spaces and record_ids'
		catch e
			error = e
			return error
