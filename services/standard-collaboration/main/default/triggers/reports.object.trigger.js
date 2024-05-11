const _ = require('underscore');
const clone = require("clone");
const objectql = require("@steedos/objectql");
const auth = require("@steedos/auth");
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
    const reports = [];
    _.each(_.filter(clone(objectql.getConfigs("report")), function(report){
        if(_.include(["tabular", "summary", "matrix"], report.report_type)){
            return true
        }
    }), (report)=>{
        reports.push(Object.assign({}, report, baseRecord))
    });
    return reports;
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
    beforeFind: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
        const { spaceId } = this;
        let dataList = await getReoprts();
        if (!_.isEmpty(dataList)) {
            const cloneValues = clone(this.data.values, false);
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    cloneValues.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(cloneValues, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }

    },
    afterCount: async function(){
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            const all = await getReoprts();
            const id = this.id;
            this.data.values = _.find(all, function(item){
                return item._id === id
            });
        }
    }
}