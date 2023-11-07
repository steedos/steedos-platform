/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-11-04 18:16:15
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-07 09:31:28
 * @FilePath: /steedos-platform-2.3/services/service-workflow/src/rests/api_workflow_instance_batch_remove.js
 * @Description: 草稿箱列表删除按钮调用此接口批量删除草稿
 */

module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/workflow/instance/batch/delete/drafts'
    },
    params: {
        ids: { type: 'array', items: 'string' }, // 申请单id数组
    },
    async handler(ctx) {
        const userSession = ctx.meta.user;
        const { userId } = userSession
        const { ids } = ctx.params;

        const insObj = this.getObject('instances')
        const insTaskObj = this.getObject('instance_tasks')

        // 先检查是否符合删除条件：1、状态为草稿，2、提交人人为当前用户。
        const insDocs = await insObj.find({
            filters: [
                ['_id', 'in', ids]
            ],
            fields: ['state', 'submitter', 'name']
        })
        const errInsNames = []
        for (const doc of insDocs) {
            if (doc.state !== 'draft' || doc.submitter !== userId) {
                errInsNames.push(doc.name)
            }
        }

        if (errInsNames.length > 0) {
            const errMsg = `申请单${errInsNames.join('、')}不符合删除条件`
            return {
                'status': -1,
                'msg': errMsg,
                'data': {}
            }
        }

        // 执行删除，instances、instance_tasks
        for (const id of ids) {
            await insObj.delete(id)
            const taskDocs = await insTaskObj.find({
                filters: [
                    ['instance', '=', id]
                ],
                fields: ['_id']
            })
            for (const t of taskDocs) {
                await insTaskObj.delete(t._id)
            }
        }

        return {
            'status': 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
            'msg': '草稿已删除',
            'data': {
            }
        }
    }
}