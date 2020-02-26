const objectql = require('@steedos/objectql')

Creator.Objects['reports'].methods = {
    copy: async function (req, res) {
        let error = '';
        try {
            let userSession = req.user;
            let body = req.body;
            let recordId = body.recordId;
            const templateSpaceId = objectql.getTemplateSpaceId();
            if(recordId && templateSpaceId && userSession){
                let record = await objectql.getObject('reports').findOne(recordId, {filters: ['space','=', templateSpaceId]});
                if(record){
                    delete record._id
                    delete record.owner
                    delete record.created_by
                    delete record.modified_by
                    record.space = userSession.spaceId
                    let newRecord = await objectql.getObject('reports').insert(record, userSession);
                    return res.send({
                        value: newRecord
                    });
                }
            }else{
                if(!recordId){
                    error = 'Validate Request -- Missing recordId'
                }
                if(!record){
                    error = 'Validate Request -- not find record by recordId' 
                }
                if(!userSession){
                    return res.status(401).send({
                        "success": false
                    });
                }
            }
        } catch (err) {
            error = err
        }

        return res.status(500).send({
            "error": error,
            "success": false
        });
    }
}