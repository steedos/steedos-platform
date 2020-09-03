Steedos.ProcessManager = {};

Steedos.ProcessManager.showApproveButs = function(objectName, recordId){
    var record = Creator.getCollection(objectName).findOne(recordId);
    if(record){
        return record.step_status === 'pending';
    }
}
