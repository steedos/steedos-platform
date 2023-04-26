/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-02-27 17:33:21
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-02-27 17:33:38
 * @Description: 
 */
try {
    db.apps = new Meteor.Collection('apps');

    db.spaces = new Meteor.Collection('spaces');

    db.space_users = new Meteor.Collection('space_users');

    db.organizations = new Meteor.Collection('organizations');

    db.audit_logs = new Meteor.Collection('audit_logs');

    db.space_settings = new Meteor.Collection('space_settings');

    db.steedos_keyvalues = new Meteor.Collection('steedos_keyvalues');

  } catch (error) {
    console.error('new platform Collection ',error)
  }

  try {
    db.categories = new Meteor.Collection('categories');
    db.flows = new Meteor.Collection('flows');
    db.flow_instances = new Meteor.Collection('flow_instances');
    db.forms = new Meteor.Collection('forms');
    db.instances = new Meteor.Collection('instances');
    db.instance_traces = new Meteor.Collection('instance_traces');
    db.form_versions = new Meteor.Collection('form_versions');
    db.flow_versions = new Mongo.Collection("flow_versions");
    db.space_user_signs = new Mongo.Collection("space_user_signs");
    db.flow_positions = new Mongo.Collection("flow_positions");
    db.flow_roles = new Mongo.Collection("flow_roles");
    db.instance_number_rules = new Mongo.Collection("instance_number_rules");
    db.process_delegation_rules = new Mongo.Collection("process_delegation_rules");
    db.webhooks = new Mongo.Collection("webhooks");
    db.my_approves = new Meteor.Collection('my_approves');
    db.cms_files = new Meteor.Collection('cms_files');

  } catch (error) {
    console.error('new workflow Collection ',error)
  }