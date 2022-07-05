export declare const getTenantId: () => any;
export declare const getTenantConfig: (tenantId: any) => Promise<any>;
export declare const getScopedConfig: () => {
    platformUrl: string;
};
export declare const isMultiTenant: () => any;
export declare const getOidcConfig: () => {
    configUrl: any;
    clientID: any;
    clientSecret: any;
    requireLocalAccount: any;
};
