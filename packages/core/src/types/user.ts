import { SteedosIDType, SteedosSchema } from ".";

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
        if(this._schema.getObject("permission_set")){
            this._schema.getObject("permission_set").find({filters: ["user", "eq", userId], fields: ['_id']})
        }

        this._permissionSets = ["user"]
    }

    login(username, password): SteedosIDType{
        // return userId
        return this._userId
    }

    getPermissionSets(){
       return this._permissionSets;
    }

    getUserId(){
        return this._userId
    }

}