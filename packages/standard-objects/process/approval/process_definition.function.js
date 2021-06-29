const objectql = require("@steedos/objectql");
module.exports = {
  copy: async function (req, res) {
    try {
      const params = req.params;
      const userSession = req.user;
      const recordId = params._id;
      const steedosSchema = objectql.getSteedosSchema();
      const pdObj = steedosSchema.getObject('process_definition');
      const pnObj = steedosSchema.getObject('process_node');
      const nowTime = new Date().getTime();
      let pd = await pdObj.findOne(recordId, undefined, userSession);
      delete pd._id;
      pd.name = `pd_${nowTime}`; // 名称长度不能大于20个字符；名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符
      pd.active = false; // 批准过程已启用或者已提交过审批, 禁止添加、删除批准步骤
      let newPD = await pdObj.insert(pd);
      let newPDID = newPD._id;
      let pns = await pnObj.find({ filters: ['process_definition', '=', recordId] }, userSession);
      for (let index = 0; index < pns.length; index++) {
        let pn = pns[index];
        delete pn._id;
        pn.process_definition = newPDID;
        pn.name = `pn_${nowTime}_${index}`;
        const now = new Date();
        pn.created = now;
        pn.created_by = userSession.userId
        pn.modified = now;
        pn.modified_by = userSession.userId
        await pnObj.directInsert(pn);
      }
      res.status(200).send({ _id: newPDID });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        error: error.message
      });
    }
  },
  customize: async function (req, res) {
    try {
      const params = req.params;
      const userSession = req.user;
      const recordId = params._id;
      const steedosSchema = objectql.getSteedosSchema();
      const pdObj = steedosSchema.getObject('process_definition');
      const pnObj = steedosSchema.getObject('process_node');

      const now = new Date();

      let pd = await pdObj.findOne(recordId, undefined, userSession);

      if(pd.initial_submission_updates_field_actions){
        for(let i=0; i<pd.initial_submission_updates_field_actions.length; i++){
          let actionName = pd.initial_submission_updates_field_actions[i]
          pd.initial_submission_updates_field_actions[i] = await getNewActionIdByName(actionName, userSession);
        }
      }
      if(pd.final_approval_updates_field_actions){
        for(let i=0; i<pd.final_approval_updates_field_actions.length; i++){
          let actionName = pd.final_approval_updates_field_actions[i]
          pd.final_approval_updates_field_actions[i] = await getNewActionIdByName(actionName, userSession);
        }
      }
      if(pd.final_rejection_updates_field_actions){
        for(let i=0; i<pd.final_rejection_updates_field_actions.length; i++){
          let actionName = pd.final_rejection_updates_field_actions[i]
          pd.final_rejection_updates_field_actions[i] = await getNewActionIdByName(actionName, userSession);
        }
      }
      if(pd.recall_updates_field_actions){
        for(let i=0; i<pd.recall_updates_field_actions.length; i++){
          let actionName = pd.recall_updates_field_actions[i]
          pd.recall_updates_field_actions[i] =  await getNewActionIdByName(actionName, userSession);
        }
      }

      delete pd._id;
      delete pd.is_system;
      pd.active = false; // 批准过程已启用或者已提交过审批, 禁止添加、删除批准步骤
      let newPD = await pdObj.insert(pd);
      let newPDID = newPD._id;
      let pns = await pnObj.find({ filters: ['process_definition', '=', recordId] }, userSession);
      for (let index = 0; index < pns.length; index++) {
        let pn = pns[index];
        delete pn._id;
        delete pn.is_system;
        pn.process_definition = newPDID;

        if(pn.approval_updates_field_actions){
          for(let i=0; i<pn.approval_updates_field_actions.length; i++){
            let actionName = pn.approval_updates_field_actions[i]
            pn.approval_updates_field_actions[i] = await getNewActionIdByName(actionName, userSession);
          }
        }

        if(pn.rejection_updates_field_actions){
          for(let i=0; i<pn.rejection_updates_field_actions.length; i++){
            let actionName = pn.rejection_updates_field_actions[i]
            pn.rejection_updates_field_actions[i] = await getNewActionIdByName(actionName, userSession);
          }
        }
        pn.created = now;
        pn.created_by = userSession.userId
        pn.modified = now;
        pn.modified_by = userSession.userId
        await pnObj.directInsert(pn);
      }
      res.status(200).send({ _id: newPDID });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        error: error.message
      });
    }
  }

}

async function getNewActionIdByName(actionName, userSession){
  const steedosSchema = objectql.getSteedosSchema();
  const fuObj = steedosSchema.getObject('action_field_updates');
  let dbAction = await fuObj.find({filters: [['name','=', actionName], ['is_system','!=', true]]}, userSession);
  if(dbAction && dbAction.length >0){
    return dbAction[0]._id;
  }
  const now = new Date();
  let action = objectql.getActionFieldUpdate(actionName);
  if(action){
    delete action._id
    delete action.is_system
    action.created = now;
    action.created_by = userSession.userId
    action.modified = now;
    action.modified_by = userSession.userId
    action.space = userSession.spaceId
    let newAction = await fuObj.insert(action, userSession);
    return newAction._id;
  }
  return actionName
}