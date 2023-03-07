const objectql = require('@steedos/objectql');
const _ = require('lodash');

module.exports = {
    listenTo: 'object_fields',

    beforeInsert: async function(){
        const { doc } = this;
        if(doc && _.has(doc, 'amis') && _.isString(doc.amis)){
            doc.amis = JSON.parse(doc.amis);
        }
    },

    beforeUpdate: async function(){
        const { doc } = this;
        if(doc && _.has(doc, 'amis') && _.isString(doc.amis)){
            doc.amis = JSON.parse(doc.amis);
        }
    },

}