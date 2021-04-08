const objectql = require('@steedos/objectql');
/**
 * 
 * @param {string} key_result 
 */

async function caculateObjective(objective_id) {
 if (!objective_id) {
    return;
  }
  const steedosSchema = objectql.getSteedosSchema();
  let oObj = steedosSchema.getObject('okr_objective__c');

  let obj = await oObj.findOne(objective_id);
  if (!obj) {
    console.error(`未找到Objective：${objective_id}`);
    return;
  }

  let o_progress = 0;
  (await steedosSchema.getObject('okr_key_results__c').find({ filters: [['objective__c', '=', objective_id]] })).forEach(function (thisline) {
    o_progress += thisline.calculated_objective_progress__c ;
  });
  await oObj.directUpdate(objective_id, {  progress__c: o_progress }); 

}

module.exports = {
  caculateObjective
};