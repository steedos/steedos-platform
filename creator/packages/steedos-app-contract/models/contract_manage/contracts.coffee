set_contracttype2 = (doc)->
	contracttype2 = "买卖合同"
	Creator.Collections["contracts"].direct.update(doc._id,
	{
		$set:{
			contracttype2:contracttype2
		}
	})

Creator.Objects.contracts = 
	name: "contracts"
	icon: "record"
	label: "合同信息"
	enable_search: true
	enable_files: true
	enable_tasks: true
	enable_instances: true
	enable_api: true
	enable_tree: false
	enable_chatter: true
	fields:

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
	list_views:
		all:
			label:"全部"
			filter_scope: "space"
			columns:["company","contracttype","no","project","name","othercompany","singeddate","startdate","overdate","isbidding","contractamount","is3in1","isimportant","contractstate"]	

	triggers:
		"after.insert.server.default":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				# 设置合同统计类别
				set_contracttype2(doc._id)

		"after.update.server.default":
			on: "server"
			when: "after.update"
			todo: (userId, doc)->
				# 设置合同统计类别
				set_contracttype2(doc._id)
		