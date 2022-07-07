/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-27 13:59:25
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-06 17:24:59
 * @Description: 
 */

declare var Creator;
import { getObject } from '@steedos/objectql';
export class SpaceUsers{
    static async insert(spaceId, userId, options = { user_accepted: true}){
        Creator.addSpaceUsers(spaceId, userId, options.user_accepted)
    }

    static async findByUserId(userId){
        const records = await getObject('users').find({ filters: [['user', '=', userId]] });
        if(records.length === 0){
            return null;
        }else{
            return records[0];
        }
    }
}
