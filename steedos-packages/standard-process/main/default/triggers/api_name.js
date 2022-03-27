const objectql = require('@steedos/objectql');
async function isSpaceUnique(spaceId, object_name, doc, name, _id){
    const filters = [];
    filters.push(['space', '=', spaceId])
    filters.push(['name', '=', name || doc.name])
    if(_id){
        filters.push(['_id', '!=', _id])
    }
    const count = await objectql.getObject(object_name).count({filters: filters})
    if(count > 0)
        return false
    return true
}
module.exports = {
    isSpaceUnique
}