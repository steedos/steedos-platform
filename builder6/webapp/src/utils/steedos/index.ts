/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-17 09:16:48
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-18 11:10:30
 * @Description: 
 */

import { Account } from './account'
import { Space } from './space';
import { Object } from './object';
import { User } from './user';
import { Workflow } from './workflow';

export const Steedos = {
    isSpaceAdmin: ()=>{
        return (window as any).Builder.settings.context?.user?.is_space_admin
    },
    Account,
    Space,
    Object,
    User,
    Workflow
}