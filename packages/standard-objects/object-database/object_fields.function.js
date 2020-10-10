
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
  }
}