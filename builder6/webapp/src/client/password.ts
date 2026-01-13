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
    const {
        policy, 
        policyError, 
        policyerror, 
        policyFunction, 
        policies,
        password_min_length,
        password_max_length,
        password_require_uppercase,
        password_require_lowercase,
        password_require_number,
        password_require_special_character
    } = passwordConfig

    if(!password || trim(password).length === 0){
        throw new Error('密码不能为空');
    }

    if(userName){
        if(includes(password, userName)){
            throw new Error('密码不能包含用户名');
        }
    }

    // New structured password policy validation
    const minLength = password_min_length || 8;
    const maxLength = password_max_length || 128;

    if (password.length < minLength) {
        throw new Error(`密码长度不能少于 ${minLength} 个字符`);
    }

    if (password.length > maxLength) {
        throw new Error(`密码长度不能超过 ${maxLength} 个字符`);
    }

    if (password_require_uppercase && !/[A-Z]/.test(password)) {
        throw new Error('密码必须包含至少一个大写字母(A-Z)');
    }

    if (password_require_lowercase && !/[a-z]/.test(password)) {
        throw new Error('密码必须包含至少一个小写字母(a-z)');
    }

    if (password_require_number && !/[0-9]/.test(password)) {
        throw new Error('密码必须包含至少一个数字(0-9)');
    }

    if (password_require_special_character && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        throw new Error('密码必须包含至少一个特殊字符(如 !@#$%^&* 等)');
    }

    // Legacy regex-based policy validation (for backward compatibility)
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