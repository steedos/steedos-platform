Meteor.methods

	# 查看原文：找出最后一版正文或者不带签章的PDF版本
	view_main_doc: (object_name,record_id) ->
		obj = Creator.Collections[object_name].findOne({_id:record_id})
		result = {}
		if (obj.end_date - new Date()) >0		
			if obj.state == "approved"
				cfs.files = Creator.Collections["cfs.files.filerecord"]
				file_obj = cfs.files.findOne({
					'metadata.record_id': record_id,
					'metadata.main': true,
					'metadata.current': true})
				result['fileId'] = file_obj?._id
			else
				result['state'] = obj.state
		else
			result['end_date'] = obj.end_date
		return result		

	submit_borrow:(object_name,record_id)->
		Creator.Collections[object_name].update({_id:record_id},{$set:{state:"pending"}})

	restore:(object_name,record_id,space)->
		Creator.Collections["archive_borrow"].update({_id:record_id},{$set:{is_deleted:true,end_date:new Date()}},
			(error,result)->
				if !error
					relate_record = Creator.Collections["archive_borrow"].findOne({_id:record_id})?.relate_record
					Creator.Collections[object_name].direct.update({_id:relate_record?.ids[0]},{$set:{is_borrowed:false,modified:new Date(),modified_by:Meteor.userId()}})
					Meteor.call("archive_new_audit",relate_record?.ids[0],"归还档案","成功",space)
				else
					Meteor.call("archive_new_audit",relate_record?.ids[0],"归还档案","失败",space)
				)

	renew:(object_name,record_id,space)->
		now = new Date()
		start_date = now
		end_date =new Date(now.getTime()+7*24*3600*1000)
		Creator.Collections["archive_borrow"].update({_id:record_id},{$set:{start_date:start_date,end_date:end_date,state:"pending"}},
			(error,result)->
				if !error
					relate_record = Creator.Collections["archive_borrow"].findOne({_id:record_id})?.relate_record
					Meteor.call("archive_new_audit",relate_record?.ids[0],"续借档案","成功",space)
				else
					Meteor.call("archive_new_audit",relate_record?.ids[0],"续借档案","失败",space)
				)	
		
			