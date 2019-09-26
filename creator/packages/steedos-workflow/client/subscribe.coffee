Steedos.subs["InstanceInbox"] = new SubsManager

Steedos.subs["related_instances"] = new SubsManager

Steedos.subs["Instance"] = new SubsManager
	cacheLimit: 20

Steedos.subs["instance_data"] = new SubsManager
	cacheLimit: 10

Steedos.subs["instances_draft"] = new SubsManager
	cacheLimit: 99

Steedos.subs["distributed_instances"] = new SubsManager

Steedos.subs["flow_main_attach_template"] = new SubsManager

Steedos.subs["instance_traces"] = new SubsManager

Steedos.subscribeFlowVersion = (space, flowId, flow_version)->
	Steedos.subs["Instance"].subscribe("flow_version", space, flowId , flow_version)

Steedos.subscribeFormVersion = (space, formId, form_version)->
	Steedos.subs["Instance"].subscribe("form_version", space, formId , form_version)

Steedos.subscribeInstance = (instance)->
	Steedos.subscribeFlowVersion(instance.space, instance.flow, instance.flow_version)
	Steedos.subscribeFormVersion(instance.space, instance.form, instance.form_version)
	Steedos.subs["instance_data"].subscribe("instance_data", instance._id, Session.get("box"))
	Steedos.subs["Instance"].subscribe("flow", instance.space, instance.flow)
	if instance.distribute_from_instances
		Steedos.subs["Instance"].subscribe("cfs_instances", instance.distribute_from_instances)

Meteor.startup ()->
	Tracker.autorun (c) ->
		if Meteor.userId() and Steedos.spaceId()
			Steedos.subs["instances_draft"].clear()
			Steedos.subs["instances_draft"].subscribe "instances_draft", Steedos.spaceId()

	Tracker.autorun (c)->
		instanceId = Session.get("instanceId")
		#	Steedos.instanceSpace.clear(); # 清理已订阅数据
		if instanceId
			Steedos.subs["Instance"].subscribe("cfs_instances", [instanceId])

			instance = db.instances.findOne({_id: instanceId});
			if instance
				Steedos.subscribeInstance(instance);
			else
				Steedos.subs["instance_data"].subscribe("instance_data", instanceId, Session.get("box"))

	Tracker.autorun (c) ->
		if Steedos.subs["Instance"].ready() && Steedos.subs["instance_data"].ready()
			if Session.get("instanceId")
				instance = db.instances.findOne({_id: Session.get("instanceId")});
				if !instance
					console.error "instance not find ,id is instanceId"
					FlowRouter.go("/workflow/space/" + Session.get("spaceId") + "/" + Session.get("box") + "/")
					Session.set("instance_loading", false);
				else
	#				订阅相关文件
					if instance.related_instances && _.isArray(instance.related_instances)
						Steedos.subs["related_instances"].subscribe("related_instaces", instance._id, instance.related_instances)
					# 订阅流程正文模板
					if instance.state == 'draft'
						Steedos.subs["flow_main_attach_template"].subscribe("flow_main_attach_template", instance.space, instance.flow)
					

#	切换工作区时，清空按流程过滤
#Tracker.autorun (c)->
#	spaceId = Session.get("spaceId")
#	Session.set("flowId", undefined);

Steedos.instanceDataReload = (instanceId)->
	Steedos.subs["instance_data"].clear()
	# Steedos.subs["instance_data"].subscribe("instance_data", instanceId)


Steedos.subsSpace = new SubsManager();

Meteor.startup ()->
	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")

		Steedos.subsSpace.clear();
		if spaceId
			Steedos.subsSpace.subscribe("categories", spaceId)
			Steedos.subsSpace.subscribe("forms", spaceId)
			Steedos.subsSpace.subscribe("flows", spaceId)
			Steedos.subs["InstanceInbox"].subscribe("my_inbox_flow_instances_count", spaceId);

			Steedos.subsSpace.subscribe("space_user_signs", spaceId);

Steedos.subsForwardRelated = new SubsManager()

Meteor.startup ()->
	Tracker.autorun (c)->
		space_id = Session.get('space_drop_down_selected_value')
		distribute_optional_flows = Session.get('distribute_optional_flows')
		Steedos.subsForwardRelated.clear();
		if space_id
			Steedos.subsForwardRelated.subscribe("my_space_user", space_id);
			Steedos.subsForwardRelated.subscribe("my_organizations", space_id);
			Steedos.subsForwardRelated.subscribe("categories", space_id);
			Steedos.subsForwardRelated.subscribe("forms", space_id);
			Steedos.subsForwardRelated.subscribe("flows", space_id);
		if distribute_optional_flows
			Steedos.subsForwardRelated.subscribe("distribute_optional_flows", distribute_optional_flows);


Steedos.subsModules = new SubsManager();

Meteor.startup ()->
	Tracker.autorun (c)->
		user_id = Meteor.userId()
		Steedos.subsModules.clear();
		if user_id
			Steedos.subsModules.subscribe("modules");
