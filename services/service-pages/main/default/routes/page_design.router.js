const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const fs = require('fs');

router.get('/api/pageDesign', core.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;
        const steedosBuilderHost = `https://builder.steedos.com/amis?assetUrl=https://unpkg.com/@steedos-ui/builder-widgets/dist/assets.js&rootUrl=${__meteor_runtime_config__.ROOT_URL}&authToken=${userSession.authToken}&userId=${userSession.userId}&tenantId=${userSession.spaceId}&__q=`;

        let data = fs.readFileSync(__dirname+'/design.html', 'utf8');
        res.send(data.replace('SteedosBuilderHost',steedosBuilderHost));


        res.sendFile(__dirname+'/design.html') 
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;