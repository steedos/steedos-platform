const objectql = require("@steedos/objectql");

module.exports = {
    listenTo: 'api_keys',
    generator: async function(req, res){
        try {
            const params = req.params;
            const userSession = req.user;
            const spaceId = userSession.spaceId;
            const userId = userSession.userId;

            const record = await objectql.getObject('api_keys').insert({
                api_key: Random.secret(),
                space: spaceId,
                owner: userId,
                active: true
            });
            res.status(200).send(record);
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    }
  }