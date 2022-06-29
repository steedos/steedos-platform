/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-27 13:34:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-29 18:07:31
 * @Description: 
 */
import { getObject } from '@steedos/objectql';
import { getTenantId } from '../context';
import { SpaceUsers } from './space_users';
import { getTenantConfig } from '../context';

export class User {

    static async save(user, opts) {
        let dbUser = await User.findByEmail(user.email);
        if (!dbUser) {
            dbUser = await getObject('users').directInsert({
                _id: user._id,
                email: user.email,
                email_verified: user.thirdPartyProfile.email_verified,
                name: user.thirdPartyProfile.name,
                locale: 'zh-cn',
                created: new Date(),
                modified: new Date()
            })

            const tenantId = getTenantId();
            if (tenantId) {
                const tenantConfig = await getTenantConfig(tenantId);
                // 只有开启自助注册时,才新建space user
                if (tenantConfig.enable_register) {
                    await SpaceUsers.insert(tenantId, dbUser._id, { user_accepted: true });
                }
            }
            return dbUser;
        } else {
            return dbUser;
        }
    }

    static async findByEmail(email) {
        const records = await getObject('users').find({ filters: [['email', '=', email]] });
        if(records.length === 0){
            return null;
        }else{
            return records[0];
        }
    }

    static async findById(id) {
        return await getObject('users').findOne(id);
    }
}