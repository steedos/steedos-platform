export declare class User {
    static save(user: any, opts: any): Promise<any>;
    static findByEmail(email: any): Promise<any>;
    static findById(id: any): Promise<any>;
}
