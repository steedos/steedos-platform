/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-17 09:16:48
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-21 17:26:19
 * @Description: 
 */

import { Account } from './account'
import { Space } from './space';
import { BaseObject } from './object';
import { User } from './user';
import { Workflow } from './workflow';
import { ProcessManager } from './process';

export const Steedos = {
    __hotRecords: {},
    absoluteUrl: (url: string)=>{
        // TODO 处理绝对路径
        return url
    },
    isSpaceAdmin: ()=>{
        return (window as any).Builder.settings.context?.user?.is_space_admin
    },
    Account,
    Space,
    Object: BaseObject,
    User,
    Workflow,
    ProcessManager
}