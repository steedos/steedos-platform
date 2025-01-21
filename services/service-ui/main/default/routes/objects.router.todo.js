var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const router =require('@steedos/router').staticRouter()
const auth = require('@steedos/auth');
router.get('/service/api/:objectServiceName/uiSchema', auth.requireAuthentication, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // const userSession = req.user;
        // const spaceId = userSession.spaceId;
        // const userId = userSession.userId;
        // const isSpaceAdmin = userSession.is_space_admin;
        res.status(200).send({ message: 'router ok' });
    });
});
exports.default = router;
