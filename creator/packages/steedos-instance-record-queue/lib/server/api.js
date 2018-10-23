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
		'current_step_name', 'flow_name', 'category_name', 'submit_date', 'finish_date', 'final_decision'
	];
	self.syncValues = function (obj, field_map, values, ins) {
		var
			tableFieldCodes = [],
			tableFieldMap = [];

		field_map.forEach(function (fm) {
			// 判断是否是子表字段
			if (fm.workflow_field.indexOf('.$.') > 0 && fm.object_field.indexOf('.$.') > 0) {
				var wTableCode = fm.workflow_field.split('.$.')[0];
				var oTableCode = fm.object_field.split('.$.')[0];
				if (values.hasOwnProperty(wTableCode) && _.isArray(values[wTableCode])) {
					tableFieldCodes.push(JSON.stringify({
						workflow_table_field_code: wTableCode,
						object_table_field_code: oTableCode
					}));
					tableFieldMap.push(fm);
				}

			} else if (values.hasOwnProperty(fm.workflow_field)) {
				obj[fm.object_field] = values[fm.workflow_field];
			} else{
				if (fm.workflow_field.startsWith('instance.')) {
					var insField = fm.workflow_field.split('instance.')[1];
					if (self.syncInsFields.includes(insField))
						obj[fm.object_field] = ins[insField];
				}else{
					if(ins[fm.workflow_field]){
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
		})

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
			applicant: 1
		};
		self.syncInsFields.forEach(function (f) {
			fields[f] = 1;
		})
		var ins = Creator.getCollection('instances').findOne(insId, {
			fields: fields
		});
		var values = ins.values;

		if (records) {
			// 此情况属于从creator中发起审批
			var objectName = records[0].o;
			var ow = Creator.getCollection('object_workflows').findOne({
				object_name: objectName,
				flow_id: ins.flow
			});
			var
				objectCollection = Creator.getCollection(objectName),
				sync_attachment = ow.sync_attachment;
			objectCollection.find({
				_id: {
					$in: records[0].ids
				}
			}).forEach(function (record) {
				// 附件同步
				try {
					var setObj = {};

					self.syncValues(setObj, ow.field_map, values, ins);

					setObj['instances.$.state'] = 'completed';

					objectCollection.update({
						_id: record._id,
						'instances._id': insId
					}, {
						$set: setObj
					})
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
					objectCollection.update({
						_id: record._id,
						'instances._id': insId
					}, {
						$set: {
							'instances.$.state': 'pending'
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
					var newObj = {},
						objectCollection = Creator.getCollection(ow.object_name),
						sync_attachment = ow.sync_attachment,
						newRecordId = objectCollection._makeNewID(),
						spaceId = ow.space,
						objectName = ow.object_name;

					self.syncValues(newObj, ow.field_map, values, ins);

					newObj._id = newRecordId;
					newObj.space = spaceId;
					newObj.name = ins.name;
					newObj.instances = [{
						_id: insId,
						state: 'completed'
					}];
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
					}

					// 附件同步
					self.syncAttach(sync_attachment, insId, spaceId, newRecordId, objectName);

				} catch (error) {

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