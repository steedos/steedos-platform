const { SteedosActionType } = require("@steedos/objectql");

module.exports = {
    generator: function (object_name, record_id) {
        var result = Steedos.authRequest(`/api/v4/api_keys/call/generator`, {type: 'post', async: false});
        FlowRouter.go("/app/-/api_keys/view/" + result._id);
        FlowRouter.reload();
    },
    generatorVisible: function () {
        return true
    }
}