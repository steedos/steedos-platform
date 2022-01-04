const Fiber = require('fibers');
const objectql = require('@steedos/objectql');
const getSteedosSchema = objectql.getSteedosSchema;

module.exports = {
  recomputeFormulaValues: async function(req, res){
      try {
        const params = req.params;
        const userId = req.user && req.user.userId;
        let fieldId = params._id;
        const fieldDoc = await getSteedosSchema().getObject("object_fields").findOne(fieldId, { fields: ["object", "name"] });
        if (!fieldDoc) {
            throw new Error(`recomputeFormulaValues:${fieldId} not found.`);
        }
        fieldId = `${fieldDoc.object}.${fieldDoc.name}`;
        const result = await objectql.recomputeFormulaValues(fieldId, req.user);
        if(result){
            res.status(200).send({ success: true });
        }
        else{
            res.status(400).send({
                success: false,
                error: {
                    reason: `The recomputeFormulaValues function return ${result}.`
                }
            });
        }
    } catch (error) {
        console.error("recomputeFormulaValues error:", error);
        res.status(400).send({
            success: false,
            error: {
                reason: error.reason,
                message: error.message,
                details: error.details,
                stack: error.stack
            }
        });
    }
  },
  recomputeSummaryValues: async function(req, res){
      try {
        const params = req.params;
        let fieldId = params._id;
        const fieldDoc = await getSteedosSchema().getObject("object_fields").findOne(fieldId, { fields: ["object", "name"] });
        if (!fieldDoc) {
            throw new Error(`recomputeFormulaValues:${fieldId} not found.`);
        }
        fieldId = `${fieldDoc.object}.${fieldDoc.name}`;
        const result = await objectql.recomputeSummaryValues(fieldId, req.user);
        if(result){
            res.status(200).send({ success: true });
        }
        else{
            res.status(400).send({
                success: false,
                error: {
                    reason: `The recomputeSummaryValues function return ${result}.`
                }
            });
        }
    } catch (error) {
        console.error("recomputeSummaryValues error:", error);
        res.status(400).send({
            success: false,
            error: {
                reason: error.reason,
                message: error.message,
                details: error.details,
                stack: error.stack
            }
        });
    }
  },
  append_to_layouts: async function (req, res) {
    try {
        const body = req.body;
        const userSession = req.user;
        const fieldAPIName = body.field
        const is_readonly = body.is_readonly
        const is_required = body.is_required
        const group = body.group
        const visible_on = body.visible_on
        const allowEdit = (await objectql.getObject('object_layouts').getUserObjectPermission(userSession)).allowEdit;
        if (!allowEdit) {
            throw new Error('无权限');
        }
        Fiber(function () {
            Creator.getCollection("object_layouts").direct.update({ space: userSession.spaceId, _id: { $in: body.layouts } }, { $push: { fields: { field_name: fieldAPIName, is_readonly: is_readonly, is_required: is_required, group: group, visible_on: visible_on} } }, {
                multi: true
            })
        }).run();
        
        res.status(200).send({state: 'SUCCESS'});
    } catch (error) {
        res.status(400).send({
            error: {
                details: error.stack,
                message: error.message,
            },
        });
    }
}
}