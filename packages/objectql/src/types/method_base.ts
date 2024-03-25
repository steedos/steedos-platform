/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-03-23 14:58:33
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-03-25 17:11:14
 */
import * as _ from 'lodash';
import { Dictionary, JsonMap } from "@salesforce/ts-types";
import { SteedosUserSession } from ".";


/**
 * 校验记录的 company 是否在指定授权范围内
 * @param {*} object
 * @param {*} userId 
 * @param {*} doc 
 */
const checkCompany = async (object: any, doc: Dictionary<any>, userSession?: SteedosUserSession) => {

    if (!userSession || userSession.is_space_admin) {
        return;
    }

    let userObjectPermission = null;

    try {
        userObjectPermission = await object.getUserObjectPermission(userSession);
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
        if (!_.includes(allowCompanyIds, doc.company_id)) {
            throw new Error(`未获得分部授权`);
        }
    }

    if (_.has(doc, "company_ids")) {
        if (_.difference(doc.company_ids, allowCompanyIds).length > 0) {
            throw new Error(`未获得分部授权`);
        }
    }
}

export async function getMongoInsertBaseDoc(object: any, doc: Dictionary<any>, userSession?: SteedosUserSession) {
    const { userId, company_id } = userSession || {};
    doc.created = new Date();
    doc.modified = new Date();
    if (userId) {
        if (!doc.owner) {
            doc.owner = userId;
        }
        if (doc.owner === '{userId}') {
            doc.owner = userId;
        }
        doc.created_by = userId;
        doc.modified_by = userId;
    }

    var extras = ["spaces", "company", "organizations", "users", "space_users"];
    if (extras.indexOf(object.name) < 0 && doc.space) {
        /* company_ids/company_id默认值逻辑*/
        if (!doc.company_id || !doc.company_ids) {
            if (!doc.company_id) {
                if (doc.company_ids && doc.company_ids.length) {
                    /* 如果用户在界面上指定了company_ids，则取第一个值 */
                    doc.company_id = doc.company_ids[0];
                }
                else if (company_id) {
                    doc.company_id = company_id;
                }
            }
            if (!doc.company_ids) {
                if (doc.company_id) {
                    /* 如果用户在界面上指定了company_id，则取其值输入 */
                    doc.company_ids = [doc.company_id];
                }
                else if (company_id) {
                    doc.company_ids = [company_id];
                }
            }
        }
        await checkCompany(object, doc, userSession);
    }
    return doc;
}

export async function getMongoUpdateBaseDoc(object: any, doc: Dictionary<any>, userSession?: SteedosUserSession) {
    const { userId, company_id } = userSession || {};
    if (!doc) {
        return;
    }
    doc.modified = new Date();
    if (userId) {
        doc.modified_by = userId;
    }

    var extras = ["spaces", "company", "organizations", "users", "space_users"];
    if (extras.indexOf(object.name) < 0) {
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
        await checkCompany(object, doc, userSession);
    }
    return doc;
}