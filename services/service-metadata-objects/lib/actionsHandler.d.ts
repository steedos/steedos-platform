export declare type SObject = {
    name: string;
    [x: string]: any;
};
export declare type MetadataObject = {
    nodeID: [string];
    service: {
        name: string;
        version: string | undefined;
        fullName: string;
    };
    metadata: SObject;
};
export declare const ActionHandlers: {
    get(ctx: any): Promise<MetadataObject>;
    add(ctx: any): boolean;
    change(ctx: any): boolean;
    delete: (ctx: any) => any;
    verify: (ctx: any) => boolean;
};
