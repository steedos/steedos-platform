/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-22 15:24:26
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 15:25:00
 * @Description: 
 */
module.exports = {
    getInstanceValues: function (insId) {
        var ref;
        if (!this.userId) {
            return;
        }
        return (ref = db.instances.findOne({
            _id: insId
        }, {
            fields: {
                values: 1
            }
        })) != null ? ref.values : void 0;
    }
};
