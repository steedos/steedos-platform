"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateThirdParty = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = require("node-fetch");
const users_1 = require("../../../collections/users");
const context_1 = require("../../../context");
const environment_1 = require("../../../context/environment");
const hashing_1 = require("../../../context/hashing");
const jwt = require("jsonwebtoken");
const authError = function (done, message, err = null) {
    return done(message, null);
};
const createASession = function (userId, session) {
    return Object.assign(Object.assign({ createdAt: new Date().toISOString(), lastAccessedAt: new Date().toISOString() }, session), { userId });
};
const authenticateThirdParty = (thirdPartyUser, requireLocalAccount = true, done, saveUserFn) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!saveUserFn) {
        throw new Error("Save user function must be provided");
    }
    if (!thirdPartyUser.provider) {
        return authError(done, "third party user provider required");
    }
    if (!thirdPartyUser.userId) {
        return authError(done, "third party user id required");
    }
    if (!thirdPartyUser.email) {
        return authError(done, "third party user email required");
    }
    const userId = thirdPartyUser.userId;
    let dbUser = yield users_1.User.findById(userId);
    // fallback to loading by email
    if (!dbUser) {
        const userByEmail = yield users_1.User.findByEmail(thirdPartyUser.email);
        if (userByEmail) {
            dbUser = userByEmail;
        }
    }
    // exit early if there is still no user and auto creation is disabled
    if (!dbUser && requireLocalAccount) {
        return authError(done, "Email does not yet exist. You must set up your local budibase account first.");
    }
    // first time creation
    if (!dbUser) {
        // setup a blank user using the third party id
        dbUser = {
            _id: userId,
            email: thirdPartyUser.email,
            roles: {},
        };
    }
    dbUser = yield syncUser(dbUser, thirdPartyUser);
    // never prompt for password reset
    dbUser.forceResetPassword = false;
    // create or sync the user
    try {
        yield saveUserFn(dbUser, false, false);
    }
    catch (err) {
        console.log(`err`, err);
        return authError(done, err);
    }
    // now that we're sure user exists, load them from the db
    dbUser = yield users_1.User.findById(dbUser._id);
    // authenticate
    const sessionId = (0, hashing_1.newid)();
    const tenantId = (0, context_1.getTenantId)();
    yield createASession(dbUser._id, { sessionId, tenantId });
    dbUser.token = jwt.sign({
        userId: dbUser._id,
        sessionId,
    }, environment_1.default.JWT_SECRET);
    return done(null, Object.assign({}, dbUser, { id: dbUser._id, thirdPartyUser: thirdPartyUser }));
});
exports.authenticateThirdParty = authenticateThirdParty;
function syncProfilePicture(user, thirdPartyUser) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const pictureUrl = thirdPartyUser.profile._json.picture;
        if (pictureUrl) {
            const response = yield (0, node_fetch_1.default)(pictureUrl, {});
            if (response.status === 200) {
                const type = response.headers.get("content-type");
                if (type.startsWith("image/")) {
                    user.pictureUrl = pictureUrl;
                }
            }
        }
        return user;
    });
}
/**
 * @returns a user that has been sync'd with third party information
 */
function syncUser(user, thirdPartyUser) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // provider
        user.provider = thirdPartyUser.provider;
        user.providerType = thirdPartyUser.providerType;
        if (thirdPartyUser.profile) {
            const profile = thirdPartyUser.profile;
            if (profile.name) {
                const name = profile.name;
                // first name
                if (name.givenName) {
                    user.firstName = name.givenName;
                }
                // last name
                if (name.familyName) {
                    user.lastName = name.familyName;
                }
            }
            user = yield syncProfilePicture(user, thirdPartyUser);
            // profile
            user.thirdPartyProfile = Object.assign({}, profile._json);
        }
        // oauth tokens for future use
        if (thirdPartyUser.oauth2) {
            user.oauth2 = Object.assign({}, thirdPartyUser.oauth2);
        }
        return user;
    });
}
