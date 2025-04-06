const objectql = require('@steedos/objectql');
const auth = require("@steedos/auth");
const _ = require('underscore');
module.exports = {
    beforeInsert: async function () {
        const { userId, spaceId } = this;
        const obj = objectql.getObject("object_listviews")
        if(userId && spaceId){
            const userSession = await auth.getSessionByUserId(userId, spaceId);
            if(userSession){
                const { allowCreateListViews } = await obj.getUserObjectPermission(userSession, false);
                if(!allowCreateListViews){
                    throw new Error('没有权限创建视图')
                }
            }
        }
        if(!this.doc._id){
            this.doc._id = await obj._makeNewID()
        }
        if (!this.doc.name) {
            this.doc.name = 'listview_' + this.doc._id.toLowerCase();
        }
        if (!this.doc.sort) {
            this.doc.sort = [
                {
                    "field_name" : "created",
                    "order" : "desc"
                }
            ]
        }
        await objectql.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true], ['object_name','=', this.doc.object_name]]);
    },
    beforeUpdate: async function () {
        const oldDoc = await objectql.getObject(this.object_name).findOne(this.id)
        let name = oldDoc.name,object_name = oldDoc.object_name;

        if(_.has(this.doc, 'name')){
            name = this.doc.name
        }
        if(_.has(this.doc, 'object_name')){
            object_name = this.doc.object_name
        }

        if(oldDoc.name === 'all' && oldDoc.name != name){
            throw new Error('禁止修改「all」视图的API Name')
        }

        await objectql.checkAPIName(this.object_name, 'name', name, this.id, [['is_system','!=', true], ['object_name','=', object_name]]);
    },
    beforeDelete: async function(){
        const { id } = this;
        const record = await objectql.getObject(this.object_name).findOne(id);
        if(record.name === 'all'){
            throw new Error('禁止删除「all」视图')
        }
    }
}