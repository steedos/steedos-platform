/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-22 15:25:52
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 15:26:25
 * @Description: 
 */
module.exports = {
    next_step_users_not_found: function (deal_type, step_name, params) {
        var approver_roles, lang, roles, roles_name, str, user;
        check(deal_type, String);
        check(step_name, String);
        check(params, Object);
        str = "";
        user = db.users.findOne({
            _id: this.userId
        }, {
            fields: {
                locale: 1
            }
        });
        //设置当前语言环境
        lang = 'en';
        if (user.locale === 'zh-cn') {
            lang = 'zh-CN';
        }
        // 指定审批岗位
        if (deal_type === 'applicantRole') {
            approver_roles = params.approver_roles;
            roles = db.flow_roles.find({
                _id: {
                    $in: approver_roles
                }
            }, {
                fields: {
                    name: 1
                }
            }).fetch();
            roles_name = _.pluck(roles, 'name').toString();
            str = TAPi18n.__('next_step_users_not_found.applicant_role', {
                step_name: step_name,
                role_name: roles_name
            }, lang);
        }
        return str;
    }
};
