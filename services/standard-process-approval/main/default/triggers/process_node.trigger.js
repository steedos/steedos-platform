const _ = require("underscore");
const objectql = require('@steedos/objectql');

function setSpaceAndOwner(record, that){
    record['space'] = that.spaceId
    record['owner'] = that.userId
}


const reviseRecordOrder = async function (processId, record) {
    let processNodes = await objectql.getObject("process_node").find({ filters: ['process_definition', '=', processId], sort: 'order asc' });
    if (record) {
        const recordOrder = record.order;
        const recordId = record._id;
        const afterNodes = _.filter(processNodes, function (node) {
            if (node._id != recordId && node.order >= recordOrder) {
                return true;
            }
            return false;
        })
        let _afterIndex = recordOrder + 1;
        for (const processNode of afterNodes) {
            await objectql.getObject("process_node").directUpdate(processNode._id, { order: _afterIndex });
            _afterIndex++;
        }
        processNodes = await objectql.getObject("process_node").find({ filters: ['process_definition', '=', processId], sort: 'order asc' });
    }
    let _index = 1;
    for (const processNode of processNodes) {
        if (processNode.order != _index) {
            await objectql.getObject("process_node").directUpdate(processNode._id, { order: _index });
        }
        _index++;
    }

    const processNodeFirst = await objectql.getObject("process_node").find({ filters: [['process_definition', '=', processId], ['order', '=', 1]] });
    for (const processNode of processNodeFirst) {
        if (processNode.reject_behavior != 'reject_request') {
            await objectql.getObject("process_node").directUpdate(processNode._id, { reject_behavior: 'reject_request' });
        }
    }

    const newProcessNodes = await objectql.getObject("process_node").find({ filters: ['process_definition', '=', processId], sort: 'order asc' });
    for (const processNode of newProcessNodes) {
        if (processNode.order != 1) {
            if(processNode.order == newProcessNodes.length){
                if(processNode.if_criteria_not_met != 'approve'){
                    await objectql.getObject("process_node").directUpdate(processNode._id, { if_criteria_not_met: 'approve' });
                }
            }else{
                if(processNode.if_criteria_not_met === 'reject'){
                    await objectql.getObject("process_node").directUpdate(processNode._id, { if_criteria_not_met: 'approve' });
                }
            }
        }
    }
}

const allowChange = async function(processId){
    if(processId){
        var process = await objectql.getObject("process_definition").findOne(processId);
        if(process){
            if(process.active){
                return false;    
            }else{
                var processInstancesCount = await objectql.getObject('process_instance').count({filters: ['process_definition', '=', processId]});
                if(processInstancesCount > 0){
                    return false;
                }
            }
            return true
        }else{
            throw new Error('未找到批准过程');    
        }
    }else{
        throw new Error('未找到批准过程');
    }
}

const allowEdit = async function(recordId, doc){
    var unAllowEditFields = ['process_definition', 'filtrad', 'entry_criteria', 'if_criteria_not_met', 'reject_behavior'];
    var record = await objectql.getObject('process_node').findOne(recordId);
    if(record){
        if(!(await allowChange(record.process_definition))){
            _.each(unAllowEditFields, function(fieldName){
                if(_.has(doc, fieldName) && doc[fieldName] != record[fieldName]){
                    throw new Error('批准过程已启用或者已提交过审批，不能修改审批步骤的批准过程、步骤条件、拒绝行为');
                }
            })
        }
    }
}

const getProcessNodeObjectName = async function(processId){
    const process = await objectql.getObject("process_definition").findOne(processId);
    if(process){
        return process.object_name
    }
}


const getSourceApprovalProcessNodes = ()=>{
    const nodes = [];
    _.each(objectql.getSourceApprovalProcesses(), (item)=>{
        _.each(item.process_nodes, (pNode)=>{
            nodes.push(Object.assign({}, pNode, {process_definition: item._id, _id: `${item.name}.${pNode.name}`}))
        })

    })
    return nodes;
}

module.exports = {
    beforeInsert: async function () {

        if(!(await allowChange(this.doc.process_definition)))
        {
            throw new Error('批准过程已启用或者已提交过审批, 禁止添加、删除批准步骤'); 
        }

        if (this.doc.order === 1) {
            this.doc.reject_behavior = 'reject_request'
        }

        if (this.doc.order != 1 && this.doc.if_criteria_not_met === 'reject') {
            throw new Error('仅第一个步骤的不满足条件可以为拒绝记录');
        }

        if (this.doc.order === 1) {
            this.doc.reject_behavior = 'reject_request';
        }
        await objectql.checkAPIName(this.object_name, 'name', this.doc.name, null, [['process_definition', '=', this.doc.process_definition]]);
        if(!this.doc.filtrad){
            const objectName = await getProcessNodeObjectName(this.doc.process_definition);
            if(objectName){
                objectql.checkFormula(this.doc.entry_criteria, objectName)
            }
        }

    },
    afterInsert: async function () {
        await reviseRecordOrder(this.doc.process_definition, this.doc);
    },
    beforeUpdate: async function () {

        await allowEdit(this.id, this.doc);

        if (this.doc.order === 1) {
            this.doc.reject_behavior = 'reject_request'
        }
        if (_.has(this.doc, 'process_definition')) {
            const record = await objectql.getObject("process_node").findOne(this.id)
            if (record.process_definition != this.doc.process_definition) {
                throw new Error('禁止修改 批准过程 字段');
            }
        }
        if (_.has(this.doc, 'name')) {
            await objectql.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['process_definition', '=', this.doc.process_definition]]);
        }

        if(!this.doc.filtrad && this.doc.process_definition){
            const objectName = await getProcessNodeObjectName(this.doc.process_definition);
            if(objectName){
                objectql.checkFormula(this.doc.entry_criteria, objectName)
            }
        }
    },
    afterUpdate: async function () {
        const record = await objectql.getObject("process_node").findOne(this.id)
        await reviseRecordOrder(record.process_definition, record);
    },
    beforeDelete: async function(){
        let doc = await objectql.getObject('process_node').findOne(this.id);
        if(!(await allowChange(doc.process_definition)))
        {
            throw new Error('批准过程已启用或者已提交过审批, 禁止添加、删除批准步骤'); 
        }
    },
    afterDelete: async function () {
        await reviseRecordOrder(this.previousDoc.process_definition);
    },
    afterFind: async function(){
        let spaceId = this.spaceId;
        let sourceData = getSourceApprovalProcessNodes();
        this.data.values = this.data.values.concat(sourceData);
        const values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
        for(let node of values){
            setSpaceAndOwner(node, this);
        }
        this.data.values = values

    },
    afterCount: async function(){
        let spaceId = this.spaceId;
        this.data.values = this.data.values + objectql.getSteedosSchema().metadataDriver.count(getSourceApprovalProcessNodes(), this.query, spaceId);
    },
    afterFindOne: async function(){
        let spaceId = this.spaceId;
        if(_.isEmpty(this.data.values)){
            const records = objectql.getSteedosSchema().metadataDriver.find(getSourceApprovalProcessNodes(), {filters: ['_id', '=', this.id]}, spaceId);
            if(records.length > 0){
                this.data.values = records[0]
            }
        }
    }
}