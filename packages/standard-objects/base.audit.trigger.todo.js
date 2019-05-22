//TODO 处理
module.exports = {

    name: 'baseAuditTrigger',

    listenTo: 'base',

    afterInsert: function (userId, doc, fieldNames, modifier, options) {
        var obj, object_name, ref;
        object_name = this.object_name;
        obj = Creator.getObject(object_name);
        if (obj.enable_audit) {
            return (ref = Creator.AuditRecords) != null ? ref.add('update', userId, this.object_name, doc, this.previous, modifier) : void 0;
        }
    },
    afterUpdate: function (userId, doc) {
        var obj, object_name, ref;
        object_name = this.object_name;
        obj = Creator.getObject(object_name);
        if (obj.enable_audit) {
            return (ref = Creator.AuditRecords) != null ? ref.add('insert', userId, this.object_name, doc) : void 0;
        }
    }
}