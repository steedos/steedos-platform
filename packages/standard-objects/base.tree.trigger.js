const objectql = require('@steedos/objectql');

const getParentFieldName = (objectConfig)=>{
    return objectConfig.parent_field || "parent"
}

const getChildrenFieldName = (objectConfig)=>{
    return objectConfig.children_field || "children"
}

const calculateChildren = async function (parentId, object) {
    var children, childrenObjs;
    children = [];
    childrenObjs = await object.find({
        filters: [["parent", "=", parentId]],
        fields: ["_id"]
    });
    childrenObjs.forEach(function (child) {
        return children.push(child._id);
    });
    return children;
}

const setChildren = async function (parentId, object, childrenFieldName) {
    const children = await calculateChildren(parentId, object);
    const values = {};
    values[childrenFieldName] = children;
    await object.directUpdate(parentId, values);
}

module.exports = {
    listenTo: 'base',
    afterInsert: async function () {
        const { doc, object_name } = this;
        const object = objectql.getObject(object_name);
        const objectConfig = object.toConfig()
        if(objectConfig.enable_tree){
            const parentFieldName = getParentFieldName(objectConfig);
            const childrenFieldName = getChildrenFieldName(objectConfig);
            const parentId = doc[parentFieldName];
            if(parentId){
                setChildren(parentId, object, childrenFieldName);
            }
        }
    },
    afterUpdate: async function () {
        const { previousDoc, object_name } = this;
        // 因为afterUpdate中没有this.doc._id，所以把previousDoc集成过去，编辑单个字段时也需要从previousDoc中集成其他字段
        let doc = Object.assign({}, this.previousDoc, this.doc);
        const object = objectql.getObject(object_name);
        const objectConfig = object.toConfig()
        if(objectConfig.enable_tree){
            const parentFieldName = getParentFieldName(objectConfig);
            const childrenFieldName = getChildrenFieldName(objectConfig);
            const parentId = doc[parentFieldName];
            const preParentId = previousDoc[parentFieldName];
            if(parentId && parentId !== preParentId){
                setChildren(parentId, object, childrenFieldName);
                if(preParentId){
                    setChildren(preParentId, object, childrenFieldName);
                }
            }
        }
    },
    afterDelete: async function () {
        const { object_name } = this;
        // 因为afterDelete中没有this.doc，所以把previousDoc集成过去，编辑单个字段时也需要从previousDoc中集成其他字段
        let doc = Object.assign({}, this.previousDoc);
        const object = objectql.getObject(object_name);
        const objectConfig = object.toConfig()
        if(objectConfig.enable_tree){
            const parentFieldName = getParentFieldName(objectConfig);
            const childrenFieldName = getChildrenFieldName(objectConfig);
            const parentId = doc[parentFieldName];
            if(parentId){
                setChildren(parentId, object, childrenFieldName);
            }
        }
    }
}