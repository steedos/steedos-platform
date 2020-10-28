const _ = require("underscore");
const util = require('../../util');
const objectql = require('@steedos/objectql');

module.exports = {
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name);

        objectql.checkFormula(this.doc.entry_criteria, this.doc.object_name)
    },
    beforeUpdate: async function () {
        if(_.has(this.doc, 'object_name')){
            var process = await objectql.getObject("process_definition").findOne(this.id);
            if(process.object_name != this.doc.object_name){
                throw new Error('禁止修改对象名称');
            }
        };
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id);
        }

        objectql.checkFormula(this.doc.entry_criteria, this.doc.object_name)
    }
}