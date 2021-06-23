const objectql = require('@steedos/objectql');
module.exports = {
    listenTo: 'base',
    afterDelete: async function () {
        const { previousDoc, object_name, id } = this;
        await objectql.getObject('object_recent_viewed').directDelete({
            filters: [['space', '=', previousDoc.space],['record/o', '=', object_name],['record/ids', '=', [id]]]
        });
    }
}