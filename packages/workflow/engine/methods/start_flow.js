/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-22 15:32:40
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 15:33:33
 * @Description: 
 */
module.exports = {
    start_flow: function (space, flowId, start) {
        var keyValue, start_flows;
        keyValue = db.steedos_keyvalues.findOne({
            space: space,
            user: this.userId,
            key: 'start_flows'
        }, {
            fields: {
                value: 1
            }
        });
        start_flows = (keyValue != null ? keyValue.value : void 0) || [];
        if (start) {
            start_flows.push(flowId);
            start_flows = _.uniq(start_flows);
        } else {
            start_flows.remove(start_flows.indexOf(flowId));
        }
        if (keyValue) {
            return db.steedos_keyvalues.update({
                _id: keyValue._id
            }, {
                space: space,
                user: this.userId,
                key: 'start_flows',
                value: start_flows
            });
        } else {
            return db.steedos_keyvalues.insert({
                space: space,
                user: this.userId,
                key: 'start_flows',
                value: start_flows
            });
        }
    }
};
