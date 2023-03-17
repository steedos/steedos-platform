/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-03-17 14:15:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-17 16:39:28
 * @Description: 
 */

import { find,isString,isRegExp, each, isEmpty  } from 'lodash'

const RegexCache = new Map();

const match = (text, pattern)=>{
    // Simple patterns
    if (pattern.indexOf("?") == -1) {
        // Exact match (eg. "prefix.event")
        const firstStarPosition = pattern.indexOf("*");
        if (firstStarPosition == -1) {
            return pattern === text;
        }

        // Eg. "prefix**"
        const len = pattern.length;
        if (len > 2 && pattern.endsWith("**") && firstStarPosition > len - 3) {
            pattern = pattern.substring(0, len - 2);
            return text.startsWith(pattern);
        }

        // Eg. "prefix*"
        if (len > 1 && pattern.endsWith("*") && firstStarPosition > len - 2) {
            pattern = pattern.substring(0, len - 1);
            if (text.startsWith(pattern)) {
                return text.indexOf(".", len) == -1;
            }
            return false;
        }

        // Accept simple text, without point character (*)
        if (len == 1 && firstStarPosition == 0) {
            return text.indexOf(".") == -1;
        }

        // Accept all inputs (**)
        if (len == 2 && firstStarPosition == 0 && pattern.lastIndexOf("*") == 1) {
            return true;
        }
    }

    // Regex (eg. "prefix.ab?cd.*.foo")
    const origPattern = pattern;
    let regex = RegexCache.get(origPattern);
    if (regex == null) {
        if (pattern.startsWith("$")) {
            pattern = "\\" + pattern;
        }
        pattern = pattern.replace(/\?/g, ".");
        pattern = pattern.replace(/\*\*/g, "§§§");
        pattern = pattern.replace(/\*/g, "[^\\.]*");
        pattern = pattern.replace(/§§§/g, ".*");

        pattern = "^" + pattern + "$";

        regex = new RegExp(pattern, "");
        RegexCache.set(origPattern, regex);
    }
    return regex.test(text);
}

const getWhitelist = (settings)=>{
    const whitelist = [];
    if(settings && settings.redirect_url_whitelist){
        each(settings.redirect_url_whitelist.split(","), (item)=>{
            if(item.startsWith('/')){
                try {
                    // eslint-disable-next-line no-new-func
                    whitelist.push((new Function(`return ${item}`))())
                } catch (error) {
                    console.error(`error`, error)
                }
            }else if(!isEmpty(item)){
                whitelist.push(item)
            }
        })
    }

    return whitelist;
}

export const checkRedirectUrlWhitelist = (settings, redirectUri)=>{
    if(redirectUri.endsWith('.meteor.local')){
        return true;
    }
    const redirectUrlWhitelist = getWhitelist(settings);
    const matched = find(redirectUrlWhitelist, (mask)=>{
      if(isString(mask)){
        return match(redirectUri, mask)
      }else if(isRegExp(mask)){
        return mask.test(redirectUri);
      }
    })
    return matched != null;
  }