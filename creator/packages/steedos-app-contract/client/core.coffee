# Archive.createBorrowObject = (object_name, record_id)->
# 	doc = {}
# 	now = new Date()
# 	doc.year = now.getFullYear().toString()
# 	doc.unit_info = Creator.Collections["space_users"].findOne({user:Meteor.userId(),space:Session.get("spaceId")},{fields:{company:1}})?.company
# 	doc.start_date = now
# 	doc.end_date =new Date(now.getTime()+7*24*3600*1000)
# 	doc.use_with = "工作查考"
# 	doc.use_fashion = "实体借阅"
# 	doc.file_type = "立卷方式(文件级)"
# 	doc.space = Session.get("spaceId")
# 	doc.relate_record = record_id
# 	return doc