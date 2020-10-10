const objectql = require("@steedos/objectql");
module.exports = {
  copy: async function (req, res) {
    try {
      const params = req.params;
      const recordId = params._id;
      const steedosSchema = objectql.getSteedosSchema();
      const pdObj = steedosSchema.getObject('process_definition');
      const pnObj = steedosSchema.getObject('process_node');
      const nowTime = new Date().getTime();
      let pd = await pdObj.findOne(recordId);
      delete pd._id;
      pd.name = `pd_${nowTime}`; // 名称长度不能大于20个字符；名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符
      pd.active = false; // 批准过程已启用或者已提交过审批, 禁止添加、删除批准步骤
      let newPD = await pdObj.insert(pd);
      let newPDID = newPD._id;
      let pns = await pnObj.find({ filters: ['process_definition', '=', recordId] });
      for (let index = 0; index < pns.length; index++) {
        const pn = pns[index];
        delete pn._id;
        pn.process_definition = newPDID;
        pn.name = `pn_${nowTime}_${index}`;
        await pnObj.insert(pn);
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