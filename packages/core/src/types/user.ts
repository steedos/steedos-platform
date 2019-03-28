import { SteedosIDType, SteedosSchema } from "@steedos/objectql";

export type SteedosUserTypeConfig = {
    _id,
    name
    username
}

export class SteedosUserType {
    private _userId: SteedosIDType;
    private _permissionSets: string[];
    private _schema: SteedosSchema;
    
    constructor(userId: SteedosIDType, schema: SteedosSchema){
        this._userId = userId

        this._schema = schema;

        this._permissionSets = ["user"]
    }

    login(username, password): SteedosIDType{
        // return userId
        return this._userId
    }

    async getPermissionSets(){
        if(this._permissionSets){
            return this._permissionSets
        }else{
            return await this._schema.getObject("permission_set").find({filters: ["user", "eq", this._userId], fields: ['_id']})
        }
    }

    getUserId(){
        return this._userId
    }

}