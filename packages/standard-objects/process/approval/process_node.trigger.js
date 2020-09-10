const _ = require("underscore");
const objectql = require('@steedos/objectql');

const reviseRecordOrder = async function(processId, record){
    let processNodes = await objectql.getObject("process_node").find({filters: ['process_definition', '=', processId], sort: 'order asc'});
    if(record){
        const recordOrder = record.order;
        const recordId = record._id;
        const afterNodes = _.filter(processNodes, function(node){
            if(node._id != recordId && node.order >= recordOrder){
                return true;
            }
            return false;
        })
        let _afterIndex = recordOrder + 1;
        for (const processNode of afterNodes) {
            await objectql.getObject("process_node").directUpdate(processNode._id, {order: _afterIndex});
            _afterIndex++;
        }
        processNodes = await objectql.getObject("process_node").find({filters: ['process_definition', '=', processId], sort: 'order asc'});
    }
    let _index = 1;
    for (const processNode of processNodes) {
        if(processNode.order != _index){
            await objectql.getObject("process_node").directUpdate(processNode._id, {order: _index});
        }
        _index++;
    }

    const processNodeFirst = await objectql.getObject("process_node").find({filters: [['process_definition', '=', processId], ['order', '=', 1]]});
    for (const processNode of processNodeFirst) {
        if(processNode.reject_behavior != 'reject_request'){
            await objectql.getObject("process_node").directUpdate(processNode._id, {reject_behavior: 'reject_request'});
        }
    }
}

module.exports = {
  beforeInsert: async function () {
    if(this.doc.order === 1){
        this.doc.reject_behavior = 'reject_request'
    }

    if(this.doc.order != 1 && this.doc.if_criteria_not_met === 'reject'){
        throw new Error('仅第一个步骤的不满足条件可以为拒绝记录');
    }

    if(this.doc.order === 1){
        this.doc.reject_behavior = 'reject_request';
    }

  },
  afterInsert: async function () {
    await reviseRecordOrder(this.doc.process_definition, this.doc);
  },
  beforeUpdate: async function(){
    if(this.doc.order === 1){
        this.doc.reject_behavior = 'reject_request'
    }
    if(_.has(this.doc, 'process_definition')){
        const record = await objectql.getObject("process_node").findOne(this.id)
        if(record.process_definition != this.doc.process_definition){
            throw new Error('禁止修改 批准过程 字段');
        }
    }
  },
  afterUpdate: async function(){
    const record = await objectql.getObject("process_node").findOne(this.id)
    await reviseRecordOrder(record.process_definition, record);
  },
  afterDelete: async function(){
    await reviseRecordOrder(this.previousDoc.process_definition);
  }
}