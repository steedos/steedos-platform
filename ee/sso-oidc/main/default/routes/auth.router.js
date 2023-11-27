var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ejs = require('ejs');
const authController = require("./auth");
const path = require("path");
const router = require('@steedos/router').staticRouter();
router
    .get("/api/global/auth/oidc/config", authController.oidcPreAuth)
    .get("/api/global/auth/oidc/logout", authController.oidcLogout)
    .get("/api/global/auth/oidc/callback", authController.oidcAuth)
    .get("/api/global/auth/oidc/error-callback", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const filename = path.join(__dirname, '..', '..', '..', 'ejs', 'error-callback.ejs');
        const data = {};
        const options = {};
        ejs.renderFile(filename, data, options, function (err, str) {
            res.send(str);
        });
    });
})
    .post('/api/global/auth/oidc/login', authController.oidcLogin);
exports.default = router;
