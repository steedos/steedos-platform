export declare const oidcCallbackUrl: (config: any) => any;
export declare function oidcStrategyFactory(): Promise<any>;
export declare const oidcAuth: (req: any, res: any, next: any) => Promise<any>;
export declare const oidcPreAuth: (req: any, res: any, next: any) => Promise<any>;
export declare const oidcLogin: (req: any, res: any, next: any) => Promise<void>;
export declare const oidcLogout: (req: any, res: any, next: any) => Promise<any>;
