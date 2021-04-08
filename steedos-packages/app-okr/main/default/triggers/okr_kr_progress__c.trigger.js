const keyResult = require('./okr_keyresults.manager');
const objective = require('./okr_objective.manager');

module.exports = {
  listenTo: 'okr_kr_progress__c2',
  beforeInsert: async function () {
    let doc = this.doc;
    let keyResult = await this.getObject('okr_key_results__c').findOne(doc.key_result__c);
    if (doc.target_type__c = 'Increase to') {
      doc.progress__c = (doc.current_progress__c-keyResult.starting_value__c) /(keyResult.target__c-keyResult.starting_value__c) ;
    } else{
      doc.progress__c = (keyResult.starting_value__c-doc.current_progress__c) /(keyResult.starting_value__c-keyResult.target__c) ;
    }  
  },

  beforeUpdate: async function () {
    let doc = this.doc;
    let keyResult = await this.getObject('okr_key_results__c').findOne(doc.key_result__c);
    if (doc.target_type__c = 'Increase to') {
      doc.progress__c = (doc.current_progress__c-keyResult.starting_value__c) /(keyResult.target__c-keyResult.starting_value__c) ;
    } else{
      doc.progress__c = (keyResult.starting_value__c-doc.current_progress__c) /(keyResult.starting_value__c-keyResult.target__c) ;
    }  
  },

   afterInsert: async function () {
    await keyResult.caculateProcess(this.doc.key_result__c);

    let objective_id = await this.getObject('okr_key_results__c').findOne(this.doc.key_result__c, { fields: ['objective__c'] });
    let objective_id2 =  objective_id.objective__c
    await objective.caculateObjective(objective_id2);
  },

  afterUpdate: async function () {
    await keyResult.caculateProcess(this.doc.key_result__c);

    let objective_id = await this.getObject('okr_key_results__c').findOne(this.doc.key_result__c, { fields: ['objective__c'] });
    let objective_id2 =  objective_id.objective__c
    await objective.caculateObjective(objective_id2);
  },

  afterDelete: async function () {
    await keyResult.caculateProcess(this.previousDoc.key_result__c);

    let objective_id = await this.getObject('okr_key_results__c').findOne(this.previousDoc.key_result__c, { fields: ['objective__c'] });
    let objective_id2 =  objective_id.objective__c
    await objective.caculateObjective(objective_id2);
  }, 
}