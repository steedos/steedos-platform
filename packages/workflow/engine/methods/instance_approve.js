const {
    update_instance_tasks,
    update_many_instance_tasks,
} = require('../manager').instance_tasks_manager
module.exports = {
    set_approve_have_read: function (instanceId, traceId, approveId) {
        var instance, ref, self, setObj, trace;
        if (!this.userId) {
            return;
        }
        self = this;
        instance = db.instances.findOne({
            _id: instanceId,
            "traces._id": traceId
        }, {
            fields: {
                "traces.$": 1
            }
        });
        if ((instance != null ? (ref = instance.traces) != null ? ref.length : void 0 : void 0) > 0) {
            trace = instance.traces[0];
            setObj = {
                modified: new Date,
                modified_by: self.userId
            };
            let key_str = ''
            const approveDoc = {}
            trace.approves.forEach(function (approve, idx) {
                if (approve._id === approveId && !approve.is_read) {
                    key_str = `traces.$.approves.${idx}.`;
                    // setObj[`traces.$.approves.${idx}.is_read`] = true;
                    // return setObj[`traces.$.approves.${idx}.read_date`] = new Date();
                    approveDoc[`is_read`] = true;
                    approveDoc[`read_date`] = new Date();
                }
            });
            if (!_.isEmpty(approveDoc) && key_str) {
                for (const key in approveDoc) {
                    if (Object.hasOwnProperty.call(approveDoc, key)) {
                        setObj[key_str + key] = approveDoc[key]
                    }
                }
                db.instances.update({
                    _id: instanceId,
                    "traces._id": traceId
                }, {
                    $set: setObj
                });
                update_instance_tasks(instanceId, traceId, approveId, approveDoc)
            }
            return true;
        }
    },
    change_approve_info: function (instanceId, traceId, approveId, description, finish_date) {
        var instance, ref, setObj, trace;
        if (!this.userId) {
            return;
        }
        check(instanceId, String);
        check(traceId, String);
        check(approveId, String);
        check(description, String);
        check(finish_date, Date);
        instance = db.instances.findOne({
            _id: instanceId,
            "traces._id": traceId
        }, {
            fields: {
                "traces.$": 1
            }
        });
        if ((instance != null ? (ref = instance.traces) != null ? ref.length : void 0 : void 0) > 0) {
            trace = instance.traces[0];
            setObj = {};
            let key_str = ''
            const approveDoc = {}
            trace.approves.forEach(function (approve, idx) {
                if (approve._id === approveId) {
                    setObj['change_time'] = new Date();
                    key_str = `traces.$.approves.${idx}.`
                    // setObj[`traces.$.approves.${idx}.description`] = description;
                    // setObj[`traces.$.approves.${idx}.finish_date`] = finish_date;
                    // setObj[`traces.$.approves.${idx}.cost_time`] = new Date() - approve.start_date;
                    // return setObj[`traces.$.approves.${idx}.read_date`] = new Date();
                    approveDoc[`description`] = description;
                    approveDoc[`finish_date`] = finish_date;
                    approveDoc[`cost_time`] = new Date() - approve.start_date;
                    approveDoc[`read_date`] = new Date();
                }
            });
            if (!_.isEmpty(setObj)) {
                for (const key in approveDoc) {
                    if (Object.hasOwnProperty.call(approveDoc, key)) {
                        setObj[key_str + key] = approveDoc[key]
                    }
                }
                db.instances.update({
                    _id: instanceId,
                    "traces._id": traceId
                }, {
                    $set: setObj
                });
                update_instance_tasks(instanceId, traceId, approveId, approveDoc)
            }
            return true;
        }
    },
    update_approve_sign: function (instanceId, traceId, approveId, sign_field_code, description, sign_type, lastSignApprove) {
        var currentApproveDescription, currentStep, currentTrace, ins, instance, ref, ref1, ref2, ref3, session_userId, showBlankApproveDescription, trace, traces, trimDescription, upObj;
        check(instanceId, String);
        check(traceId, String);
        check(approveId, String);
        check(sign_field_code, String);
        check(description, String);
        if (!this.userId) {
            return;
        }
        trimDescription = description.trim();
        showBlankApproveDescription = (ref = Steedos.settings.public.workflow) != null ? ref.showBlankApproveDescription : void 0;
        session_userId = this.userId;
        if (lastSignApprove) {
            if (((ref1 = Steedos.settings.public.workflow) != null ? ref1.keepLastSignApproveDescription : void 0) !== false) {
                if (lastSignApprove.custom_sign_show) {
                    return;
                }
            }
        }
        instance = db.instances.findOne({
            _id: instanceId,
            "traces._id": traceId
        }, {
            fields: {
                "traces.$": 1
            }
        });
        if ((instance != null ? (ref2 = instance.traces) != null ? ref2.length : void 0 : void 0) > 0) {
            trace = instance.traces[0];
            upObj = {};
            currentApproveDescription = '';
            const approveDoc = {}
            let key_str = ''
            trace.approves.forEach(function (approve, idx) {
                if (approve._id === approveId) {
                    key_str = `traces.$.approves.${idx}.`
                    currentApproveDescription = approve.description;
                    if (sign_field_code) {
                        upObj[`traces.$.approves.${idx}.sign_field_code`] = sign_field_code;
                    }
                    // upObj[`traces.$.approves.${idx}.description`] = description;
                    // upObj[`traces.$.approves.${idx}.sign_show`] = trimDescription || showBlankApproveDescription ? true : false;
                    // upObj[`traces.$.approves.${idx}.modified`] = new Date();
                    // upObj[`traces.$.approves.${idx}.modified_by`] = session_userId;
                    // return upObj[`traces.$.approves.${idx}.read_date`] = new Date();
                    approveDoc[`description`] = description;
                    if (trimDescription || showBlankApproveDescription) {
                        approveDoc[`sign_show`] = true;
                    }
                    approveDoc[`modified`] = new Date();
                    approveDoc[`modified_by`] = session_userId;
                    approveDoc[`read_date`] = new Date();
                }
            });
            if (key_str && !_.isEmpty(approveDoc)) {
                for (const key in approveDoc) {
                    if (Object.hasOwnProperty.call(approveDoc, key)) {
                        upObj[key_str + key] = approveDoc[key]
                    }
                }
            }

            const needUpdateApproveIds = []
            if (((ref3 = Steedos.settings.public.workflow) != null ? ref3.keepLastSignApproveDescription : void 0) === false && (!!currentApproveDescription !== !!trimDescription || showBlankApproveDescription)) {
                ins = db.instances.findOne({
                    _id: instanceId
                }, {
                    fields: {
                        "traces": 1
                    }
                });
                traces = ins.traces;
                currentTrace = _.find(traces, function (t) {
                    return t._id === traceId;
                });
                currentStep = currentTrace.step;
                traces.forEach(function (t, tIdx) {
                    if (t.step === currentStep) {
                        return t != null ? t.approves.forEach(function (appr, aIdx) {
                            if (appr.handler === session_userId && appr.is_finished && appr._id !== approveId && !_.has(appr, 'custom_sign_show')) {
                                if ((trimDescription && appr.sign_show === true && (sign_field_code === "" || !appr.sign_field_code || sign_field_code === appr.sign_field_code)) || showBlankApproveDescription) {
                                    upObj[`traces.${tIdx}.approves.${aIdx}.sign_show`] = false;
                                    return upObj[`traces.${tIdx}.approves.${aIdx}.keepLastSignApproveDescription`] = approveId;
                                } else if (appr.keepLastSignApproveDescription === approveId) {
                                    upObj[`traces.${tIdx}.approves.${aIdx}.sign_show`] = true;
                                    return upObj[`traces.${tIdx}.approves.${aIdx}.keepLastSignApproveDescription`] = null;
                                }
                                needUpdateApproveIds.push(appr._id)
                            }
                        }) : void 0;
                    }
                });
            }
            if (!_.isEmpty(upObj)) {
                db.instances.update({
                    _id: instanceId,
                    "traces._id": traceId
                }, {
                    $set: upObj
                });
                update_instance_tasks(instanceId, traceId, approveId, approveDoc)
                if (needUpdateApproveIds.length > 0) {
                    update_many_instance_tasks(instanceId, traceId, needUpdateApproveIds, ['sign_show', 'keepLastSignApproveDescription'])
                }
            }
            return true;
        }
    },
    update_sign_show: function (objs, myApprove_id) {
        objs.forEach(function (obj, index) {
            var instance, ref, setObj, trace;
            instance = db.instances.findOne({
                _id: obj.instance,
                "traces._id": obj.trace
            }, {
                fields: {
                    "traces.$": 1
                }
            });
            if ((instance != null ? (ref = instance.traces) != null ? ref.length : void 0 : void 0) > 0) {
                trace = instance.traces[0];
                setObj = {};
                trace.approves.forEach(function (approve, idx) {
                    if (approve._id === obj._id) {
                        setObj[`traces.$.approves.${idx}.sign_show`] = obj.sign_show;
                        setObj[`traces.$.approves.${idx}.custom_sign_show`] = obj.sign_show;
                        setObj[`traces.$.approves.${idx}.read_date`] = new Date();
                    }
                    if (approve._id === myApprove_id) {
                        return setObj[`traces.$.approves.${idx}.read_date`] = new Date();
                    }
                });
                if (!_.isEmpty(setObj)) {
                    db.instances.update({
                        _id: obj.instance,
                        "traces._id": obj.trace
                    }, {
                        $set: setObj
                    });
                    update_many_instance_tasks(obj.instance, obj.trace, [obj._id, myApprove_id], ['sign_show', 'custom_sign_show', 'read_date'])
                }
            }
        });
        return true;
    }
};
