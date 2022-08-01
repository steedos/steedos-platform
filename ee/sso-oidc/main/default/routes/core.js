"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const passport = require("passport");
const { oidc } = require("./middleware");
exports.auth = {
    passport: passport,
    oidc: oidc,
};
