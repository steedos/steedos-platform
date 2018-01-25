Meteor.methods
	archive_borrow: (selectedIds,space) ->
		collection_borrow = Creator.Collections["archive_borrow"]
		doc = {}
		now = new Date()
		count = collection_borrow.find({year:now.getFullYear().toString()}).count()+1
		strCount = (Array(6).join('0') + count).slice(-6)
		doc.borrow_no = now.getFullYear().toString()  + strCount
		collection_record = Creator.Collections["archive_records"]
		#console.log collection_record.find({},{field:{year: 1}}).sort({year:-1}).limit(1)
		doc.deparment_info = "办公室" 
		doc.phone_number = "13261808824"
		doc.year = now.getFullYear()
		doc.unit_info = Creator.Collections["space_users"].findOne({user:Meteor.userId(),space:space},{fields:{company:1}}).company
		doc.start_date = now
		doc.end_date =new Date(now.getTime()+7*24*3600*1000)
		doc.use_with = "工作考察"
		doc.use_fashion = "实体借阅"
		doc.file_type = "立卷方式(文件级)"
		doc.space = space
		doc.is_approved = false
		doc.title = []
		selectedIds.forEach (selectedId)->
			doc.title.push collection_record.findOne({_id:selectedId}).title
		collection_borrow.insert(doc,(error,result)->
			if !error
				selectedIds.forEach (selectedId)->
					collection_record.update({_id:selectedId},{$set:{is_borrowed:true,borrowed_by:Meteor.userId(),borrowed:now}})
			else
				console.log error
		)

	# 查看原文：找出最后一版正文或者不带签章的PDF版本
	view_main_doc: (record_id) ->
		cfs.files = Creator.Collections["cfs.files.filerecord"]
		file_obj = cfs.files.findOne({
			'metadata.record_id': record_id,
			'metadata.main': true,
			'metadata.current': true,
			'metadata.is_private': false})
		return file_obj?._id

	submit_borrow:(record_id)->
		Creator.Collections["archive_borrow"].update({_id:record_id},{$set:{state:"pending"}})

	restore:(record_id,space)->
		Creator.Collections["archive_borrow"].update({_id:record_id},{$set:{is_deleted:true}},
			(error,result)->
				if !error
					recordId = Creator.Collections["archive_borrow"].findOne({_id:record_id}).relate_record
					Creator.Collections["archive_records"].direct.update({_id:recordId},{$set:{is_borrowed:false,modified:new Date(),modified_by:Meteor.userId()}})
					Meteor.call("archive_new_audit",recordId,"归还档案","成功",space)
				else
					Meteor.call("archive_new_audit",recordId,"归还档案","失败",space)
				)

	renew:(record_id,space)->
		now = new Date()
		start_date = now
		end_date =new Date(now.getTime()+7*24*3600*1000)
		Creator.Collections["archive_borrow"].update({_id:record_id},{$set:{start_date:start_date,end_date:end_date,state:"draft"}},
			(error,result)->
				if !error
					recordId = Creator.Collections["archive_borrow"].findOne({_id:record_id}).relate_record
					Meteor.call("archive_new_audit",recordId,"续借档案","成功",space)
				else
					Meteor.call("archive_new_audit",recordId,"续借档案","失败",space)
				)	
		
			