/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-27 13:59:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-27 14:08:54
 * @Description: 
 */

declare var Creator;

export class SpaceUsers{
    static async insert(spaceId, userId, options = { user_accepted: true}){
        Creator.addSpaceUsers(spaceId, userId, options.user_accepted)
    }
}
