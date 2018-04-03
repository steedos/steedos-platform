#TODO object的name不能重复，需要考虑到系统表
isRepeatedName = (doc)->
	other = Creator.getCollection("objects").find({_id: {$ne: doc._id}, name: doc.name}, {fields:{_id: 1}})
	if other.count() > 0
		return true
	return false

Creator.Objects.objects =
	name: "objects"
	icon: "orders"
	fields:
		name:
			type: "text"
			searchable:true
			index:true
			required: true
			regEx: SimpleSchema.RegEx.code
		label:
			type: "text"
		icon:
			type: "lookup"
			optionsFunction: ()->
				# 将svg文件打开后，把xml内容转换为json格式(https://www.bejson.com/xml2json/)，然后执行此脚本获取icon标识：_.pluck(json.svg.symbol, "-id").join(",")
				standard_svgs = "account,address,announcement,answer_best,answer_private,answer_public,approval,apps,apps_admin,article,asset_relationship,assigned_resource,avatar,avatar_loading,bot,business_hours,calibration,call,call_history,campaign,campaign_members,canvas,carousel,case,case_change_status,case_comment,case_email,case_log_a_call,case_milestone,case_transcript,client,cms,coaching,connected_apps,contact,contact_list,contract,contract_line_item,custom,custom_notification,dashboard,datadotcom,default,document,drafts,email,email_chatter,empty,endorsement,entitlement,entitlement_process,entitlement_template,entity,entity_milestone,environment_hub,event,feed,feedback,file,flow,folder,forecasts,generic_loading,goals,group_loading,groups,hierarchy,home,household,insights,investment_account,lead,lead_insights,lead_list,link,list_email,live_chat,location,log_a_call,macros,maintenance_asset,maintenance_plan,marketing_actions,merge,metrics,news,note,omni_supervisor,operating_hours,opportunity,opportunity_splits,orders,people,performance,person_account,photo,poll,portal,post,pricebook,process,product,product_consumed,product_item,product_item_transaction,product_request,product_request_line_item,product_required,product_transfer,question_best,question_feed,quick_text,quip,quip_sheet,quotes,recent,record,related_list,relationship,report,resource_absence,resource_capacity,resource_preference,resource_skill,reward,rtc_presence,sales_path,scan_card,service_appointment,service_contract,service_crew,service_crew_member,service_report,service_resource,service_territory,service_territory_location,service_territory_member,shipment,skill,skill_entity,skill_requirement,social,solution,sossession,task,task2,team_member,template,thanks,thanks_loading,timesheet,timesheet_entry,timeslot,today,topic,topic2,unmatched,user,work_order,work_order_item,work_type".split(",")
				options = []
				_.forEach standard_svgs, (svg)->
					options.push {value: svg, label: svg, icon: svg}
				return options
		is_enable:
			type: "boolean"
			defaultValue: true
		enable_search:
			type: "boolean"
		enable_files:
			type: "boolean"
		enable_tasks:
			type: "boolean"
		enable_notes:
			type: "boolean"
		enable_api:
			type: "boolean"
			defaultValue: true
			hidden: true
		is_view:
			type: 'boolean'
			defaultValue: false
			hidden: true
		description: 
			label: "Description"
			type: "textarea"
			is_wide: true
		fields:
			blackbox: true
			omit: true
			hidden: true
		list_views:
			blackbox: true
			omit: true
			hidden: true
		actions:
			blackbox: true
			omit: true
			hidden: true
		permission_set:
			blackbox: true
			omit: true
			hidden: true
		triggers:
			blackbox: true
			omit: true
			hidden: true
		custom:
			type: "boolean"
			hidden: true
		owner: 
			hidden: true

	list_views:
		default:
			columns: ["name", "label", "is_enable", "modified"]
		all:
			label:"所有对象"
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true


	triggers:
		"before.insert.server.objects":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if isRepeatedName(doc)
					throw new Meteor.Error 500, "对象名称不能重复"
				doc.custom = true

		"before.update.server.objects":
			on: "server"
			when: "before.update"
			todo: (userId, doc)->
				if isRepeatedName(doc)
					throw new Meteor.Error 500, "对象名称不能重复"

		"before.update.server.objects":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.name && doc.name != modifier.$set.name
					console.log "不能修改name"
					throw new Meteor.Error 500, "不能修改name"

		"after.insert.server.objects":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				#新增object时，默认新建一个name字段
				Creator.getCollection("object_fields").insert({object: doc._id, owner: userId, name: "name", space: doc.space, type: "text", required: true, index: true, searchable: true})
				Creator.getCollection("object_listviews").insert({name: "all", space: doc.space, owner: userId, object_name: doc.name, shared: true, filter_scope: "space", columns: ["name"], is_default: true})
				Creator.getCollection("object_listviews").insert({name: "recent", space: doc.space, owner: userId, object_name: doc.name, shared: true, filter_scope: "space", columns: ["name"]})

		"before.remove.server.objects":
			on: "server"
			when: "before.remove"
			todo: (userId, doc)->
				object_collections = Creator.getCollection(doc.name)

				documents = object_collections.find({},{fields: {_id: 1}})

				if documents.count() > 0
					throw new Meteor.Error 500, "对象中已经有记录，请先删除记录后， 再删除此对象"

		"after.remove.server.objects":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				#删除object 后，自动删除fields、actions、triggers、permission_objects
				Creator.getCollection("object_fields").direct.remove({object: doc._id})

				Creator.getCollection("object_actions").direct.remove({object: doc._id})

				Creator.getCollection("object_triggers").direct.remove({object: doc._id})

				Creator.getCollection("permission_objects").direct.remove({object_name: doc.name})

				Creator.getCollection("object_listviews").direct.remove({space: doc.space, object_name: doc.name, is_default: true, owner: userId, shared: true, filter_scope: "space"})

				#drop collection
				console.log "drop collection", doc.name
				Creator.getCollection(doc.name)._collection.dropCollection()
#
#				Creator.getCollection(doc.name).rawCollection().drop (err, client)->
#					Creator.removeCollection(doc.name)