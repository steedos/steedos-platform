const _ = require('underscore');

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
    }
}