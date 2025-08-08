const objectql = require('@steedos/objectql');
async function isSpaceUnique(spaceId, object_name, doc, name, _id){
    const query = {space: spaceId, name: name || doc.name};
    if(_id){
        query._id = {
            '$ne': _id
        }
    }
    const datasource = objectql.getDataSource('default');
    const adapter = datasource.adapter
    await adapter.connect()
    const collection = adapter.collection(object_name);
    const count = await collection.countDocuments(query)
    if(count > 0)
        return false
    return true
}
module.exports = {
    isSpaceUnique
}