/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-06 10:32:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-16 11:54:55
 * @Description: 
 */

import { trim, includes } from 'lodash'
declare var fun: any;
export function validatePassword(passwordConfig, password, userName){
    const {policy, policyError, policyerror, policyFunction, policies} = passwordConfig

    if(!password || trim(password).length === 0){
        throw new Error('密码不能为空');
    }

    if(userName){
        if(includes(password, userName)){
            throw new Error('密码不能包含用户名');
        }
    }

    if(policy){
      if(!(new RegExp(policy)).test(password || '')){
          throw new Error(policyError || policyerror || '密码不符合规则');
      }
    }

    if(policies){
        for(let i = 0; i < policies.length; i++){
            const item = policies[i];
            if(!(new RegExp(item.policy)).test(password || '')){
                throw new Error(item.policyError || item.policyerror || '密码不符合规则');
            }
        }
    }

    if(policyFunction){
        try {
            // eslint-disable-next-line no-eval
            window.eval(`var fun = ${policyFunction}`);
            fun(password);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
  }