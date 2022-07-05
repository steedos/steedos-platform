export declare const buildVerifyFn: (saveUserFn: any) => (issuer: any, sub: any, profile: any, jwtClaims: any, accessToken: any, refreshToken: any, idToken: any, params: any, done: any) => Promise<any>;
/**
 * @param {*} profile The structured profile created by passport using the user info endpoint
 * @param {*} jwtClaims The claims returned in the id token
 */
export declare function getEmail(profile: any, jwtClaims: any): any;
/**
 * Create an instance of the oidc passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport OIDC Strategy
 */
export declare const strategyFactory: (config: any, callbackUrl: any, saveUserFn: any) => Promise<{
    strategy: any;
    config: {
        issuer: any;
        authorizationURL: any;
        tokenURL: any;
        userInfoURL: any;
        clientID: any;
        clientSecret: any;
        callbackURL: any;
    };
}>;
