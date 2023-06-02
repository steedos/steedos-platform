Fiber = require('fibers')
const core = require('@steedos/core');

db.spaces = core.newCollection('spaces');

// steedos-workflow包中相关脚本迁移过来
if (Meteor.isServer) {
    Meteor.startup(function () {
        return db.spaces.createTemplateFormAndFlow = function (space_id) {
            var owner_id, root_org, space, template_forms, user;
            if (db.forms.find({
                space: space_id
            }).count() > 0) {
                return false;
            }
            space = db.spaces.findOne(space_id, {
                fields: {
                    owner: 1
                }
            });
            if (!space) {
                return false;
            }
            owner_id = space.owner;
            user = db.users.findOne(space.owner, {
                fields: {
                    locale: 1
                }
            });
            if (!user) {
                reurn(false);
            }
            root_org = db.organizations.findOne({
                space: space_id,
                parent: null
            });
            if (!root_org) {
                return false;
            }
            if (db.forms.find({
                space: space_id
            }).count() > 0) {
                return;
            }
            template_forms = [];
            if (user.locale === "zh-cn") {
                template_forms = EJSON.clone(workflowTemplate["zh-CN"]);
            } else {
                template_forms = EJSON.clone(workflowTemplate["en"]);
            }
            if (template_forms && template_forms instanceof Array) {
                return template_forms.forEach(function (form) {
                    return steedosImport.workflow(owner_id, space_id, form, true);
                });
            }
        };
    });
}