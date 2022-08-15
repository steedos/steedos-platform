"use strict";
(() => {
var exports = {};
exports.id = 748;
exports.ids = [748];
exports.modules = {

/***/ 2167:
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ 9344:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 4392:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "authOptions": () => (/* binding */ authOptions),
  "default": () => (/* binding */ _nextauth_)
});

;// CONCATENATED MODULE: external "next-auth"
const external_next_auth_namespaceObject = require("next-auth");
var external_next_auth_default = /*#__PURE__*/__webpack_require__.n(external_next_auth_namespaceObject);
;// CONCATENATED MODULE: external "next-auth/providers/keycloak"
const keycloak_namespaceObject = require("next-auth/providers/keycloak");
var keycloak_default = /*#__PURE__*/__webpack_require__.n(keycloak_namespaceObject);
;// CONCATENATED MODULE: ./src/lib/auth/KeycloakProvider.js

/* harmony default export */ const KeycloakProvider = (keycloak_default()({
    clientId: process.env.KEYCLOAK_ID,
    clientSecret: process.env.KEYCLOAK_SECRET,
    issuer: process.env.KEYCLOAK_ISSUER,
    name: "Steedos ID"
}));

;// CONCATENATED MODULE: external "next-auth/providers/credentials"
const credentials_namespaceObject = require("next-auth/providers/credentials");
var credentials_default = /*#__PURE__*/__webpack_require__.n(credentials_namespaceObject);
;// CONCATENATED MODULE: external "lodash"
const external_lodash_namespaceObject = require("lodash");
;// CONCATENATED MODULE: external "crypto"
const external_crypto_namespaceObject = require("crypto");
var external_crypto_default = /*#__PURE__*/__webpack_require__.n(external_crypto_namespaceObject);
;// CONCATENATED MODULE: ./src/lib/auth/CredentialsProvider.js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 16:37:30
 * @Description: 
 */ 


/* harmony default export */ const CredentialsProvider = (credentials_default()({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Password",
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
        username: {
            label: "Username",
            type: "text",
            placeholder: ""
        },
        password: {
            label: "Password",
            type: "password"
        },
        domain: {
            label: "Domain",
            type: "text"
        }
    },
    async authorize (credentials, req) {
        console.log(`authorize============`);
        // Add logic here to look up the user from the credentials supplied
        let user = null;
        try {
            console.log(`fetch ${credentials.domain}/accounts/password/login`);
            let domain = credentials.domain;
            if ((0,external_lodash_namespaceObject.endsWith)(domain, "/")) {
                domain = domain.substring(0, domain.length - 1);
            }
            const res = await fetch(`${domain}/accounts/password/login`, {
                method: "POST",
                body: JSON.stringify({
                    user: {
                        email: credentials.email
                    },
                    password: external_crypto_default().createHash("sha256").update(credentials.password).digest("hex")
                })
            });
            const json = await res.json();
            if (!json.user) {
                return null;
            }
            user = {
                id: json.user.id,
                name: json.user.name,
                local: json.user.local,
                email: json.user.email,
                utcOffset: json.user.utcOffset,
                steedos: {
                    space: json.space,
                    token: json.token,
                    userId: json.user.id,
                    name: json.user.name
                }
            };
        } catch (e) {
            console.log(e);
        }
        if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
        } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;
        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
    }
}));

;// CONCATENATED MODULE: ./src/pages/api/auth/[...nextauth].js
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-20 16:29:22
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-13 17:10:42
 * @Description: 
 */ 


const axios = __webpack_require__(2167);
const jwt = __webpack_require__(9344);
const ROOT_URL = "http://192.168.50.181:5000";
const JWT_API = "/accounts/jwt/login";
const STEEDOS_TOKENS = {};
const getJWTToken = (user)=>{
    const jwtPayload = {
        iss: process.env.NEXTAUTH_URL,
        sub: "steedos-nextjs-amis",
        profile: {
            email: user.email,
            ...user
        }
    };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: 60
    });
};
const loginSteedosProject = async (user)=>{
    if (STEEDOS_TOKENS[user.email]) {
        return STEEDOS_TOKENS[user.email];
    }
    const projectRootUrl = ROOT_URL;
    const rest = await axios({
        url: `${projectRootUrl}${JWT_API}`,
        method: "get",
        data: {},
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getJWTToken(user)}`
        }
    });
    STEEDOS_TOKENS[user.email] = rest.data;
    return STEEDOS_TOKENS[user.email];
};
const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
    providers: process.env.STEEDOS_IDENTITY_OIDC_ENABLED ? [
        CredentialsProvider,
        KeycloakProvider
    ] : [
        CredentialsProvider
    ],
    callbacks: {
        async jwt (props) {
            const { token , account , user  } = props;
            // Persist the OAuth access_token to the token right after signin
            // if (account) {
            //   token.accessToken = account.access_token
            // }
            if (user && user.steedos) {
                token.steedos = user.steedos;
            }
            return token;
        },
        async session ({ session , token , user  }) {
            console.log(`session`, session);
            // Send properties to the client, like an access_token from a provider.
            // session.accessToken = token.accessToken
            if (session.user) {
                if (token && token.steedos) {
                    session.steedos = token.steedos;
                } else {
                    const loginResult = await loginSteedosProject(session.user);
                    if (loginResult.space && loginResult.token) {
                        var ref, ref1;
                        session.steedos = {
                            space: loginResult.space,
                            token: loginResult.token,
                            userId: (ref = loginResult.user) === null || ref === void 0 ? void 0 : ref.id,
                            name: (ref1 = loginResult.user) === null || ref1 === void 0 ? void 0 : ref1.name
                        };
                    }
                }
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    }
};
/* harmony default export */ const _nextauth_ = (external_next_auth_default()(authOptions));


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(4392));
module.exports = __webpack_exports__;

})();