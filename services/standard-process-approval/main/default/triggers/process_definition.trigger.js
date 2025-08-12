const _ = require("underscore");
const { checkAPIName } = require('@steedos/objectql')
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const odataMongodb = require("@steedos/odata-v4-mongodb");

function parserFilters(filters){
    if(_.isString(filters)){
        filters = odataMongodb.createFilter(filters)
    }
    let query = {};
    if(_.isArray(filters) && filters.length > 0 && _.isArray(filters[0])){
        _.each(filters,function(filter){
            Object.assign(query, parserFilters(filter))
        })
    }else if(_.isArray(filters) && filters.length > 0){
        if(filters[1] && filters[1] == '='){
            let key = filters[0]
            let value = filters[2]
            Object.assign(query, {[key]: value})
        }else if(filters[1] && (filters[1] == '!=' || filters[1] == '<>')){
            let key = filters[0]
            let value = filters[2]
            Object.assign(query, {[key]: {$ne: value}})
        }else if(filters[1] && filters[1] == 'in'){
            let key = filters[0]
            let value = filters[2]
            Object.assign(query, {[key]: {$in: value}})
        }else{
            _.each(filters,function(filter){
                let parsedFilters = parserFilters(filter);
                if(query._id && query._id.$ne && parsedFilters._id && parsedFilters._id.$ne){
                    parsedFilters._id.$ne = [parsedFilters._id.$ne]
                    parsedFilters._id.$ne = parsedFilters._id.$ne.concat(query._id.$ne);
                    delete query._id;
                }
                Object.assign(query, parsedFilters)
            })
        }
    }else{
        _.each(filters, function (v, k) {
            if(_.isArray(v) && v.length > 0){
                Object.assign(query, parserFilters(v))
            }else{
                if (k === '$and') {
                    Object.assign(query, parserFilters(v))
                } else {
                    if(_.isArray(filters) && _.isObject(v)){
                        Object.assign(query, v)
                    }else{
                        Object.assign(query, {[k]: v})
                    }
                }
            }
            
        })
    }
    return query;
}

function setSpaceAndOwner(record, that){
    record['space'] = that.spaceId
    record['owner'] = that.userId
}

const getInternalApprovalProcesses = async function(sourceApprovalProcesses, filters){


    const datasource = objectql.getDataSource('default');
    const adapter = datasource.adapter
    await adapter.connect()
    const collection = adapter.collection('process_definition');

    delete filters.active;
    let dbApprovalProcesses = await collection.find(filters, {fields:{_id:1, name:1}}).toArray();
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
        await checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

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
            await checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }

        objectql.checkFormula(this.doc.entry_criteria, this.doc.object_name)
    },
    afterFind: async function(){
        let spaceId = this.spaceId;
        let filters = parserFilters(this.query.filters)
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

        approvalProcesses = await getInternalApprovalProcesses(approvalProcesses, filters);

        if(approvalProcesses){
            this.data.values = this.data.values.concat(approvalProcesses)
            this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
        }
    },
    afterAggregate: async function(){
        let filters = parserFilters(this.query.filters)
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

        approvalProcesses = await getInternalApprovalProcesses(approvalProcesses, filters);

        if(approvalProcesses){
            this.data.values = this.data.values.concat(approvalProcesses)
        }
    },
    afterCount: async function(){
        let filters = parserFilters(this.query.filters)
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

        approvalProcesses = await getInternalApprovalProcesses(approvalProcesses, filters);

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