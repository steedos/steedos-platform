var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const jwt = require('jsonwebtoken');
router.get('/api/external/app/:appId', auth.requireAuthentication, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userSession = req.user;
            const { appId } = req.params;
            const appObj = objectql.getObject('apps');
            const appDoc = yield appObj.findOne(appId);
            if (!appDoc) {
                throw new Error(`not found app by ${appId}`);
            }
            const { url, secret } = appDoc;
            if (!url) {
                throw new Error(`url is null in ${appId}`);
            }
            if (!secret) {
                throw new Error(`secret is null in ${appId}`);
            }
            const options = { expiresIn: 10 * 60 };
            const token = jwt.sign({
                profile: {
                    name: userSession.name,
                    username: userSession.username,
                    email: userSession.email
                }
            }, secret, options);
            res.redirect(`${url}?t=${token}`);
        }
        catch (error) {
            objectql.getSteedosSchema().broker.logger.error(error.stack);
            res.status(500).send({ success: false, message: error.message });
        }
    });
});
exports.default = router;
