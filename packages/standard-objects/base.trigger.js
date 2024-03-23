const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('underscore');

/**
 * 校验记录的 company 是否在指定授权范围内
 * @param {*} object_name
 * @param {*} userId 
 * @param {*} doc 
 */
const checkCompany = async (object_name, userId, doc) => {
    const userSession = await auth.getSessionByUserId(userId, doc.space);

    if (!userSession || userSession.is_space_admin) {
        return;
    }

    let userObjectPermission = null;

    try {
        userObjectPermission = await objectql.getObject(object_name).getUserObjectPermission(userSession);
    } catch (error) {
        return;
    }

    if (userObjectPermission.modifyAllRecords) {
        return true;
    }

    let allowCompanyIds = [];

    //与client端保持一致，始终授权用户所属分部
    if (!_.isEmpty(userSession.company_ids)) {
        allowCompanyIds.push(...userSession.company_ids);
    }
    if (!_.isEmpty(userObjectPermission.modifyAssignCompanysRecords)) {
        allowCompanyIds.push(...userObjectPermission.modifyAssignCompanysRecords);
    }

    if (_.has(doc, "company_id")) {
        if (!_.include(allowCompanyIds, doc.company_id)) {
            throw new Error(`未获得分部授权`);
        }
    }

    if (_.has(doc, "company_ids")) {
        if (_.difference(doc.company_ids, allowCompanyIds).length > 0) {
            throw new Error(`未获得分部授权`);
        }
    }
}

const beforeInsertBase = async function () {
    const { doc, userId } = this;
    // 迁移到insert函数中提前执行了
    // doc.created = new Date();
    // doc.modified = new Date();
    // if (userId) {
    //     if (!doc.owner) {
    //         doc.owner = userId;
    //     }
    //     if (doc.owner === '{userId}') {
    //         doc.owner = userId;
    //     }
    //     doc.created_by = userId;
    //     doc.modified_by = userId;
    // }
    var extras = ["spaces", "company", "organizations", "users", "space_users"];
    if (extras.indexOf(this.object_name) < 0 && doc.space) {
        /* company_ids/company_id默认值逻辑*/
        if (!doc.company_id || !doc.company_ids) {
            var su;
            if (userId) {
                const spaceUsers = await objectql.getObject("space_users").find({ filters: [['space', '=', doc.space], ['user', '=', userId]], fields: ['company_id'] });
                su = spaceUsers.length > 0 ? spaceUsers[0] : null
            }
            if (!doc.company_id) {
                if (doc.company_ids && doc.company_ids.length) {
                    /* 如果用户在界面上指定了company_ids，则取第一个值 */
                    doc.company_id = doc.company_ids[0];
                }
                else if (su && su.company_id) {
                    doc.company_id = su.company_id;
                }
            }
            if (!doc.company_ids) {
                if (doc.company_id) {
                    /* 如果用户在界面上指定了company_id，则取其值输入 */
                    doc.company_ids = [doc.company_id];
                }
                else if (su && su.company_id) {
                    doc.company_ids = [su.company_id];
                }
            }
        }
        await checkCompany(this.object_name, userId, doc);
    }
}
const beforeUpdateBase = async function () {
    const { doc, userId } = this;
    if (!doc) {
        return;
    }
    // 迁移到update函数中提前执行了
    // doc.modified = new Date();
    // if (userId) {
    //     doc.modified_by = userId;
    // }
    var extras = ["spaces", "company", "organizations", "users", "space_users"];
    if (extras.indexOf(this.object_name) < 0) {
        /* company_ids/company_id级联修改逻辑*/
        if (_.has(doc, "company_ids")) {
            /*
                原则上应该将 company_ids 设置为可编辑，company_id 设置为只读。
                当 company_ids 可编辑时，修改 company_ids 同时更新 company_id = company_ids[0]
            */
            var firstCompanyId = doc.company_ids ? doc.company_ids[0] : null;
            if (firstCompanyId) {
                doc.company_id = firstCompanyId;
            }
            else {
                doc.company_id = null;
            }
        }
        else if (_.has(doc, "company_id")) {
            /*
                考虑到兼容老项目，允许将 company_id 设置为可编辑，此时 company_ids 必须只读。
                当 company_id 可编辑时，修改 company_id 同时更新 company_ids = [company_id]
            */
            if (doc.company_id) {
                doc.company_ids = [doc.company_id];
            }
            else {
                doc.company_ids = null;
            }
        }
        await checkCompany(this.object_name, userId, doc);
    }
}
const afterDeleteBase = async function () {
    const { object_name, previousDoc } = this;
    const object = objectql.getObject(object_name);
    const objectConfig = object.toConfig();
    const fields = objectConfig.fields;
    const fieldsName = _.keys(previousDoc);

    _.each(fieldsName, function (fieldName) {
        const fieldProps = fields[fieldName];
        const indexOfType = fieldProps && ['file','image'].indexOf(fieldProps.type);
        if( indexOfType > -1 && previousDoc[fieldName] && previousDoc[fieldName].length ){
            const collection = [cfs.files,cfs.images][indexOfType];
            let ids = previousDoc[fieldName]
            if(typeof ids === 'string'){
                ids = [ids]
            }
            _.each(ids,function (id){
                collection.remove({
                    "_id": id
                });
            })
        }
    });
}

module.exports = {
    listenTo: 'base',
    beforeInsert: async function () {
        return await beforeInsertBase.apply(this, arguments)
    },
    beforeUpdate: async function () {
        return await beforeUpdateBase.apply(this, arguments)
    },
    afterDelete: async function () {
        return await afterDeleteBase.apply(this, arguments)
    }
}