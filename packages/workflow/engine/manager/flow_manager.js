/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-21 15:03:26
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-21 15:04:08
 * @Description: 
 */
global.flowManager = {};

flowManager.getCategoriesFlows = function (spaceId, categorieId, fields) {
    var categoriesForms;
    categoriesForms = formManager.getCategoriesForms(spaceId, categorieId, {
        _id: 1
    }).fetch();
    return db.flows.find({
        form: {
            $in: categoriesForms.getProperty("_id")
        }
    });
};

flowManager.getUnCategoriesFlows = function (spaceId, fields) {
    var unCategoriesForms;
    unCategoriesForms = formManager.getUnCategoriesForms(spaceId, {
        _id: 1
    }).fetch();
    return db.flows.find({
        form: {
            $in: unCategoriesForms.getProperty("_id")
        }
    });
};
