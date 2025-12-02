"use strict";
module.exports = {
    listenTo: 'object_listviews',

    beforeInsert: async function () {
        const { doc } = this;
        if(doc.type === 'cards'){
            doc.crud_mode = 'cards';
        }
        else if(doc.type){
            doc.crud_mode = 'table';
        }
    },

    beforeUpdate: async function () {
        const { doc } = this;
        if(doc.type === 'cards'){
            doc.crud_mode = 'cards';
        }
        else if(doc.type){
            doc.crud_mode = 'table';
        }
    }
}