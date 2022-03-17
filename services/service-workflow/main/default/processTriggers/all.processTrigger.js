"use strict";
// @ts-check
module.exports = {
    listenTo: '*',

    beforeDraftSubmit: async function(){
        console.log('LISTENTO_ALL_FLOWS processTrigger beforeDraftSubmit Called!!!!!!!!!!!!!!!!');
    },
    beforeStepSubmit: async function(){
        console.log('LISTENTO_ALL_FLOWS processTrigger beforeStepSubmit Called!!!!!!!!!!!!!!!!');
    },
    afterStepSubmit: async function(){
        console.log('LISTENTO_ALL_FLOWS processTrigger afterStepSubmit Called!!!!!!!!!!!!!!!!');
    },
}