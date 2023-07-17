/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-10-26 14:14:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-13 09:56:08
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const auth = require('@steedos/auth');
const _ = require('underscore');
async function getAll() {
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerPermissionTabs.getAll(schema.broker)
    const dataList = _.pluck(configs, 'metadata');
    let permissionTabs = [];
    for (const item of dataList) {
        if (!item._id) {
            item._id = `${item.permission_set}_${item.tab}`
        }
        permissionTabs.push({
            _id: item._id,
            permission: item.permission,
            permission_set: item.permission_set,
            tab: item.tab,

            is_system: true,
            record_permissions: { // 此属性控制记录在前台页面的权限
                allowEdit: false,
                allowDelete: false,
                allowRead: true,
            }
        });
    }
    return permissionTabs;
}

/**
 * 检查同一个权限集下针对同一个选项卡是否重复配置
 * @param {*} permission_set 
 * @param {*} tab 
 * @param {*} action beforeInsert/beforeUpdate
 * @param {*} id 
 */
async function checkMultiple(permission_set, tab, action, id) {
    if (!permission_set || !tab) return

    const pTabObj = objectql.getObject('permission_tabs')
    const pTabDocs = await pTabObj.directFind({
        filters: [
            ['permission_set', '=', permission_set],
            ['tab', '=', tab]
        ]
    })

    if (pTabDocs.length > 1) {
        throw new Error(`权限集/简档 ${permission_set} 下发现选项卡 ${tab} 权限配置了${pTabDocs.length}条，请及时处理。`)
    }

    if (pTabDocs.length === 1 && (action === 'beforeInsert' || (action === 'beforeUpdate' && pTabDocs[0]._id != id))) {
        throw new Error(`已在权限集/简档 ${permission_set} 下配置过选项卡 ${tab} 的权限，无需重复配置。`)
    }
}

module.exports = {
    listenTo: 'permission_tabs',

    beforeInsert: async function () {
        const { doc, id } = this

        await checkMultiple(doc.permission_set, doc.tab, 'beforeInsert', null)
    },

    beforeUpdate: async function () {
        const { doc, getObject, object_name, id } = this
        const pTabObj = getObject(object_name)
        const nowDoc = await pTabObj.findOne(id)
        const newDoc = {
            ...nowDoc,
            ...doc
        }
        await checkMultiple(newDoc.permission_set, newDoc.tab, 'beforeUpdate', id)
    },

    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function () {
        const { spaceId } = this;
        let dataList = await getAll();
        if (dataList) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.permission_set === doc.permission_set && value.tab === doc.tab
                })) {
                    this.data.values.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }
    },
    afterAggregate: async function () {
        const { spaceId } = this;
        let dataList = await getAll();
        if (dataList) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.permission_set === doc.permission_set && value.tab === doc.tab
                })) {
                    this.data.values.push(doc);
                };
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }
    },
    afterCount: async function () {
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function () {
        if (_.isEmpty(this.data.values)) {
            const all = await getAll();
            const id = this.id;
            this.data.values = _.find(all, function (item) {
                return item._id === id
            });
        }
    }
}