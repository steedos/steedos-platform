/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-11-01 10:47:47
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-08 14:04:11
 * @FilePath: /steedos-platform-2.3/services/standard-object-database/src/triggers/object_fields_trigger_create_index.js
 * @Description: 当管理员新建/编辑字段时勾选了创建索引/创建唯一索引，保存后立即创建索引 https://github.com/steedos/steedos-platform/issues/5650
 */
module.exports = {
    trigger: {
        listenTo: 'object_fields',
        when: [
            'afterInsert',
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {
            if (isInsert) {
                const { index, unique, object, name } = doc
                if (object && (index || unique)) {
                    const obj = this.getObject(object)
                    setTimeout(async function () {
                        await obj.createIndex(name)
                    }, 6000) // 等待对象重新加载
                }
            }
            if (isUpdate) {
                const fieldObj = this.getObject(objectName)
                const newDoc = await fieldObj.findOne(id)
                const { index, unique, object, name } = newDoc
                const { index: preIndex, unique: preUnique } = previousDoc
                // 判断是否修改了索引
                if (object) {
                    const obj = this.getObject(object)
                    if ((index || unique) && ((preIndex != index && !unique) || preUnique != unique)) {
                        setTimeout(async function () {
                            console.log(require('chalk').red(name))
                            if ((preIndex || preUnique) && ((preIndex != index && !unique) || preUnique != unique)) { // 之前勾选过，现在调整了
                                await obj.dropIndex(name)
                            }
                            await obj.createIndex(name)
                        }, 6000)
                    }
                    // 取消勾选，删除索引
                    if ((!index && !unique) && (preIndex || preUnique)) {
                        setTimeout(async function () {
                            await obj.dropIndex(name)
                        }, 6000)
                    }
                }


            }
        }
    }
}