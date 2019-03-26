import { SteedosObjectType, SteedosUserType, SteedosObjectPermissionType } from ".";
import _ = require("underscore");
import { SteedosQueryOptions } from "./query";

export class SteedosUserObjectType {
  private _user: SteedosUserType;
  public get user(): SteedosUserType {
    return this._user;
  }

  private _object: SteedosObjectType;
  public get object(): SteedosObjectType {
    return this._object;
  }

  constructor(user: SteedosUserType, object: SteedosObjectType) {
    this._user = user;
    this._object = object
  }

  private getUserObjectPermission(){
    let userObjectPermission = {
      allowRead: false,
      allowCreate: false,
      allowEdit: false,
      allowDelete: false,
      viewAllRecords: false,
      modifyAllRecords: false,
      viewCompanyRecords: false,
      modifyCompanyRecords: false,
      disabled_list_views: [],
      disabled_actions: [],
      unreadable_fields: [],
      uneditable_fields: [],
      unrelated_objects: []
    }
    let userPermissionSets: string[] = this.user.getPermissionSets();

    if(_.isEmpty(userPermissionSets)){
      throw new Error('not find user permission');
    }
    
    userPermissionSets.forEach((userPermissionSet)=>{
      let objectPermissions: SteedosObjectPermissionType = this.object.getPermission(userPermissionSet)
      _.each(userObjectPermission, (v, k)=>{
        let _v = objectPermissions[k]
        if(_.isBoolean(v)){
          if(v === false && _v === true){
            userObjectPermission[k] = _v
          }
        }else if(_.isArray(v) && _.isArray(_v)){
          userObjectPermission[k] = _.union(v, _v)
        }
      })
    })
    
    return userObjectPermission;
  }

  /**
   * 计算权限
   */
  find(query: SteedosQueryOptions) {
    // 计算权限, 如果没有权限就报错
    let userObjectPermission = this.getUserObjectPermission()

    console.log('userObjectPermission', userObjectPermission);

    query.fields

    console.log('query', query);
    // object.find()   
  }
}