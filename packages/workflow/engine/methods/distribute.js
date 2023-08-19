module.exports = {
    get_distribute_flows: function (options) {
        var flows, opts, pinyin, query, searchText, spaceId, uid, values;
        if (!options.params) {
            return [];
        }
        this.unblock;
        uid = this.userId;
        searchText = options.searchText;
        values = options.values;
        spaceId = JSON.parse(options.params).spaceId;
        // Meteor.wrapAsync((callback) ->
        // 	Meteor.setTimeout (->
        // 		callback()
        // 		return
        // 	), 1000
        // 	return
        // )()
        opts = new Array;
        flows = new Array;
        if (searchText) {
            pinyin = /^[a-zA-Z\']*$/.test(searchText);
            if ((pinyin && searchText.length > 4) || (!pinyin && searchText.length > 1)) {
                query = {
                    space: spaceId,
                    state: 'enabled',
                    name: {
                        $regex: searchText
                    }
                };
                flows = db.flows.find(query, {
                    limit: 10,
                    fields: {
                        name: 1,
                        space: 1
                    }
                }).fetch();
            }
        } else if (values.length) {
            flows = db.flows.find({
                _id: {
                    $in: values
                }
            }, {
                fields: {
                    name: 1,
                    space: 1
                }
            }).fetch();
        }
        flows.forEach(function (f) {
            var space;
            space = db.spaces.findOne({
                _id: f.space
            }, {
                fields: {
                    name: 1
                }
            });
            return opts.push({
                label: `[${space.name}]${f.name}`,
                value: f._id
            });
        });
        return opts;
    },
    update_distribute_settings: function (flow_id, distribute_optional_users_id, step_flows, distribute_to_self, distribute_end_notification, upload_after_being_distributed) {
        var distribute_optional_users, flow, setObj;
        check(flow_id, String);
        check(distribute_optional_users_id, Array);
        check(step_flows, Array);
        check(distribute_to_self, Boolean);
        check(distribute_end_notification, Boolean);
        check(upload_after_being_distributed, Boolean);
        flow = db.flows.findOne(flow_id);
        if (!flow) {
            throw new Meteor.Error('error', 'flow not found!');
        }
        setObj = new Object;
        _.each(flow.current.steps, function (s) {
            if (s.allowDistribute === true) {
                return _.each(step_flows, function (sf) {
                    if (sf._id === s._id) {
                        return s.distribute_optional_flows = sf.distribute_optional_flows;
                    }
                });
            }
        });
        distribute_optional_users = new Array;
        db.users.find({
            _id: {
                $in: distribute_optional_users_id
            }
        }, {
            fields: {
                name: 1
            }
        }).forEach(function (u) {
            return distribute_optional_users.push({
                id: u._id,
                name: u.name
            });
        });
        setObj.distribute_optional_users = distribute_optional_users;
        if (!_.isEmpty(step_flows)) {
            setObj['current.steps'] = flow.current.steps;
        }
        setObj['distribute_to_self'] = distribute_to_self;
        setObj['distribute_end_notification'] = distribute_end_notification;
        setObj['upload_after_being_distributed'] = upload_after_being_distributed;
        db.flows.update({
            _id: flow_id
        }, {
            $set: setObj
        });
        return true;
    }
};
