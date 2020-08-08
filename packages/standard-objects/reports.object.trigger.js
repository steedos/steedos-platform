const _ = require('underscore');
const clone = require("clone");
const objectql = require("@steedos/objectql");
const auth = require("@steedos/auth");
const internalData = require("./core/internalData")
const permissions = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
}

const baseRecord = {
    is_system:true,
    record_permissions:permissions
}

//.report.yml 中的文件 应该包括 html、script、helper、mrt
//暂时不支持jsReport、stimulsoft-report
const getReoprts = function(){
    return _.filter(clone(objectql.getConfigs("report")), function(report){
        if(_.include(["tabular", "summary", "matrix"], report.report_type)){
            return true
        }
    })
}

module.exports = {

    listenTo: 'reports',

    beforeInsert: async function () {
        var doc = this.doc;
        if (doc.report_type === "tabular") {
            if(!(doc.columns && doc.columns.length)){
                throw new Error("creator_report_error_tabular_miss_fields");
            }
        }
        else if (doc.report_type === "summary") {
            if(!(doc.columns && doc.columns.length)){
                throw new Error("creator_report_error_summary_miss_fields");
            }
        }
        else if (doc.report_type === "matrix") {
            if(!(doc.rows && doc.rows.length) && !(doc.columns && doc.columns.length)){
                throw new Error("creator_report_error_matrix_miss_fields");
            }
        }
        else if (doc.report_type === "stimulsoft-report") {
            if(!(doc.fields && doc.fields.length)){
                throw new Error("creator_report_error_stimulsoft_report_miss_fields");
            }
        }
        else if (doc.report_type === "jsreport") {
            if(!(doc.fields && doc.fields.length)){
                throw new Error("creator_report_error_jsreport_miss_fields");
            }
        }
    },
    beforeUpdate: async function () {
        var doc = this.doc;
        if (doc.report_type === "tabular") {
            if(!(doc.columns && doc.columns.length)){
                throw new Error("creator_report_error_tabular_miss_fields");
            }
        }
        else if (doc.report_type === "summary") {
            if(!(doc.columns && doc.columns.length)){
                throw new Error("creator_report_error_summary_miss_fields");
            }
        }
        else if (doc.report_type === "matrix") {
            if(!(doc.rows && doc.rows.length) && !(doc.columns && doc.columns.length)){
                throw new Error("creator_report_error_matrix_miss_fields");
            }
        }
        else if (doc.report_type === "stimulsoft-report") {
            if(!(doc.fields && doc.fields.length)){
                throw new Error("creator_report_error_stimulsoft_report_miss_fields");
            }
        }
        else if (doc.report_type === "jsreport") {
            if(!(doc.fields && doc.fields.length)){
                throw new Error("creator_report_error_jsreport_miss_fields");
            }
        }
    },
    afterFind: async function(){
        let reports = getReoprts();
        let self = this;
        _.each(reports, function(report){
            self.data.values.push(Object.assign({}, report, baseRecord));
        })
    },
    afterAggregate: async function(){
        let reports = getReoprts();
        let self = this;
        _.each(reports, function(report){
            self.data.values.push(Object.assign({}, report, baseRecord));
        })
    },
    afterCount: async function(){
        let filters = internalData.parserFilters(this.query.filters)
        if(filters && filters.space === 'global'){
            return
        }
        let result = await objectql.getObject('reports').find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length
    },
    afterFindOne: async function(){
        let id = this.id;
        if(id && _.isEmpty(this.data.values)){
            let reports = getReoprts();
            let report = _.find(reports, function(_f){                
                return _f._id === id
            })
            if(report){
                this.data.values = Object.assign({}, report, baseRecord)
            }
            
        }
    }
}