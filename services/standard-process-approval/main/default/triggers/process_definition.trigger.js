const _ = require("underscore");
const util = require('@steedos/standard-objects').util;
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const InternalData = require('@steedos/standard-objects').internalData;

function setSpaceAndOwner(record, that){
    record['space'] = that.spaceId
    record['owner'] = that.userId
}

const getInternalApprovalProcesses = function(sourceApprovalProcesses, filters){
    delete filters.active;
    let dbApprovalProcesses = Creator.getCollection("process_definition").find(filters, {fields:{_id:1, name:1}}).fetch();
    let approvalProcesses = [];

    if(!filters.is_system){
        _.forEach(sourceApprovalProcesses, function(doc){
            if(!_.find(dbApprovalProcesses, function(p){
                return p.name === doc.name
            })){
                approvalProcesses.push(doc);
            }
        })
    }
    return approvalProcesses;
}

module.exports = {
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

        objectql.checkFormula(this.doc.entry_criteria, this.doc.object_name)

        if(!this.doc.initial_submission_record_lock){
            this.doc.initial_submission_record_lock = 'lock';
        }
        if(!this.doc.recall_record_lock){
            this.doc.recall_record_lock = 'unlock';
        }
    },
    beforeUpdate: async function () {
        if(_.has(this.doc, 'object_name')){
            var process = await objectql.getObject("process_definition").findOne(this.id);
            if(process.object_name != this.doc.object_name){
                throw new Error('禁止修改对象名称');
            }
        };
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }

        objectql.checkFormula(this.doc.entry_criteria, this.doc.object_name)
    },
    afterFind: async function(){
        let spaceId = this.spaceId;
        let filters = InternalData.parserFilters(this.query.filters)
        let approvalProcesses = [];
        if(filters.name){
            approvalProcess = register.getSourceApprovalProcess(filters.name);
            if(approvalProcess){
                approvalProcesses.push(approvalProcess);
            }
        }else{
            approvalProcesses = register.getSourceApprovalProcesses();
        }

        if (filters.object_name){
            approvalProcesses = _.where(approvalProcesses, {object_name: filters.object_name});
        }

        approvalProcesses = getInternalApprovalProcesses(approvalProcesses, filters);

        if(approvalProcesses){
            this.data.values = this.data.values.concat(approvalProcesses)
            this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let approvalProcesses = [];
        if(filters.name){
            approvalProcess = register.getSourceApprovalProcess(filters.name);
            if(approvalProcess){
                approvalProcesses.push(approvalProcess);
            }
        }else{
            approvalProcesses = register.getSourceApprovalProcesses();
        }

        if (filters.object_name){
            approvalProcesses = _.where(approvalProcesses, {object_name: filters.object_name});
        }

        approvalProcesses = getInternalApprovalProcesses(approvalProcesses, filters);

        if(approvalProcesses){
            this.data.values = this.data.values.concat(approvalProcesses)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let approvalProcesses = [];
        if(filters.name){
            approvalProcess = register.getSourceApprovalProcess(filters.name);
            if(approvalProcess){
                approvalProcesses.push(approvalProcess);
            }
        }else{
            approvalProcesses = register.getSourceApprovalProcesses();
        }

        if (filters.object_name){
            approvalProcesses = _.where(approvalProcesses, {object_name: filters.object_name});
        }

        approvalProcesses = getInternalApprovalProcesses(approvalProcesses, filters);

        if(approvalProcesses){
            this.data.values = this.data.values + approvalProcesses.length
        }
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            if(id){
                let approvalProcess = objectql.getSourceApprovalProcess(id);
                if(approvalProcess){
                    setSpaceAndOwner(approvalProcess, this);
                    this.data.values = approvalProcess;
                }
            }
        }
    }
}