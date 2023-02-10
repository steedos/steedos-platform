module.exports = {
    instance_remind: function (remind_users, remind_count, remind_deadline, instance_id, action_types, trace_id) {
        var current_user_id, ins, last_remind_users, now, priority, trace;
        check(remind_users, Array);
        check(remind_count, Match.OneOf('single', 'multi'));
        check(remind_deadline, Date);
        check(instance_id, String);
        check(action_types, Array);
        check(trace_id, String);
        current_user_id = this.userId;
        last_remind_users = new Array;
        ins = db.instances.findOne({
            _id: instance_id
        }, {
            fields: {
                name: 1,
                traces: 1,
                values: 1,
                space: 1
            }
        });
        if (action_types.includes('admin')) {
            if (remind_count === 'single') {
                _.each(ins.traces, function (t) {
                    return _.each(t.approves, function (ap) {
                        if (remind_users.includes(ap.user) && ap.is_finished !== true) {
                            return last_remind_users.push(ap.user);
                        }
                    });
                });
            } else if (remind_count === 'multi') {
                now = new Date;
                priority = ins.values.priority;
                _.each(ins.traces, function (t) {
                    return _.each(t.approves, function (ap) {
                        var caculate_date;
                        if (remind_users.includes(ap.user) && ap.is_finished !== true) {
                            last_remind_users.push(ap.user);
                            ap.manual_deadline = remind_deadline;
                            // （1）“普通”：如三个工作日内未处理，系统自动发短信提醒：办结时限为二日内；
                            //  如二日后仍未处理，系统每天自动发短信提醒，办结时限为一日内。
                            if (priority === "普通" || !priority) {

                                // （2）“办文”：如一个工作日内未处理，系统自动发短信提醒：办结时限为表单上的“办结时限”（文书录入的时间）；
                                //  如一日后仍未处理，系统每天自动发短信提醒：办结时限不变；
                                //  距离办结时限为半日时，则每半个工作日提醒四次；超过办结时限后仍然按照每半日四次提醒。
                            } else if (priority === "办文") {
                                if (Steedos.caculatePlusHalfWorkingDay(now) > remind_deadline) { // 超过了办结时限或者距离办结时限半日内
                                    return ap.remind_date = Steedos.caculatePlusHalfWorkingDay(now, true);
                                } else if (Steedos.caculateWorkingTime(now, 1) > remind_deadline) {
                                    caculate_date = function (base_date) {
                                        var plus_halfday_date;
                                        plus_halfday_date = Steedos.caculatePlusHalfWorkingDay(base_date);
                                        if (plus_halfday_date > remind_deadline) {
                                            ap.remind_date = base_date;
                                        } else {
                                            caculate_date(Steedos.caculatePlusHalfWorkingDay(base_date, true));
                                        }
                                    };
                                    return caculate_date(now);
                                }
                                // （3）“紧急”：在发送的同时，系统自动发短信提醒：办结时限为表单上的“办结时限”（文书录入的时间）；
                                //  如半日内仍未处理，系统每半天自动发短信提醒：办结时限不变；距离办结时限为半日时，每半个工作日提醒四次；超过办结时限后仍然按照每半日四次提醒。
                            } else if (priority === "紧急") {
                                if (Steedos.caculatePlusHalfWorkingDay(now) > remind_deadline) { // 超过了办结时限或者距离办结时限半日内
                                    return ap.remind_date = Steedos.caculatePlusHalfWorkingDay(now, true);
                                } else if (Steedos.caculateWorkingTime(now, 1) > remind_deadline) {
                                    caculate_date = function (base_date) {
                                        var plus_halfday_date;
                                        plus_halfday_date = Steedos.caculatePlusHalfWorkingDay(base_date);
                                        if (plus_halfday_date > remind_deadline) {
                                            ap.remind_date = base_date;
                                        } else {
                                            caculate_date(Steedos.caculatePlusHalfWorkingDay(base_date, true));
                                        }
                                    };
                                    return caculate_date(now);
                                }
                                // （4）“特急”：在发送的同时，系统自动发短信提醒：办结时限为表单上的“办结时限”（文书录入的时间）；
                                //  如半日内仍未处理，系统每半个工作日提醒四次：办结时限不变；超过办结时限后仍然按照每半日四次提醒。
                            } else if (priority === "特急") {
                                if (Steedos.caculatePlusHalfWorkingDay(now) > remind_deadline) { // 超过了办结时限或者距离办结时限半日内
                                    return ap.remind_date = Steedos.caculatePlusHalfWorkingDay(now, true);
                                } else if (Steedos.caculateWorkingTime(now, 1) > remind_deadline) {
                                    caculate_date = function (base_date) {
                                        var plus_halfday_date;
                                        plus_halfday_date = Steedos.caculatePlusHalfWorkingDay(base_date);
                                        if (plus_halfday_date > remind_deadline) {
                                            ap.remind_date = base_date;
                                        } else {
                                            caculate_date(Steedos.caculatePlusHalfWorkingDay(base_date, true));
                                        }
                                    };
                                    return caculate_date(now);
                                }
                            }
                        }
                    });
                });
                if (!_.isEmpty(last_remind_users)) {
                    db.instances.update({
                        _id: instance_id
                    }, {
                        $set: {
                            'traces': ins.traces
                        }
                    });
                }
            }
        } else if (action_types.includes('applicant')) {
            trace = _.find(ins.traces, function (t) {
                return t._id === trace_id;
            });
            _.each(trace.approves, function (ap) {
                if (remind_users.includes(ap.user) && ap.is_finished !== true) {
                    return last_remind_users.push(ap.user);
                }
            });
        } else if (action_types.includes('cc')) {
            _.each(ins.traces, function (t) {
                return _.each(t.approves, function (ap) {
                    if (remind_users.includes(ap.user) && ap.is_finished !== true && ap.type === 'cc' && ap.from_user === current_user_id) {
                        return last_remind_users.push(ap.user);
                    }
                });
            });
        }
        uuflowManager.sendRemindSMS(ins.name, remind_deadline, last_remind_users, ins.space, ins._id);
        return true;
    }
};
