if(!Creator.Objects['permission_objects'].triggers){
    Creator.Objects['permission_objects'].triggers = {}
}

Creator.Objects['permission_objects'].triggers = Object.assign({}, Creator.Objects['permission_objects'].triggers,{
    "before.insert.server.process":{
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
            return Creator.processPermissions(doc);
        }
    },
    "before.update.server.process":{
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            return Creator.processPermissions(modifier.$set);
        }
    }
})