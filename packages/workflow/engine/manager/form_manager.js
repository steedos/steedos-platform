/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-21 15:05:25
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-21 15:05:50
 * @Description: 
 */
global.formManager = {};

formManager.getCategoriesForms = function (spaceId, categorieId, fields) {
    var _fields;
    if (fields) {
        _fields = {
            fields: fields
        };
    }
    return db.forms.find({
        space: spaceId,
        category: categorieId,
        state: "enabled"
    }, _fields);
};

formManager.getUnCategoriesForms = function (spaceId, fields) {
    var _fields;
    if (fields) {
        _fields = {
            fields: fields
        };
    }
    return db.forms.find({
        space: spaceId,
        category: {
            $in: [null, ""]
        },
        state: "enabled"
    }, _fields);
};
