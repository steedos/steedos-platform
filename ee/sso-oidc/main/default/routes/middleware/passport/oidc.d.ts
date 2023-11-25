export declare const buildVerifyFn: (saveUserFn: any) => (issuer: any, sub: any, profile: any, jwtClaims: any, accessToken: any, refreshToken: any, idToken: any, params: any, done: any) => Promise<any>;
export declare function getEmail(profile: any, jwtClaims: any): any;
export declare const strategyFactory: (config: any, callbackUrl: any, saveUserFn: any) => Promise<{
    strategy: any;
    config: {
        issuer: any;
        authorizationURL: any;
        tokenURL: any;
        userInfoURL: any;
        endSessionEndpoint: any;
        clientID: any;
        clientSecret: any;
        callbackURL: any;
    };
}>;
