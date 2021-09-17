const _ = require('underscore');
const objectql = require("@steedos/objectql");

const SERVICE_NAME = `~database-tabs`;

const permissions = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
}

const baseRecord = {
    is_system:true,
    visible: true,
    record_permissions:permissions
}

module.exports = {
    // afterInsert: async function () {
    //     const record = await this.getObject('tabs').findOne(this.doc._id);
    //     await objectql.addTabConfig(record, SERVICE_NAME)
    // },
    // afterUpdate: async function () {
    //     const {doc, previousDoc} = this;
    //     const record = await this.getObject('tabs').findOne(this.id);
    //     if(doc.name != previousDoc.name){
    //         await objectql.removeTab(previousDoc.name)
    //     }
    //     await objectql.addTabConfig(record, SERVICE_NAME)
    // },
    // afterDelete: async function(){
    //     let previousDoc = this.previousDoc;
    //     await objectql.removeTab(previousDoc.name)
    // }
}