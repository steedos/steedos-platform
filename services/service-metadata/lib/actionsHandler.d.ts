export declare type MetadataObject = {
    nodeID: [string];
    service: {
        name: string;
        version: string | undefined;
        fullName: string;
    };
    metadata: any;
};
export declare const ActionHandlers: {
    get(ctx: any): Promise<MetadataObject>;
    add: (ctx: any) => boolean;
    delete: (ctx: any) => boolean;
};
