/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-17 09:16:48
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-02 16:07:30
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
        return ((window as any).Builder?.settings?.context?.rootUrl || '') + url
    },
    isSpaceAdmin: ()=>{
        return (window as any).Builder?.settings?.context?.user?.is_space_admin
    },
    logout: (redirect?)=>{
        debugger;
        localStorage.removeItem('steedos:spaceId');
        localStorage.removeItem('steedos:token');
        localStorage.removeItem('steedos:userId');
        localStorage.removeItem('steedos:was_logged_in');
        localStorage.removeItem('Meteor.loginToken');
        localStorage.removeItem('Meteor.Meteor.loginTokenExpires');
        localStorage.removeItem('Meteor.Meteor.userId');
        sessionStorage.clear();
        if(redirect)
            window.location.href = Steedos.absoluteUrl("/logout?redirect_uri="+ redirect);
        else
            window.location.href = Steedos.absoluteUrl("/logout");
    },
    Account,
    Space,
    Object: BaseObject,
    User,
    Workflow,
    ProcessManager
};

(window as any).signOut = Steedos.logout