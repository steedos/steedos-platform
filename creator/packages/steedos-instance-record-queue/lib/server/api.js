var _eval = require('eval');
var isConfigured = false;
var sendWorker = function (task, interval) {

	if (InstanceRecordQueue.debug) {
		console.log('InstanceRecordQueue: Send worker started, using interval: ' + interval);
	}

	return Meteor.setInterval(function () {
		try {
			task();
		} catch (error) {
			console.log('InstanceRecordQueue: Error while sending: ' + error.message);
		}
	}, interval);
};

/*
	options: {
		// Controls the sending interval
		sendInterval: Match.Optional(Number),
		// Controls the sending batch size per interval
		sendBatchSize: Match.Optional(Number),
		// Allow optional keeping notifications in collection
		keepDocs: Match.Optional(Boolean)
	}
*/
InstanceRecordQueue.Configure = function (options) {
	var self = this;
	options = _.extend({
		sendTimeout: 60000, // Timeout period
	}, options);

	// Block multiple calls
	if (isConfigured) {
		throw new Error('InstanceRecordQueue.Configure should not be called more than once!');
	}

	isConfigured = true;

	// Add debug info
	if (InstanceRecordQueue.debug) {
		console.log('InstanceRecordQueue.Configure', options);
	}

	self.syncAttach = function (sync_attachment, insId, spaceId, newRecordId, objectName) {
		if (sync_attachment == "lastest") {
			cfs.instances.find({
				'metadata.instance': insId,
				'metadata.current': true
			}).forEach(function (f) {
				var newFile = new FS.File(),
					cmsFileId = Creator.getCollection('cms_files')._makeNewID();

				newFile.attachData(f.createReadStream('instances'), {
					type: f.original.type
				}, function (err) {
					if (err) {
						throw new Meteor.Error(err.error, err.reason);
					}
					newFile.name(f.name());
					newFile.size(f.size());
					var metadata = {
						owner: f.metadata.owner,
						owner_name: f.metadata.owner_name,
						space: spaceId,
						record_id: newRecordId,
						object_name: objectName,
						parent: cmsFileId
					};

					newFile.metadata = metadata;
					var fileObj = cfs.files.insert(newFile);
					if (fileObj) {
						Creator.getCollection('cms_files').insert({
							_id: cmsFileId,
							parent: {
								o: objectName,
								ids: [newRecordId]
							},
							size: fileObj.size(),
							name: fileObj.name(),
							extention: fileObj.extension(),
							space: spaceId,
							versions: [fileObj._id],
							owner: f.metadata.owner,
							created_by: f.metadata.owner,
							modified_by: f.metadata.owner
						})
					}
				})
			})
		} else if (sync_attachment == "all") {
			var parents = [];
			cfs.instances.find({
				'metadata.instance': insId
			}).forEach(function (f) {
				var newFile = new FS.File(),
					cmsFileId = f.metadata.parent;

				if (!parents.includes(cmsFileId)) {
					parents.push(cmsFileId);
					Creator.getCollection('cms_files').insert({
						_id: cmsFileId,
						parent: {
							o: objectName,
							ids: [newRecordId]
						},
						space: spaceId,
						versions: [],
						owner: f.metadata.owner,
						created_by: f.metadata.owner,
						modified_by: f.metadata.owner
					})
				}

				newFile.attachData(f.createReadStream('instances'), {
					type: f.original.type
				}, function (err) {
					if (err) {
						throw new Meteor.Error(err.error, err.reason);
					}
					newFile.name(f.name());
					newFile.size(f.size());
					var metadata = {
						owner: f.metadata.owner,
						owner_name: f.metadata.owner_name,
						space: spaceId,
						record_id: newRecordId,
						object_name: objectName,
						parent: cmsFileId
					};

					newFile.metadata = metadata;
					var fileObj = cfs.files.insert(newFile);
					if (fileObj) {

						if (f.metadata.current == true) {
							Creator.getCollection('cms_files').update(cmsFileId, {
								$set: {
									size: fileObj.size(),
									name: fileObj.name(),
									extention: fileObj.extension(),
								},
								$addToSet: {
									versions: fileObj._id
								}
							})
						} else {
							Creator.getCollection('cms_files').update(cmsFileId, {
								$addToSet: {
									versions: fileObj._id
								}
							})
						}
					}
				})
			})
		}
	}

	self.syncInsFields = ['name', 'submitter_name', 'applicant_name', 'applicant_organization_name', 'applicant_organization_fullname', 'state',
		'current_step_name', 'flow_name', 'category_name', 'submit_date', 'finish_date', 'final_decision', 'applicant_organization', 'applicant_company'
	];
	self.syncValues = function (field_map_back, values, ins, objectInfo, field_map_back_script, record) {
		var
			obj = {},
			tableFieldCodes = [],
			tableFieldMap = [];
			tableToRelatedMap = {};

		field_map_back = field_map_back || [];

		var spaceId = ins.space;

		var form = Creator.getCollection("forms").findOne(ins.form);
		var formFields = null;
		if (form.current._id === ins.form_version) {
			formFields = form.current.fields || [];
		} else {
			var formVersion = _.find(form.historys, function (h) {
				return h._id === ins.form_version;
			})
			formFields = formVersion ? formVersion.fields : [];
		}

		var objectFields = objectInfo.fields;
		var objectFieldKeys = _.keys(objectFields);
		var relatedObjects = Creator.getRelatedObjects(objectInfo.name,spaceId);
		var relatedObjectsKeys = _.pluck(relatedObjects, 'object_name');
		var formTableFields = _.filter(formFields, function(formField){
			return formField.type === 'table'
		});
		var formTableFieldsCode =  _.pluck(formTableFields, 'code');

		var getRelatedObjectField = function(key){
			return _.find(relatedObjectsKeys, function(relatedObjectsKey){
				return key.startsWith(relatedObjectsKey + '.');
			})
		};

		var getFormTableField = function (key) {
			return _.find(formTableFieldsCode, function(formTableFieldCode){
				return key.startsWith(formTableFieldCode + '.');
			})
		};

		var getFormField = function(_formFields, _fieldCode){
			var formField = null;
			_.each(_formFields, function (ff) {
				if (!formField) {
					if (ff.code === _fieldCode) {
						formField = ff;
					} else if (ff.type === 'section') {
						_.each(ff.fields, function (f) {
							if (!formField) {
								if (f.code === _fieldCode) {
									formField = f;
								}
							}
						})
					}else if (ff.type === 'table') {
						_.each(ff.fields, function (f) {
							if (!formField) {
								if (f.code === _fieldCode) {
									formField = f;
								}
							}
						})
					}
				}
			});
			return formField;
		}

		field_map_back.forEach(function (fm) {
			//workflow 的子表到creator object 的相关对象
			var relatedObjectField = getRelatedObjectField(fm.object_field);
			var formTableField = getFormTableField(fm.workflow_field);
			if (relatedObjectField){
				var oTableCode = fm.object_field.split('.')[0];
				var oTableFieldCode = fm.object_field.split('.')[1];
				var tableToRelatedMapKey = oTableCode;
				if(!tableToRelatedMap[tableToRelatedMapKey]){
					tableToRelatedMap[tableToRelatedMapKey] = {}
				}

				if(formTableField){
					var wTableCode = fm.workflow_field.split('.')[0];
					tableToRelatedMap[tableToRelatedMapKey]['_FROM_TABLE_CODE'] = wTableCode
				}

				tableToRelatedMap[tableToRelatedMapKey][oTableFieldCode] = fm.workflow_field
			}
			// 判断是否是子表字段
			else if (fm.workflow_field.indexOf('.$.') > 0 && fm.object_field.indexOf('.$.') > 0) {
				var wTableCode = fm.workflow_field.split('.$.')[0];
				var oTableCode = fm.object_field.split('.$.')[0];
				if (values.hasOwnProperty(wTableCode) && _.isArray(values[wTableCode])) {
					tableFieldCodes.push(JSON.stringify({
						workflow_table_field_code: wTableCode,
						object_table_field_code: oTableCode
					}));
					tableFieldMap.push(fm);
				}

			}
			else if (values.hasOwnProperty(fm.workflow_field)) {
				var wField = null;

				_.each(formFields, function (ff) {
					if (!wField) {
						if (ff.code === fm.workflow_field) {
							wField = ff;
						} else if (ff.type === 'section') {
							_.each(ff.fields, function (f) {
								if (!wField) {
									if (f.code === fm.workflow_field) {
										wField = f;
									}
								}
							})
						}
					}
				})

				var oField = objectFields[fm.object_field];

				if (oField) {
					if (!wField) {
						console.log('fm.workflow_field: ', fm.workflow_field)
					}
					// 表单选人选组字段 至 对象 lookup master_detail类型字段同步
					if (!wField.is_multiselect && ['user', 'group'].includes(wField.type) && !oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && ['users', 'organizations'].includes(oField.reference_to)) {
						obj[fm.object_field] = values[fm.workflow_field]['id'];
					}
					else if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to) && _.isString(values[fm.workflow_field])) {
						var oCollection = Creator.getCollection(oField.reference_to, spaceId)
						var referObject = Creator.getObject(oField.reference_to, spaceId)
						if (oCollection && referObject) {
							// 先认为此值是referObject _id字段值
							var referData = oCollection.findOne(values[fm.workflow_field], {
								fields: {
									_id: 1
								}
							});
							if (referData) {
								obj[fm.object_field] = referData._id;
							}

							// 其次认为此值是referObject NAME_FIELD_KEY值
							if (!referData) {
								var nameFieldKey = referObject.NAME_FIELD_KEY;
								var selector = {};
								selector[nameFieldKey] = values[fm.workflow_field];
								referData = oCollection.findOne(selector, {
									fields: {
										_id: 1
									}
								});
								if (referData) {
									obj[fm.object_field] = referData._id;
								}
							}

						}
					}
					else {
						if (oField.type === "boolean") {
							var tmp_field_value = values[fm.workflow_field];
							if (['true', '是'].includes(tmp_field_value)) {
								obj[fm.object_field] = true;
							} else if (['false', '否'].includes(tmp_field_value)) {
								obj[fm.object_field] = false;
							} else {
								obj[fm.object_field] = tmp_field_value;
							}
						}
						else if(['lookup', 'master_detail'].includes(oField.type) && wField.type === 'odata'){
							if(oField.multiple && wField.is_multiselect){
								obj[fm.object_field] = _.compact(_.pluck(values[fm.workflow_field], '_id'))
							}else if(!oField.multiple && !wField.is_multiselect){
								if(!_.isEmpty(values[fm.workflow_field])){
									obj[fm.object_field] = 	values[fm.workflow_field]._id
								}
							}else{
								obj[fm.object_field] = values[fm.workflow_field];
							}
						}
						else {
							obj[fm.object_field] = values[fm.workflow_field];
						}
					}
				} else {
					if (fm.object_field.indexOf('.') > -1) {
						var temObjFields = fm.object_field.split('.');
						if (temObjFields.length === 2) {
							var objField = temObjFields[0];
							var referObjField = temObjFields[1];
							var oField = objectFields[objField];
							if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to)) {
								var oCollection = Creator.getCollection(oField.reference_to, spaceId)
								if (oCollection && record && record[objField]) {
									var referSetObj = {};
									referSetObj[referObjField] = values[fm.workflow_field];
									oCollection.update(record[objField], {
										$set: referSetObj
									})
								}
							}
						}
					}
					// else{
					// 	var relatedObject = _.find(relatedObjects, function(_relatedObject){
					// 		return _relatedObject.object_name === fm.object_field
					// 	})
					//
					// 	if(relatedObject){
					// 		obj[fm.object_field] = values[fm.workflow_field];
					// 	}
					// }
				}

			}
			else {
				if (fm.workflow_field.startsWith('instance.')) {
					var insField = fm.workflow_field.split('instance.')[1];
					if (self.syncInsFields.includes(insField)) {
						if (fm.object_field.indexOf('.') < 0) {
							obj[fm.object_field] = ins[insField];
						} else {
							var temObjFields = fm.object_field.split('.');
							if (temObjFields.length === 2) {
								var objField = temObjFields[0];
								var referObjField = temObjFields[1];
								var oField = objectFields[objField];
								if (!oField.multiple && ['lookup', 'master_detail'].includes(oField.type) && _.isString(oField.reference_to)) {
									var oCollection = Creator.getCollection(oField.reference_to, spaceId)
									if (oCollection && record && record[objField]) {
										var referSetObj = {};
										referSetObj[referObjField] = ins[insField];
										oCollection.update(record[objField], {
											$set: referSetObj
										})
									}
								}
							}
						}
					}

				} else {
					if (ins[fm.workflow_field]) {
						obj[fm.object_field] = ins[fm.workflow_field];
					}
				}
			}
		})

		_.uniq(tableFieldCodes).forEach(function (tfc) {
			var c = JSON.parse(tfc);
			obj[c.object_table_field_code] = [];
			values[c.workflow_table_field_code].forEach(function (tr) {
				var newTr = {};
				_.each(tr, function (v, k) {
					tableFieldMap.forEach(function (tfm) {
						if (tfm.workflow_field == (c.workflow_table_field_code + '.$.' + k)) {
							var oTdCode = tfm.object_field.split('.$.')[1];
							newTr[oTdCode] = v;
						}
					})
				})
				if (!_.isEmpty(newTr)) {
					obj[c.object_table_field_code].push(newTr);
				}
			})
		});
		var relatedObjs = {};
		var getRelatedFieldValue = function(valueKey, parent) {
			return valueKey.split('.').reduce(function(o, x) {
				return o[x];
			}, parent);
		};
		_.each(tableToRelatedMap, function(map, key){
			var tableCode = map._FROM_TABLE_CODE;
			if(!tableCode){
				console.warn('tableToRelated: [' + key + '] missing corresponding table.')
			}else{
				var relatedObjectName = key;
				var relatedObjectValues = [];
				var relatedObject = Creator.getObject(relatedObjectName, spaceId);
				_.each(values[tableCode], function (tableValueItem) {
					var relatedObjectValue = {};
					_.each(map, function(valueKey, fieldKey){
						if(fieldKey != '_FROM_TABLE_CODE'){
							if(valueKey.startsWith('instance.')){
								relatedObjectValue[fieldKey] = getRelatedFieldValue(valueKey, {'instance': ins});
							}
							else{
								var relatedObjectFieldValue, formFieldKey;
								if(valueKey.startsWith(tableCode + '.')){
									formFieldKey = valueKey.split(".")[1];
									relatedObjectFieldValue = getRelatedFieldValue(valueKey, {[tableCode]:tableValueItem});
								}else{
									formFieldKey = valueKey;
									relatedObjectFieldValue = getRelatedFieldValue(valueKey, values)
								}
								var formField = getFormField(formFields, formFieldKey);
								var relatedObjectField = relatedObject.fields[fieldKey];
								if(formField.type == 'odata' && ['lookup', 'master_detail'].includes(relatedObjectField.type)){
									if(!_.isEmpty(relatedObjectFieldValue)){
										if(relatedObjectField.multiple && formField.is_multiselect){
											relatedObjectFieldValue = _.compact(_.pluck(relatedObjectFieldValue, '_id'))
										}else if(!relatedObjectField.multiple && !formField.is_multiselect){
											relatedObjectFieldValue = relatedObjectFieldValue._id
										}
									}
								}
								relatedObjectValue[fieldKey] = relatedObjectFieldValue;
							}
						}
					});
					relatedObjectValue['_table'] = {
						_id: tableValueItem["_id"],
						_code: tableCode
					};
					relatedObjectValues.push(relatedObjectValue);
				});
				relatedObjs[relatedObjectName] = relatedObjectValues;
			}
		})

		if (field_map_back_script) {
			_.extend(obj, self.evalFieldMapBackScript(field_map_back_script, ins));
		}
		// 过滤掉非法的key
		var filterObj = {};

		_.each(_.keys(obj), function (k) {
			if (objectFieldKeys.includes(k)) {
				filterObj[k] = obj[k];
			}
			// else if(relatedObjectsKeys.includes(k) && _.isArray(obj[k])){
			// 	if(_.isArray(relatedObjs[k])){
			// 		relatedObjs[k] = relatedObjs[k].concat(obj[k])
			// 	}else{
			// 		relatedObjs[k] = obj[k]
			// 	}
			// }
		})
		return {
			mainObjectValue: filterObj,
			relatedObjectsValue: relatedObjs
		};
	}

	self.evalFieldMapBackScript = function (field_map_back_script, ins) {
		var script = "module.exports = function (instance) { " + field_map_back_script + " }";
		var func = _eval(script, "field_map_script");
		var values = func(ins);
		if (_.isObject(values)) {
			return values;
		} else {
			console.error("evalFieldMapBackScript: 脚本返回值类型不是对象");
		}
		return {}
	}

	self.syncRelatedObjectsValue = function(mainRecordId, relatedObjects, relatedObjectsValue, spaceId, ins){
		var insId = ins._id;

		_.each(relatedObjects, function(relatedObject){
			var objectCollection = Creator.getCollection(relatedObject.object_name, spaceId);
			var tableMap = {};
			_.each(relatedObjectsValue[relatedObject.object_name], function(relatedObjectValue){
				var table_id = relatedObjectValue._table._id;
				var table_code = relatedObjectValue._table._code;
				if(!tableMap[table_code]){
					tableMap[table_code] = []
				};
				tableMap[table_code].push(table_id);
				var oldRelatedRecord = Creator.getCollection(relatedObject.object_name, spaceId).findOne({[relatedObject.foreign_key]: mainRecordId, "instances._id": insId, _table: relatedObjectValue._table}, {fields: {_id:1}})
				if(oldRelatedRecord){
					Creator.getCollection(relatedObject.object_name, spaceId).update({_id: oldRelatedRecord._id}, {$set: relatedObjectValue})
				}else{
					relatedObjectValue[relatedObject.foreign_key] = mainRecordId;
					relatedObjectValue.space = spaceId;
					relatedObjectValue.owner = ins.applicant;
					relatedObjectValue.created_by = ins.applicant;
					relatedObjectValue.modified_by = ins.applicant;
					relatedObjectValue._id = objectCollection._makeNewID();
					var instance_state = ins.state;
					if (ins.state === 'completed' && ins.final_decision) {
						instance_state = ins.final_decision;
					}
					relatedObjectValue.instances = [{
						_id: insId,
						state: instance_state
					}];
					relatedObjectValue.instance_state = instance_state;
					Creator.getCollection(relatedObject.object_name, spaceId).insert(relatedObjectValue, {validate: false, filter: false})
				}
			})
			//清理申请单上被删除子表记录对应的相关表记录
			_.each(tableMap, function(tableIds, tableCode){
				objectCollection.remove({
					[relatedObject.foreign_key]: mainRecordId,
					"instances._id": insId,
					"_table._code": tableCode,
					"_table._id": {$nin: tableIds}
				})
			})
		});

		tableIds = _.compact(tableIds);


	}

	self.sendDoc = function (doc) {
		if (InstanceRecordQueue.debug) {
			console.log("sendDoc");
			console.log(doc);
		}

		var insId = doc.info.instance_id,
			records = doc.info.records;
		var fields = {
			flow: 1,
			values: 1,
			applicant: 1,
			space: 1,
			form: 1,
			form_version: 1,
			traces: 1
		};
		self.syncInsFields.forEach(function (f) {
			fields[f] = 1;
		})
		var ins = Creator.getCollection('instances').findOne(insId, {
			fields: fields
		});
		var values = ins.values,
			spaceId = ins.space;

		if (records && !_.isEmpty(records)) {
			// 此情况属于从creator中发起审批，或者已经从Apps同步到了creator
			var objectName = records[0].o;
			var ow = Creator.getCollection('object_workflows').findOne({
				object_name: objectName,
				flow_id: ins.flow
			});
			var
				objectCollection = Creator.getCollection(objectName, spaceId),
				sync_attachment = ow.sync_attachment;
			var objectInfo = Creator.getObject(objectName, spaceId);
			objectCollection.find({
				_id: {
					$in: records[0].ids
				}
			}).forEach(function (record) {
				try {
					var syncValues = self.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, record)
					var setObj = syncValues.mainObjectValue;

					var instance_state = ins.state;
					if (ins.state === 'completed' && ins.final_decision) {
						instance_state = ins.final_decision;
					}
					setObj['instances.$.state'] = setObj.instance_state = instance_state;

					objectCollection.update({
						_id: record._id,
						'instances._id': insId
					}, {
						$set: setObj
					})

					var relatedObjects = Creator.getRelatedObjects(ow.object_name, spaceId);
					var relatedObjectsValue = syncValues.relatedObjectsValue;
					self.syncRelatedObjectsValue(record._id, relatedObjects, relatedObjectsValue, spaceId, ins);


					// 以最终申请单附件为准，旧的record中附件删除
					Creator.getCollection('cms_files').remove({
						'parent': {
							o: objectName,
							ids: [record._id]
						}
					})
					cfs.files.remove({
						'metadata.record_id': record._id
					})
					// 同步新附件
					self.syncAttach(sync_attachment, insId, record.space, record._id, objectName);
				} catch (error) {
					console.error(error.stack);
					objectCollection.update({
						_id: record._id,
						'instances._id': insId
					}, {
						$set: {
							'instances.$.state': 'pending',
							'instance_state': 'pending'
						}
					})

					Creator.getCollection('cms_files').remove({
						'parent': {
							o: objectName,
							ids: [record._id]
						}
					})
					cfs.files.remove({
						'metadata.record_id': record._id
					})

					throw new Error(error);
				}

			})
		} else {
			// 此情况属于从apps中发起审批
			Creator.getCollection('object_workflows').find({
				flow_id: ins.flow
			}).forEach(function (ow) {
				try {
					var
						objectCollection = Creator.getCollection(ow.object_name, spaceId),
						sync_attachment = ow.sync_attachment,
						newRecordId = objectCollection._makeNewID(),
						objectName = ow.object_name;

					var objectInfo = Creator.getObject(ow.object_name, spaceId);
					var syncValues = self.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script);
					var newObj = syncValues.mainObjectValue;

					newObj._id = newRecordId;
					newObj.space = spaceId;
					newObj.name = newObj.name || ins.name;

					var instance_state = ins.state;
					if (ins.state === 'completed' && ins.final_decision) {
						instance_state = ins.final_decision;
					}
					newObj.instances = [{
						_id: insId,
						state: instance_state
					}];
					newObj.instance_state = instance_state;

					newObj.owner = ins.applicant;
					newObj.created_by = ins.applicant;
					newObj.modified_by = ins.applicant;
					var r = objectCollection.insert(newObj);
					if (r) {
						Creator.getCollection('instances').update(ins._id, {
							$push: {
								record_ids: {
									o: objectName,
									ids: [newRecordId]
								}
							}
						})
						var relatedObjects = Creator.getRelatedObjects(ow.object_name,spaceId);
						var relatedObjectsValue = syncValues.relatedObjectsValue;
						self.syncRelatedObjectsValue(newRecordId, relatedObjects, relatedObjectsValue, spaceId, ins);
						// workflow里发起审批后，同步时也可以修改相关表的字段值 #1183
						var record = objectCollection.findOne(newRecordId);
						self.syncValues(ow.field_map_back, values, ins, objectInfo, ow.field_map_back_script, record);
					}

					// 附件同步
					self.syncAttach(sync_attachment, insId, spaceId, newRecordId, objectName);

				} catch (error) {
					console.error(error.stack);

					objectCollection.remove({
						_id: newRecordId,
						space: spaceId
					});
					Creator.getCollection('instances').update(ins._id, {
						$pull: {
							record_ids: {
								o: objectName,
								ids: [newRecordId]
							}
						}
					})
					Creator.getCollection('cms_files').remove({
						'parent': {
							o: objectName,
							ids: [newRecordId]
						}
					})
					cfs.files.remove({
						'metadata.record_id': newRecordId
					})

					throw new Error(error);
				}

			})
		}

		InstanceRecordQueue.collection.update(doc._id, {
			$set: {
				'info.sync_date': new Date()
			}
		})

	}

	// Universal send function
	var _querySend = function (doc) {

		if (self.sendDoc) {
			self.sendDoc(doc);
		}

		return {
			doc: [doc._id]
		};
	};

	self.serverSend = function (doc) {
		doc = doc || {};
		return _querySend(doc);
	};


	// This interval will allow only one doc to be sent at a time, it
	// will check for new docs at every `options.sendInterval`
	// (default interval is 15000 ms)
	//
	// It looks in docs collection to see if theres any pending
	// docs, if so it will try to reserve the pending doc.
	// If successfully reserved the send is started.
	//
	// If doc.query is type string, it's assumed to be a json string
	// version of the query selector. Making it able to carry `$` properties in
	// the mongo collection.
	//
	// Pr. default docs are removed from the collection after send have
	// completed. Setting `options.keepDocs` will update and keep the
	// doc eg. if needed for historical reasons.
	//
	// After the send have completed a "send" event will be emitted with a
	// status object containing doc id and the send result object.
	//
	var isSendingDoc = false;

	if (options.sendInterval !== null) {

		// This will require index since we sort docs by createdAt
		InstanceRecordQueue.collection._ensureIndex({
			createdAt: 1
		});
		InstanceRecordQueue.collection._ensureIndex({
			sent: 1
		});
		InstanceRecordQueue.collection._ensureIndex({
			sending: 1
		});


		var sendDoc = function (doc) {
			// Reserve doc
			var now = +new Date();
			var timeoutAt = now + options.sendTimeout;
			var reserved = InstanceRecordQueue.collection.update({
				_id: doc._id,
				sent: false, // xxx: need to make sure this is set on create
				sending: {
					$lt: now
				}
			}, {
				$set: {
					sending: timeoutAt,
				}
			});

			// Make sure we only handle docs reserved by this
			// instance
			if (reserved) {

				// Send
				var result = InstanceRecordQueue.serverSend(doc);

				if (!options.keepDocs) {
					// Pr. Default we will remove docs
					InstanceRecordQueue.collection.remove({
						_id: doc._id
					});
				} else {

					// Update
					InstanceRecordQueue.collection.update({
						_id: doc._id
					}, {
						$set: {
							// Mark as sent
							sent: true,
							// Set the sent date
							sentAt: new Date(),
							// Not being sent anymore
							sending: 0
						}
					});

				}

				// // Emit the send
				// self.emit('send', {
				// 	doc: doc._id,
				// 	result: result
				// });

			} // Else could not reserve
		}; // EO sendDoc

		sendWorker(function () {

			if (isSendingDoc) {
				return;
			}
			// Set send fence
			isSendingDoc = true;

			var batchSize = options.sendBatchSize || 1;

			var now = +new Date();

			// Find docs that are not being or already sent
			var pendingDocs = InstanceRecordQueue.collection.find({
				$and: [
					// Message is not sent
					{
						sent: false
					},
					// And not being sent by other instances
					{
						sending: {
							$lt: now
						}
					},
					// And no error
					{
						errMsg: {
							$exists: false
						}
					}
				]
			}, {
				// Sort by created date
				sort: {
					createdAt: 1
				},
				limit: batchSize
			});

			pendingDocs.forEach(function (doc) {
				try {
					sendDoc(doc);
				} catch (error) {
					console.error(error.stack);
					console.log('InstanceRecordQueue: Could not send doc id: "' + doc._id + '", Error: ' + error.message);
					InstanceRecordQueue.collection.update({
						_id: doc._id
					}, {
						$set: {
							// error message
							errMsg: error.message
						}
					});
				}
			}); // EO forEach

			// Remove the send fence
			isSendingDoc = false;
		}, options.sendInterval || 15000); // Default every 15th sec

	} else {
		if (InstanceRecordQueue.debug) {
			console.log('InstanceRecordQueue: Send server is disabled');
		}
	}

};