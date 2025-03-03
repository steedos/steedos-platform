const { requireAuthentication } = require("@steedos/auth");
const { getObject } = require("@steedos/objectql");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const crypto = require('crypto');

function generateBase64Secret(length = 46) {
    return crypto.randomBytes(Math.ceil(length * 3 / 4))
      .toString('base64') 
      .replace(/\+/g, '0')
      .replace(/\//g, '0')
      .replace(/=/g, '');
  }

router.post(
    "/api/v4/api_keys/call/generator",
    requireAuthentication,
    async function (req, res) {
        try {
            const params = req.params;
            const userSession = req.user;
            const spaceId = userSession.spaceId;
            const userId = userSession.userId;

            const record = await getObject('api_keys').insert({
                api_key: generateBase64Secret(),
                space: spaceId,
                owner: userId,
                active: true
            });
            res.status(200).send(record);
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    }
);

exports.default = router;
