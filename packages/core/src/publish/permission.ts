import {Util} from './util'
export class Permission{
    spaceId:string
    userId: string
    util: any
    constructor(spaceId, userId){
        this.spaceId = spaceId
        this.userId = userId
        this.util = new Util()
    }
    async isSpaceAdmin(){
        let space: any = await this.util.dbExec(this.userId, "spaces", "direct.findOne", {_id: this.spaceId})
        if(space && space.admins){
            return space.admins.includes(this.userId)
        }
        return false
    }
}