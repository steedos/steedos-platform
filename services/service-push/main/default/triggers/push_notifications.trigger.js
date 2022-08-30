const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'push_notifications',

    beforeInsert: async function(){
        let doc = this.doc;
        let find_query = {
            fields: ['user'],
            filters: [['mobile','=',doc.owner_mobile],['space','=',doc.space]]
        };
        let space_user = await objectql.getObject('space_users').findOne(find_query);
        if (!space_user){
            throw new Meteor.Error(500, `请检查用户信息，未找到手机号为 ${doc.owner_mobile} 的用户。`);
        }else{
            doc.owner = space_user.user;
            doc.created_by = space_user.user;
            doc.modified_by = space_user.user;
        }
         
        // console.log("doc: ",doc);
    },

    beforeUpdate: async function(){
    
    },

    afterInsert: async function(){
        let doc = this.doc;

        if (!doc.badge){
            throw new Meteor.Error(500, `缺少badge，请传入正确的badge`);
        }

        if (!doc.name){
            throw new Meteor.Error(500, `缺少name，请传入正确的name`);
        }

        if (!doc.body){
            throw new Meteor.Error(500, `缺少body，请传入正确的body`);
        }
        
        let message = {
            name: doc.name,
            body: doc.body,
            related_to: {
                o: "service_push",
                ids: [doc._id],
            },
            related_name: doc.name,
            from: null,
            space: doc.space,
        }
        console.log("message: ", message);

        // 发送pc端推送和移动端推送
        await Creator.addNotifications(message, null, doc.owner);

        
        if (doc.app_id && doc.badge){
            let app = await objectql.getObject('apps').findOne(doc.app_id, {fields: ['_id']});
            if (app){
                let find_query = {
                    fields: ['_id'],
                    filters: [['user','=', doc.owner], ['space','=',doc.space], ['key', '=', 'badge']]
                }; 
                let badge = await objectql.getObject('steedos_keyvalues').findOne(find_query);
                if (badge){
                    badge.value[app._id] = doc.badge;
                    console.log("badge: ",badge);
                    await objectql.getObject('steedos_keyvalues').update(badge._id, {"value": badge.value})
                }else{
                    let value = {}
                    let insertDoc = {
                        "user": doc.owner,
                        "space": doc.space,
                        "key": "badge"
                    }
                    value[app._id] = doc.badge;
                    insertDoc.value = value;
                    await objectql.getObject('steedos_keyvalues').insert(insertDoc)
                }
            }
        }

    },

    afterUpdate: async function(){
    },

    afterDelete: async function(){
    },

}
