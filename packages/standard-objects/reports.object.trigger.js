const _ = require('underscore');

module.exports = {

    listenTo: 'reports',

    beforeInsert: async function () {
        var doc = this.doc
        if (doc.report_type === "matrix") {
            if(!(doc.rows && doc.rows.length) && !(doc.columns && doc.columns.length)){
                throw new Error("creator_report_error_matrix_miss_fields");
            }
        }
    },
    beforeUpdate: async function () {
        var doc = this.doc
        if (doc.report_type === "matrix") {
            if(!(doc.rows && doc.rows.length) && !(doc.columns && doc.columns.length)){
                throw new Error("creator_report_error_matrix_miss_fields");
            }
        }
    }
}