const objectql = require('@steedos/objectql');

const afterDeleteRecentView = async function () {
    const { previousDoc, object_name, id } = this;
    if (!previousDoc) return;
    await objectql.getObject('object_recent_viewed').directDelete({
        filters: [['space', '=', previousDoc.space],['record/o', '=', object_name],['record/ids', '=', [id]]]
    });
}

module.exports = {
    listenTo: 'base',
    afterDelete: async function () {
        return await afterDeleteRecentView.apply(this, arguments)
    }
}