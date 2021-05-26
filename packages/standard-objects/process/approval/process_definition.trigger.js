const _ = require("underscore");
const util = require('../../util');
const objectql = require('@steedos/objectql');
const InternalData = require('../../core/internalData');

function setSpaceAndOwner(record, that){
    record['space'] = that.spaceId
    record['owner'] = that.userId
}
module.exports = {
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

        objectql.checkFormula(this.doc.entry_criteria, this.doc.object_name)
    },
    beforeUpdate: async function () {
        if(_.has(this.doc, 'object_name')){
            var process = await objectql.getObject("process_definition").findOne(this.id);
            if(process.object_name != this.doc.object_name){
                throw new Error('禁止修改对象名称');
            }
        };
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id);
        }

        objectql.checkFormula(this.doc.entry_criteria, this.doc.object_name)
    },
    afterFind: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let approvalProcesses = [];
        if(filters.name){
            approvalProcess = objectql.getSourceApprovalProcess(filters.name);
            if(approvalProcess){
                approvalProcesses.push(approvalProcess);
            }
        }else{
            approvalProcesses = objectql.getSourceApprovalProcesses();
        }

        approvalProcesses = InternalData.filtSourceFile(approvalProcesses, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(approvalProcesses, "name")

        let differentNames = _.difference(sourceNames, existNames);
        let that = this
        approvalProcesses = _.filter(approvalProcesses, function(item){ 
            setSpaceAndOwner(approvalProcesses, that);
            return _.contains(differentNames, item.name)
        })

        if(approvalProcesses){
            this.data.values = this.data.values.concat(approvalProcesses)
        }
    },
    afterAggregate: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let approvalProcesses = [];
        if(filters.name){
            approvalProcess = objectql.getSourceApprovalProcess(filters.name);
            if(approvalProcess){
                approvalProcesses.push(approvalProcess);
            }
        }else{
            approvalProcesses = objectql.getSourceApprovalProcesses();
        }

        approvalProcesses = InternalData.filtSourceFile(approvalProcesses, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(approvalProcesses, "name")

        let differentNames = _.difference(sourceNames, existNames);
        let that = this
        approvalProcesses = _.filter(approvalProcesses, function(item){ 
            setSpaceAndOwner(approvalProcesses, that);
            return _.contains(differentNames, item.name)
        })

        if(approvalProcesses){
            this.data.values = this.data.values.concat(approvalProcesses)
        }
    },
    afterCount: async function(){
        let filters = InternalData.parserFilters(this.query.filters)
        let approvalProcesses = [];
        if(filters.name){
            approvalProcess = objectql.getSourceApprovalProcess(filters.name);
            if(approvalProcess){
                approvalProcesses.push(approvalProcess);
            }
        }else{
            approvalProcesses = objectql.getSourceApprovalProcesses();
        }

        approvalProcesses = InternalData.filtSourceFile(approvalProcesses, filters)

        let existNames = _.pluck(this.data.values, "name")
        let sourceNames = _.pluck(approvalProcesses, "name")

        let differentNames = _.difference(sourceNames, existNames);
        let that = this
        approvalProcesses = _.filter(approvalProcesses, function(item){ 
            setSpaceAndOwner(approvalProcesses, that);
            return _.contains(differentNames, item.name)
        })

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