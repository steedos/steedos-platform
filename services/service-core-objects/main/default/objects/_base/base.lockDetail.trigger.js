/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-01-31 14:19:11
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-02-01 15:45:36
 * @FilePath: /steedos-platform-2.3/packages/standard-objects/base.lockDetail.trigger.js
 * @Description: [Feature]: 主子表lock属性的联动锁定功能 #6235
 */
const objectql = require('@steedos/objectql');
const _ = require('underscore');

async function lockDetail(context, when) {
    const { object_name, id, previousDoc, doc } = context;
    const obj = objectql.getObject(object_name);
    const config = obj.getConfig()
    const enable_lock_detail = config.enable_lock_detail

    if (enable_lock_detail) {
        if ('afterInsert' === when) {
            const locked = doc.locked
            if (locked) {
                const details = await obj.getDetails();
                await _lockDetails(object_name, details, locked, id)
            }
        } else if ('afterUpdate' === when) {
            const locked = doc.locked
            const previousLocked = previousDoc.locked
            if (doc.hasOwnProperty('locked') && locked !== previousLocked) {
                const details = await obj.getDetails();
                await _lockDetails(object_name, details, locked, id)
            }
        }
    }

}

async function _lockDetails(object_name, details, locked, id) {
    if (details && details.length) {
        const dbDoc = await objectql.getObject(object_name).findOne(id, { fields: ["space"] });
        const spaceId = dbDoc.space;
        /* 如果当前对象存在子表的话，调整所有子表记录的locked以保持一致 */
        for (const detail of details) {
            const objDetail = objectql.getObject(detail);
            let needToSync = false;
            if (objDetail) {
                const detailMasters = await objDetail.getMasters();
                if (detailMasters.length > 1) {
                    /* 如果子表有多个主表子表关系，则只有当前主对象为该子表首要主对象（即第一个主对象）时才需要同步locked值。 */
                    needToSync = detailMasters[0] === object_name;
                }
                else {
                    needToSync = true;
                }
            }
            if (needToSync) {
                const detialFields = objDetail.fields;
                const refField = _.find(detialFields, (n) => { return n.type === "master_detail" && n.reference_to === object_name; });
                if (refField && refField.name) {
                    await objDetail.updateMany([[refField.name, '=', id], ['space', '=', spaceId]], { locked: locked });
                }
            }
        }
    }
}

module.exports = {
    listenTo: 'base',
    afterInsert: async function () {
        return await lockDetail(this, 'afterInsert')
    },
    afterUpdate: async function () {
        return await lockDetail(this, 'afterUpdate')
    }
}