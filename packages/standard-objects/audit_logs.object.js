const core = require('@steedos/core');
db.audit_logs = Creator.Collections.audit_logs ? Creator.Collections.audit_logs : core.newCollection('audit_logs');

// db.audit_logs._simpleSchema = new SimpleSchema({
//     c_name: {
//         type: String
//     },
//     c_action: {
//         type: String
//     },
//     object_id: {
//         type: String
//     },
//     object_name: {
//         type: String
//     },
//     value_previous: {
//         type: Object,
//         optional: true,
//         blackbox: true
//     },
//     value: {
//         type: Object,
//         optional: true,
//         blackbox: true
//     },
//     created_by: {
//         type: String
//     },
//     created_by_name: {
//         type: String
//     },
//     created: {
//         type: Date
//     }
// });

// db.audit_logs.attachSchema(db.audit_logs._simpleSchema);