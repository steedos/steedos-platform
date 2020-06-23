/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { findKey } from '@salesforce/kit';
import { AnyJson, asJsonMap, isJsonMap, JsonMap, Optional } from '@salesforce/ts-types';
import { URL } from 'url';

const util = {
  /**
   * Returns `true` if a provided URL contains a Salesforce owned domain.
   *
   * @param urlString The URL to inspect.
   */
  isSalesforceDomain: (urlString: string): boolean => {
    let url: URL;

    try {
      url = new URL(urlString);
    } catch (e) {
      return false;
    }

    // Source https://help.salesforce.com/articleView?id=000003652&type=1
    const whitelistOfSalesforceDomainPatterns: string[] = [
      '.content.force.com',
      '.force.com',
      '.salesforce.com',
      '.salesforceliveagent.com',
      '.secure.force.com'
    ];

    const whitelistOfSalesforceHosts: string[] = ['developer.salesforce.com', 'trailhead.salesforce.com'];

    return whitelistOfSalesforceDomainPatterns.some(pattern => {
      return url.hostname.endsWith(pattern) || whitelistOfSalesforceHosts.includes(url.hostname);
    });
  },

  /**
   * Converts an 18 character Salesforce ID to 15 characters.
   *
   * @param id The id to convert.
   */
  trimTo15: (id?: string): Optional<string> => {
    if (id && id.length && id.length > 15) {
      id = id.substring(0, 15);
    }
    return id;
  },

  /**
   * Tests whether an API version matches the format `i.0`.
   *
   * @param value The API version as a string.
   */
  validateApiVersion: (value: string): boolean => {
    return value == null || /[1-9]\d\.0/.test(value);
  },

  /**
   * Tests whether an email matches the format `me@my.org`
   *
   * @param value The email as a string.
   */
  validateEmail: (value: string): boolean => {
    return /^[^.][^@]*@[^.]+(\.[^.\s]+)+$/.test(value);
  },

  /**
   * Tests whether a Salesforce ID is in the correct format, a 15- or 18-character length string with only letters and numbers
   * @param value The ID as a string.
   */
  validateSalesforceId: (value: string): boolean => {
    return /[a-zA-Z0-9]{18}|[a-zA-Z0-9]{15}/.test(value) && (value.length === 15 || value.length === 18);
  },

  /**
   * Tests whether a path is in the correct format; the value doesn't include the characters "[", "]", "?", "<", ">", "?", "|"
   * @param value The path as a string.
   */
  validatePathDoesNotContainInvalidChars: (value: string): boolean => {
    return !/[\[:"\?<>\|\]]+/.test(value);
  },

  /**
   * Returns the first key within the object that has an upper case first letter.
   *
   * @param data The object in which to check key casing.
   */
  findUpperCaseKeys: (data?: JsonMap): Optional<string> => {
    let key: Optional<string>;
    findKey(data, (val: AnyJson, k: string) => {
      if (k[0] === k[0].toUpperCase()) {
        key = k;
      } else if (isJsonMap(val)) {
        key = util.findUpperCaseKeys(asJsonMap(val));
      }
      return key;
    });
    return key;
  },

  /**
   * Returns the object record url
   */
  getObjectRecordUrl: (objectName: string, recordId: string, spaceId: string = null)=>{
    let url = `/app/-/${objectName}/view/${recordId}`;
    if (objectName === "instances"){
        url = `/workflow/space/${spaceId}/inbox/${recordId}`;
    }
    let rootUrl = __meteor_runtime_config__ ? __meteor_runtime_config__.ROOT_URL_PATH_PREFIX : "";
    if(rootUrl){
      url = rootUrl + url;
    }
    return url;
  },

  /**
   * Returns the locale string of the user
   */
  getUserLocale: (user: any)=>{
    let userLocale = user && user.locale && user.locale.toLocaleLowerCase();
    return util.getLocale(userLocale);
  },

  /**
   * Returns the locale string of the user locale
   */
  getLocale: (userLocale: string)=>{
    let locale: string;
    if (userLocale === 'zh-cn') {
      locale = "zh-CN";
    } else if (userLocale == 'en-us') {
      locale = "en";
    } else {
      locale = "zh-CN";
    }
    return locale;
  }
};

export default util;

const yaml = require('js-yaml');
const fs = require("fs");
const path = require("path");
const _ = require("underscore");
import { has, getJsonMap } from '@salesforce/ts-types';

exports.loadJSONFile = (filePath: string)=>{
    return JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
}

exports.loadYmlFile = (filePath: string)=>{
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

exports.loadFile = (filePath: string)=>{
    let json:JsonMap = {}
    try {
        let extname = path.extname(filePath);
        if(extname.toLocaleLowerCase() == '.json')
            json = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
        else if(extname.toLocaleLowerCase() == '.yml')
            json = yaml.load(fs.readFileSync(filePath, 'utf8'));
        else if(extname.toLocaleLowerCase() == '.js')
            json = require(filePath);
    } catch (error) {
        console.error('loadFile error', filePath, error);
    }
    return json;
};

exports.extend = (destination: JsonMap, sources: JsonMap)=>{
    _.each(sources, (v:never, k: string)=>{
        if(!has(destination, k)){
            destination[k] = v
        }else if(isJsonMap(v)){
            let _d = getJsonMap(destination, k);
            if(isJsonMap(_d)){
                this.extend(_d, v)
            }else{
                destination[k] = v
            }
        }else{
            destination[k] = v
        }
    })
}

exports.isObjectFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && (filePath.endsWith('.object.yml') || filePath.endsWith('.object.js'))
}

exports.isAppFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && filePath.endsWith('.app.yml')
}

exports.isTriggerFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && filePath.endsWith('.trigger.js')
}

exports.isFieldFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && (filePath.endsWith('.field.yml') || filePath.endsWith('.field.js'))
}

exports.isReportFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && (filePath.endsWith('.report.yml') || filePath.endsWith('.report.js'))
}