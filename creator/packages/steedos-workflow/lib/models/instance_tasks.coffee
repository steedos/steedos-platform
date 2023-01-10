db.instance_tasks = new Meteor.Collection('instance_tasks')

db.instance_tasks._simpleSchema = new SimpleSchema
    instance:
        type: String
    trace:
        type: String
    is_finished:
        type: String
    user:
        type: String
    user_name:
        type: String
    handler:
        type: String
    handler_name:
        type: String
    handler_organization:
        type: String
    handler_organization_name:
        type: String
    handler_organization_fullname:
        type: String
    start_date:
        type: Date
    due_date:
        type: Date
    is_read:
        type: Boolean
    is_error:
        type: Boolean
    values:
        type: Object
    deadline:
        type: Date
    remind_date:
        type: Date
    reminded_count:
        type: Number
    read_date:
        type: Date
    description:
        type: String
    modified:
        type: Date
    modified_by:
        type: String
    sign_show:
        type: Boolean
    judge:
        type: String
    next_steps:
        type: Array
    "next_steps.$":
        type: Object
    "next_steps.$.step":
        type: String
    "next_steps.$.users":
        type: [String]
    finish_date:
        type: Date
    cost_time:
        type: Number
    space:
        type: String
    instance_name:
        type: String
    submitter:
        type: String
    submitter_name:
        type: String
    applicant:
        type: String
    applicant_name:
        type: String
    applicant_organization_name:
        type: String
    submit_date:
        type: Date
    flow:
        type: String
    flow_name:
        type: String
    form:
        type: String
    step:
        type: String
    step_name:
        type: String
    category_name:
        type: String
    instance_state:
        type: String
