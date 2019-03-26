import { SteedosSchema } from ".";

export type SteedosUserConfig = {
    _id,
    name
    username
}

export class SteedosUser {
    userId: string
    login(username, password): string{
        // return userId
        return "-1"
    }

    getPermissionSets(){
        // return ["admin", "user"]
    }

}