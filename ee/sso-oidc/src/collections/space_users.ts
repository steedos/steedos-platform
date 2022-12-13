/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-27 13:59:25
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-06 14:35:10
 * @Description: 
 */

declare var Creator;
import { getObject, getSteedosSchema } from '@steedos/objectql';
export class SpaceUsers{
    static async insert(spaceId, userId, options = { user_accepted: true}){
        // Creator.addSpaceUsers(spaceId, userId, options.user_accepted)
        await getSteedosSchema().broker.call(`spaces.addSpaceUsers`, {
            spaceId,
            userId,
            user_accepted: options.user_accepted,
        })
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
