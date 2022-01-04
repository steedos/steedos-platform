const objectql = require("@steedos/objectql");

module.exports = {
  resetFieldPermissions: async function (req, res) {
    try {
      const { params, user: userSession } = req;
      const recordId = params._id;
      await objectql.getSteedosSchema().broker.call(`permission_fields.resetFieldPermissions`, {
        permissionObjectId: recordId
      }, {
        meta: {
          user: userSession
        }
      });
      res.status(200).send({});
    } catch (error) {
      console.error(error);
      res.status(400).send({
        error: error.message
      });
    }
  }
}