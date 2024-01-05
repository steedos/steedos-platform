const objectql = require('@steedos/objectql');
const steedosAuth = require("@steedos/auth");
const _ = require('underscore');

// 禁止同步子表owner值为主表记录owner值的主表对象
// 禁止后有两个效果
// 1.不再同步该对象的子表记录owner值为主表记录owner值
// 2.不再确认修改子表记录时是否有该主表记录的编辑或只读权限
const DISABLE_RELEVANT_OWNER_VALUE_MASTERS = ["objects"];

const setDetailOwner = async function (doc, object_name, userId) {
    if(!userId){
        return;
    }
    if (object_name.startsWith('cfs.')) {
        return;
    }
    if (doc.owner) {
        return;
    }
    let masterRecordOwner = '';
    const obj = objectql.getObject(object_name);
    const masters = await obj.getMasters();
    if(masters && masters.length){
        /* 
            如果当前修改的对象是其他对象的子表对象，这里有两个逻辑需要处理：
            1.必须至少具体其所有父对象关联记录的只读权限或可编辑权限（是只读还是可编辑取决于子表关系字段上是否勾选了write_requires_master_read属性）才能新建/编辑当前记录 
            2.当前记录的owner强制设置为其关联的首要主对象（即masters中第一个对象）记录的owner值
        */
        const userSession = await steedosAuth.getSessionByUserId(userId, doc.space);
        for(var index = 0; index < masters.length ; index++){
            const objFields = await obj.getFields();
            const master = masters[index];
            if(DISABLE_RELEVANT_OWNER_VALUE_MASTERS.indexOf(master) > -1){
                continue;
            }
            const refField = _.find(objFields,(n)=>{ return n.type === "master_detail" && n.reference_to === master;});
            if(refField && refField.name){
                let write_requires_master_read = refField.write_requires_master_read || false; /* 默认对主表有编辑权限才可新建或者编辑子表 */
                let masterAllow = false;
                const objMaster = objectql.getObject(master);
                /* 上面先判断一次对象级权限是因为有可能新建修改子表记录时未选择关联父记录字段值，以下是判断关联父记录的权限 */
                let refFieldValue = doc[refField.name];
                if(refFieldValue && _.isString(refFieldValue)) { /* isString是为排除字段属性multiple:true的情况 */
                    let nameFieldKey = await objMaster.getNameFieldKey();
                    let recordMaster = await objMaster.findOne(refFieldValue, {fields:[nameFieldKey, "owner", "space", "locked", "company_id", "company_ids"]});
                    if(recordMaster){
                        if (userId && recordMaster.space){
                            masterAllow = false;
                            let masterRecordPerm = await objMaster.getRecordPermissions(recordMaster, userSession);
                            if (write_requires_master_read == true) {
                                masterAllow = masterRecordPerm.allowRead;
                            }
                            else if (write_requires_master_read == false) {
                                masterAllow = masterRecordPerm.allowEdit;
                            }
                            if (!masterAllow) {
                                throw new Meteor.Error(400, `缺少当前子对象${object_name}的主对象”${master}“的“${write_requires_master_read ? "只读" : "编辑"}权限”，不能选择主表记录： “${recordMaster[nameFieldKey]}”。`);
                            }

                        }
                        if(index === 0){
                            /* 子表记录owner同步为masters中第一个对象记录的owner值 */
                            masterRecordOwner = recordMaster.owner;
                        }
                    }
                }
            }
        };
        doc.owner = userId || masterRecordOwner
    }
    // if (masterRecordOwner) {
    //     /* masterRecordOwner为空说明子表上未选择关联你父记录，此时owner会默认取当前用户的owner */
    //     doc.owner = masterRecordOwner;
    // }
}

const beforeInsertMasterDetail = async function () {
    const { doc, userId, object_name} = this;
    /*子表 master_detail 字段类型新增属性 sharing #1461*/
    await setDetailOwner(doc, object_name, userId);
}

const beforeUpdateMasterDetail = async function () {
    const { doc, userId, object_name, id} = this;
    const dbDoc = await objectql.getObject(object_name).findOne(id);
    /*子表 master_detail 字段类型新增属性 sharing #1461*/
    await setDetailOwner(_.extend({}, dbDoc, doc), object_name, userId);
}

const afterUpdateMasterDetail = async function () {
    /* Master-Detail 规则确认 #189 */
    const { object_name, id, previousDoc} = this;
    const dbDoc = await objectql.getObject(object_name).findOne(id);
    let docOwner = dbDoc.owner;
    if (docOwner !== previousDoc.owner && DISABLE_RELEVANT_OWNER_VALUE_MASTERS.indexOf(object_name) < 0) {
        let object_name = this.object_name;
        let docId = dbDoc._id;
        const obj = objectql.getObject(object_name);
        const details = await obj.getDetails();
        if(details && details.length){
            /* 如果当前对象存在子表的话，调整所有子表记录的owner以保持一致 */
            for (const detail of details) {
               const objDetail = objectql.getObject(detail);
               let needToSync = false;
               if(objDetail){
                   const detailMasters = await objDetail.getMasters();
                   if(detailMasters.length > 1){
                       /* 如果子表有多个主表子表关系，则只有当前主对象为该子表首要主对象（即第一个主对象）时才需要同步owner值。 */
                       needToSync = detailMasters[0] === object_name;
                   }
                   else{
                       needToSync = true;
                   }
               }
               if(needToSync){
                   const detialFields = objDetail.fields;
                   const refField = _.find(detialFields,(n)=>{ return n.type === "master_detail" && n.reference_to === object_name;});
                   if(refField && refField.name){
                       await objectql.getObject(detail).updateMany([[refField.name, '=', docId], ['space', '=', dbDoc.space]], { owner: docOwner });
                   }
               }
            }
        }
    }
}

module.exports = {
    listenTo: 'base',
    beforeInsert: async function () {
        return await beforeInsertMasterDetail.apply(this, arguments)
    },
    beforeUpdate: async function () {
        return await beforeUpdateMasterDetail.apply(this, arguments)
    },
    afterUpdate: async function () {
        return await afterUpdateMasterDetail.apply(this, arguments)
    }
}