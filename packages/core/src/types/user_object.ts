import { SteedosSchema } from "./schema";
import { SteedosUser } from "./user";
import { SteedosObjectType } from ".";


export class SteedosUserObject {
    _user: SteedosUser
    _object: SteedosObjectType

    constructor(user, object){

    }

    find(){
      // 计算权限, 如果没有权限就报错

      // object.find()   
    }
}