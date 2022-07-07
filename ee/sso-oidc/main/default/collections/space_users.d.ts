export declare class SpaceUsers {
    static insert(spaceId: any, userId: any, options?: {
        user_accepted: boolean;
    }): Promise<void>;
    static findByUserId(userId: any): Promise<any>;
}
