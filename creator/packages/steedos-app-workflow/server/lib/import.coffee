steedosImport = {}

_formatFieldsID = (fields)->
	_.each(fields,  (f)->
		if (!f._id && f.id)
			f._id = f.id;
			delete f.id;
			if (f.type == 'section' || f.type == 'table')
				_formatFieldsID(f.fields);
	);
	return fields;

upgradeFlowByForm = (flow, formVersionId, options)->
	flowCollection = Creator.getCollection('flows');
	up = false;
	now = options.now
	currentUserId = options.currentUserId
	spaceId = options.spaceId
	if (Creator.getCollection('instances').find({
		space: spaceId,
		flow: flow._id,
		flow_version: flow.current._id
	}).count())
		up = true;

	flowUpdateObj = {
		$set: {}
	};

	if up == true && flow.current.start_date
		flowUpdateObj.$push = {
			'historys': flow.current
		};

		flowCurrent = {
			'_id': flowCollection._makeNewID(),
			'created': now,
			'created_by': currentUserId,
			'steps': flow.current.steps,
			'_rev': flow.current._rev + 1,
			'flow': flow._id,
			'form_version': formVersionId,
			'modified': now,
			'modified_by': currentUserId
		};

		if flow.state == "enabled"
			flowCurrent.start_date = now;
		flowUpdateObj.$set['current'] = flowCurrent;
	else
		flowUpdateObj.$set = {
			'current.form_version': formVersionId,
			'current.modified': now,
			'current.modified_by': currentUserId
		}

	flowUpdateObj.$set['modified'] = now;
	flowUpdateObj.$set['modified_by'] = currentUserId;
	flowCollection.update(flow._id, flowUpdateObj);

upgradeForm = (formId, form, currentUserId, spaceId)->
	formCollection = Creator.getCollection('forms');
	flowCollection = Creator.getCollection('flows');
	ff = formCollection.findOne({_id: formId, space: spaceId});

	if !ff
		throw new Meteor.Error('error', "无效的formId")

	spaceId = ff.space;
	now = new Date();
	current = {};
	formUpdateObj = {};

	pass = false;

	# 根据APP 判断表单当前版本是否走过申请单 或者 records
	if ff.app == 'workflow'
		insCount = Creator.getCollection('instances').find({
			space: spaceId,
			form: formId,
			'form_version': form['current']['id']
		}).count();

		if insCount > 0
			pass = true
	else if ff.app == 'creator'
		recordsCount = Creator.getCollection('records').find({
			space: spaceId,
			form: formId,
			'form_version': form['current']['id']
		}).count();
		if recordsCount > 0
			pass = true;

	if pass == true && ff["current"]["start_date"]
		formUpdateObj.$push = {
			'historys': ff["current"]
		};
		current._id = formCollection._makeNewID();
		current._rev = ff["current"]["_rev"] + 1;
		current.created = now;
		current.created_by = currentUserId;

		if ff.state == 'enabled'
			current.start_date = now;
		flowCollection.find({form: formId}).forEach (flow)->
			upgradeFlowByForm(flow, current._id, {now: now, currentUserId: currentUserId, spaceId: spaceId})

	else
		current = ff.current;

	current.modified = now;
	current.modified_by = currentUserId;
	current.form = formId;
	current.fields = _formatFieldsID(form["current"]["fields"]);
	current.form_script = form["current"]["form_script"];
	current.name_forumla = form["current"]["name_forumla"];

	formUpdateObj.$set = {
		'current': current,
		'name': form["name"],
		'modified': now,
		'modified_by': currentUserId,
		'is_valid': form["is_valid"],
		'description': form["description"],
		'help_text': form["help_text"],
		'error_message': form["error_message"],
		'category': form["category"],
		'instance_style': form["instance_style"]
	}

	formCollection.update(formId, formUpdateObj);

upgradeFlow = (flowCome, userId, flowId)->

	now = new Date();
	flowCollection = Creator.getCollection('flows');
	formCollection = Creator.getCollection('forms');
	flow = flowCollection.findOne(flowId);
	spaceId = flow.space

	# 某步骤被删除后，删除同流程的“指定历史步骤”属性中被引用的步骤id（仅限于流程的最新版)
	clientStepIds = []

	_.each(flowCome['current']['steps'], (step) ->
		clientStepIds.push(step['id']);
	)

	_.each(flowCome['current']['steps'],  (step) ->
		if (step['approver_step'])
			if (!clientStepIds.includes(step['approver_step']))
				step['approver_step'] = '';
	)

	# 流程升级
	# 由于前台后台posx posy timeout_hours字段类型不一致会导致流程升级 所以在这里统一转为后台Float类型 便于比较
	_.each(flowCome['current']['steps'],  (st) ->
		st['posx'] = parseFloat(st['posx']);
		st['posy'] = parseFloat(st['posy']);
		if (st['timeout_hours'])
			st['timeout_hours'] = parseFloat(st['timeout_hours']);

	)

	# 由于前台传的是id而非_id，故比较时将id转为_id
	_.each(flowCome['current']['steps'],  (step) ->
		if step['id']
			step['_id'] = step['id'];
			delete step['id'];
		if (step['lines'])
			_.each(step['lines'],  (line) ->
				if line['id']
					line['_id'] = line['id'];
					delete line['id'];
			)
	)

	stepsStr = JSON.stringify(flow['current']['steps']);
	flowComeStepsStr = JSON.stringify(flowCome['current']['steps']);
	pass = false;
	updateObj = {
		$set: {}
	};


	insCount = Creator.getCollection('instances').find({
		space: spaceId,
		flow: flowId,
		flow_version: flow.current._id
	}).count();

	if (insCount > 0)
		pass = true;

	if pass == true && flow.current.start_date && stepsStr == flowComeStepsStr
		updateObj.$push = {
			'historys': flow.current
		};
		current = {
			'_id': flowCollection._makeNewID(),
			'modified': now,
			'modified_by': userId,
			'created': now,
			'created_by': userId,
			'steps': flowCome['current']['steps'],
			'form_version': flow.current.form_version,
			'_rev': flow.current._rev,
			'flow': flowId,
		};

		if (flow.state == 'enabled')
			current['start_date'] = now;

		updateObj.$set.current = current;
	else
		updateObj.$set = {
			'current.modified': now,
			'current.modified_by': userId,
			'current.steps': flowCome["current"]["steps"]
		}

	updateObj.$set.name = flowCome['name'];
	updateObj.$set.name_formula = '';
	updateObj.$set.code_formula = '';
	updateObj.$set.is_valid = flowCome['is_valid'];
	updateObj.$set.flowtype = flowCome['flowtype'];
	updateObj.$set.help_text = flowCome['help_text'];
	updateObj.$set.decription = flowCome['descriptions'];
	updateObj.$set.error_message = flowCome['error_message'];
	updateObj.$set.modified = now;
	updateObj.$set.modified_by = userId;

	#流程权限保持不变
#	if (flowCome['perms'])
#		flowCome['perms']['_id'] = flowCome['perms']['id'];
#		delete flowCome['perms']['id'];
#		updateObj.$set.perms = flowCome['perms'];

	# flow对象上添加categoryId
	form = formCollection.findOne(flow.form, {
		fields: {
			category: 1
		}
	});
	updateObj.$set.category = form['category'];

	flowCollection.update(flowId, updateObj);

steedosImport.workflow = (uid, spaceId, form, enabled, company_id, options)->

	upgrade = options?.upgrade || false
	upgradeFormId = options?.formId
	upgradeFlowId = options?.flowId

	if _.isEmpty(form)
		throw new Meteor.Error('error', "无效的json data")

	if company_id
		if Creator.getCollection("company").find({ _id: company_id, space: spaceId }).count() == 0
			throw new Meteor.Error('error', "无效的字段: company_id")

	new_form_ids = new Array()

	new_flow_ids = new Array()
	try
		if form?.category_name
			category = db.categories.findOne({space: spaceId, name: form.category_name}, {fields: {_id: 1}})

			if _.isEmpty(category)
				category_id = new Mongo.ObjectID()._str;
				new_category = {
					_id: category_id,
					name: form.category_name,
					space: spaceId,
					created: new Date,
					created_by: uid,
					modified: new Date,
					modified_by: uid,
					owner: uid
				}
				if company_id
					new_category.company_id = company_id
				db.categories.direct.insert(new_category);
				form.category = category_id
			else
				form.category = category._id

			delete form.category_name

		if form?.instance_number_rules
			form.instance_number_rules.forEach (nr)->
				try
					rules = db.instance_number_rules.findOne({space: spaceId, "name": nr.name})

					if !rules
						nr.space = spaceId
						nr._id = new Mongo.ObjectID()._str
						nr.created = new Date
						nr.created_by = uid
						nr.modified = new Date
						nr.modified_by = uid
						if company_id
							nr.company_id = company_id
						db.instance_number_rules.direct.insert(nr)
				catch e
					console.log "steedosImport.workflow", e

			delete form.instance_number_rules

		form_id = new Mongo.ObjectID()._str

		flows = form.flows

		delete form.flows

		form._id = form_id

		form.space = spaceId
		if enabled
			form.state = 'enabled'
			form.is_valid = true #直接启用的表单设置is valid值为true
		else
			form.state = 'disabled' #设置状态为 未启用
			form.is_valid = true #设置已验证为 true , 简化用户操作

		form.created = new Date()

		form.created_by = uid

		form.modified = form.created

		form.modified_by = uid

		form.historys = []

		form.current._id = new Mongo.ObjectID()._str

		form.current._rev = 1 #重置版本号

		form.current.form = form_id

		form.current.created = new Date()

		form.current.created_by = uid

		form.current.modified = new Date()

		form.current.modified_by = uid

		delete form.company_id
		if company_id
			form.company_id = company_id

		form.import = true

		form.owner = uid

		if upgrade
			upgradeForm(upgradeFormId, form, uid, spaceId)
		else
			db.forms.direct.insert(form)
			new_form_ids.push(form_id)

		flows.forEach (flow)->
			flow_id = new Mongo.ObjectID()._str

			flow._id = flow_id

			flow.form = form_id

			if enabled
				flow.state = 'enabled'
				flow.is_valid = true #直接启用的流程设置is valid值为true
			else
				flow.state = 'disabled' #设置状态为 未启用
				flow.is_valid = true

			flow.current_no = 0 #重置编号起始为0

			flow.created = new Date()

			flow.created_by = uid

			flow.modified = flow.created

			flow.modified_by = uid

			delete flow.company_id
			if company_id
				flow.company_id = company_id
			#跨工作区导入时，重置流程权限perms
			if !flow.perms || flow.space !=  spaceId || company_id
				orgs_can_add = []
				if company_id
					orgs_can_add = [company_id]
				else
					orgs_can_add = db.organizations.find({
						space: spaceId,
						parent: null
					}, {fields: {_id: 1}}).fetch().getProperty("_id")
				#设置提交部门为：全公司
				perms = {
					_id: new Mongo.ObjectID()._str
					users_can_add: []
					orgs_can_add: orgs_can_add
					users_can_monitor: []
					orgs_can_monitor: []
					users_can_admin: []
					orgs_can_admin: []
				}

				flow.perms = perms

			flow.space = spaceId

			flow.current._id = new Mongo.ObjectID()._str

			flow.current.flow = flow_id

			flow.current._rev = 1 #重置版本

			flow.current.form_version = form.current._id

			flow.current.created = new Date()

			flow.current.created_by = uid

			flow.current.modified = new Date()

			flow.current.modified_by = uid

			flow.current?.steps.forEach (step)->
				if _.isArray(step.approver_users)
					_accepted_approve_users = [];
					_.each step.approver_users, (uid)->
						if db.space_users.findOne({user: uid, user_accepted: true, space: spaceId})
							_accepted_approve_users.push(uid);
					step.approver_users = _accepted_approve_users;

				if _.isArray(step.approver_orgs)
					_accepted_approver_orgs = [];
					_.each step.approver_orgs, (oid)->
						if db.organizations.findOne({_id: oid, space: spaceId})
							_accepted_approver_orgs.push(oid);
					step.approver_orgs = _accepted_approver_orgs;

				if _.isEmpty(step.approver_roles_name)
					delete step.approver_roles_name
					if _.isEmpty(step.approver_roles)
						step.approver_roles = []
					if !_.isEmpty(step.approver_hr_roles_name)
						approver_hr_roles = new Array()
						step.approver_hr_roles_name.forEach (role_name) ->
							role_query = {space: spaceId, name: role_name}
							role = db.roles.findOne(role_query, {fields: {_id: 1}})
							if _.isEmpty(role)
								role_id = db.roles._makeNewID()
								role = {
									_id: role_id
									name: role_name
									space: spaceId
									created: new Date
									created_by: uid
									owner: uid
								}

								db.roles.direct.insert(role)

								approver_hr_roles.push(role_id)
							else
								approver_hr_roles.push(role._id)

						step.approver_hr_roles = approver_hr_roles

						delete step.approver_roles_name
				else
					approve_roles = new Array();
					approveRolesByIds = [];
					if _.isArray(step.approver_roles) && !_.isEmpty(step.approver_roles)
						approveRolesByIds = db.flow_roles.find({_id: {$in: step.approver_roles}, space: spaceId}, {fields: {_id: 1, name: 1, company_id: 1}}).fetch()
					step.approver_roles_name.forEach (role_name, _index) ->
						approveRoleById = _.find approveRolesByIds, (_role)->
							return _role._id == step.approver_roles[_index]
						flow_role_query = {space: spaceId, name: role_name}

						if approveRoleById?.company_id && company_id
							flow_role_query.company_id = company_id
						else
							flow_role_query.company_id = {$exists: false}

						role = db.flow_roles.findOne(flow_role_query, {fields: {_id: 1}})
						if _.isEmpty(role)
							role_id = db.flow_roles._makeNewID()
							role = {
								_id: role_id
								name: role_name
								space: spaceId
								created: new Date
								created_by: uid
								owner: uid
							}

							if company_id
								role.company_id = company_id

							db.flow_roles.direct.insert(role)

							approve_roles.push(role_id)
						else
							approve_roles.push(role._id)

					step.approver_roles = approve_roles

					delete step.approver_roles_name

			flow.import = true

			flow.owner = uid

			if upgrade
				upgradeFlow(flow, uid, upgradeFlowId)
			else
				db.flows.direct.insert(flow)
				new_flow_ids.push(flow_id)

		return new_flow_ids;
	catch e
		new_form_ids.forEach (id)->
			db.forms.direct.remove(id)

		new_flow_ids.forEach (id)->
			db.flows.direct.remove(id)
		throw  e





