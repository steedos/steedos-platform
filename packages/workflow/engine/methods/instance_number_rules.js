/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-22 15:02:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 15:03:32
 * @Description: 
 */
var _eval;

_eval = require('eval');

module.exports = {
    instanceNumberBuilder: function (spaceId, name) {
        var _NUMBER, _YYYY, context, date, e, numberRules, padding, res, rules, script;
        numberRules = db.instance_number_rules.findOne({
            space: spaceId,
            name: name
        });
        if (!numberRules) {
            throw new Meteor.Error('error!', `${name}`);
        }
        date = new Date();
        context = {};
        context._ = _;
        _YYYY = date.getFullYear();
        _NUMBER = (numberRules.number || 0) + 1;
        context.YYYY = _.clone(_YYYY);
        context.MM = date.getMonth() + 1;
        context.mm = date.getMonth() + 1;
        if (context.MM < 10) {
            context.MM = "0" + context.MM;
        }
        context.DD = date.getDate();
        context.dd = date.getDate();
        if (context.DD < 10) {
            context.DD = "0" + context.DD;
        }
        if (context.YYYY !== numberRules.year) {
            _NUMBER = numberRules.first_number || 1;
        }
        let pLenConst = process.env.STEEDOS_WORKFLOW_INSTANCE_NUMBER_RULES_PADDING_LEN
        let paddingLen = 5
        if (pLenConst) {
            const _paddingLen = parseInt(pLenConst);
            if (_paddingLen >= 0) { // 处理 _paddingLen 值为NaN的情况
                paddingLen = _paddingLen
            }
        }
        padding = function (num, length) {
            if (length == 0) {
                return num;
            }
            var diff, len;
            len = (num + '').length;
            diff = length - len;
            if (diff > 0) {
                return Array(diff + 1).join('0') + num;
            }
            return num;
        };
        context.NUMBER = padding(_.clone(_NUMBER), paddingLen);
        rules = numberRules.rules.replace("{YYYY}", "' + YYYY + '").replace("{MM}", "' + MM + '").replace("{NUMBER}", "' + NUMBER + '");
        script = `var newNo = '${rules}'; exports.newNo = newNo`;
        try {
            res = _eval(script, "newNo", context, false).newNo;
            db.instance_number_rules.update({
                _id: numberRules._id
            }, {
                $set: {
                    year: _YYYY,
                    number: _NUMBER
                }
            });
            console.log(this.userId, res);
        } catch (error) {
            e = error;
            res = {
                _error: e
            };
        }
        return res;
    }
};
