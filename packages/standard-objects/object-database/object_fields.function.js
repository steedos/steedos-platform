
const objectql = require('@steedos/objectql');

module.exports = {
  recomputeFormulaValues: async function(req, res){
      try {
        const params = req.params;
        const userId = req.user && req.user.userId;
        const result = await objectql.recomputeFormulaValues(params._id, userId);
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
        const userId = req.user && req.user.userId;
        const result = await objectql.recomputeSummaryValues(params._id, userId);
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