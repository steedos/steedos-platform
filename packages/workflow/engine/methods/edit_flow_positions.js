/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-22 14:05:44
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 14:09:05
 * @Description: 
 */
module.exports = {
    updateFlowPosition: function (data) {
        return db.flow_positions.update({
            _id: data._id
        }, {
            $set: {
                role: data.role,
                users: data.users,
                org: data.org
            }
        });
    },
    updateFlowRole: function (data) {
        console.log(data._id);
        console.log(data.name);
        return db.flow_roles.update({
            _id: data._id
        }, {
            $set: {
                name: data.name
            }
        });
    }
};
