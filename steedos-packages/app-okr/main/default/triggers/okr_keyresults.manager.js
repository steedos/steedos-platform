const objectql = require('@steedos/objectql');
/**
 * 
 * @param {string} key_result 
 */

async function caculateProcess(key_result) {
 if (!key_result) {
    return;
  }
  const steedosSchema = objectql.getSteedosSchema();
  let krObj = steedosSchema.getObject('okr_key_results__c');

  let kr = await krObj.findOne(key_result);
  if (!kr) {
    console.error(`未找到Key Results：${key_result}`);
    return;
  }

  let last_updated_date = new Date();
  last_updated_date.setFullYear(2000, 1, 1)
  let most_recent_progress_made  = 0;
  let progress = 0;
  let confidence = "3";

   (await steedosSchema.getObject('okr_kr_progress__c').find({ filters: [['key_result__c', '=', key_result]] })).forEach(function (thisline) {
//    console.error(`${thisline.update_date__c}`);
//    console.error(`${last_updated_date}`);
    if (thisline.update_date__c > last_updated_date) {
        last_updated_date = thisline.update_date__c;
        most_recent_progress_made = thisline.current_progress__c;
        progress = thisline.progress__c;
        confidence = thisline.confidence__c;
    }
  });

  let calculated_objective_progress = progress * kr.weight__c;

  await krObj.directUpdate(key_result, { last_updated_date__c: last_updated_date , most_recent_progress_made__c: most_recent_progress_made , progress__c: progress , confidence__c: confidence , calculated_objective_progress__c: calculated_objective_progress }); 

}

module.exports = {
    caculateProcess
};