module.exports = {
    generator: function (object_name, record_id) {
        var result = Steedos.authRequest(`/api/v4/api_keys/call/generator`, {type: 'post', async: false});
        navigate("/app/admin/api_keys/view/" + result._id);
    },
    generatorVisible: function () {
        return true
    }
}