/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 10:53:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 17:42:41
 * @Description: 
 */
import { isJsonMap, JsonMap, has, getJsonMap } from '@salesforce/ts-types';
import { getMD5, syncMatchFiles } from '@steedos/metadata-core';
import path = require('path');
const fs = require("fs");
const _ = require('underscore');
var clone = require('clone');
const yaml = require('js-yaml');

export const loadFile = (filePath: string)=>{
    let json:JsonMap = {}
    try {
        let extname = path.extname(filePath);
        if(extname.toLocaleLowerCase() == '.json')
            json = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
        else if(extname.toLocaleLowerCase() == '.yml')
            json = yaml.load(fs.readFileSync(filePath, 'utf8'));
        else if(extname.toLocaleLowerCase() == '.js')
            json = clone(require(filePath));
    } catch (error) {
        console.error('loadFile error', filePath, error);
    }
    return json;
};

export function wrapAsync(fn, context){
    try {
        const Future  = require('fibers/future');
        let proxyFn = async function(_cb){
            let value = null;
            let error = null;
            try {
                value = await fn.call(context)
            } catch (err) {
                error = err
            }
            _cb(error, value)
        }
        let fut = new Future();
        let callback = fut.resolver();
        let result = proxyFn.apply(this, [callback]);
        return fut ? fut.wait() : result;
    } catch (Exception) {
        
    }
}

export function JSONStringify(data) {
    return JSON.stringify(data, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    })
}

export function extend(destination: JsonMap, ...sources: JsonMap[]){
    _.each(sources, (source: JsonMap)=>{
        _.each(source, (v:never, k: string)=>{
            if(!has(destination, k)){
                destination[k] = v
            }else if(isJsonMap(v)){
                let _d = getJsonMap(destination, k);
                if(isJsonMap(_d)){
                    destination[k] = extend(clone(_d), v)
                }else{
                    destination[k] = v
                }
            }else{
                destination[k] = v
            }
        })
    })
    return destination
}

export const loadProcessTriggers = (filePath: string) => {
    let results = [];
    const filePatten = [
        path.join(filePath, "*.processTrigger.js"),
        "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
        delete require.cache[require.resolve(matchedPath)];
        let json: any = loadFile(matchedPath);
        if (!_.has(json, "listenTo")) {
            json.listenTo = path.basename(matchedPath).split(".")[0];
        }
        results.push(json);
    });
    return results;
};

export const loadPermissions = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.permission.yml"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        let json: any = loadFile(matchedPath);
        if(!_.has(json, 'object_name')){
            json.object_name = path.parse(path.dirname(path.dirname(matchedPath))).name
        }
        json.name = path.basename(matchedPath).split('.')[0]
        results.push(json)
    })
    return results
}

export const loadObjects = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.object.yml"),
      path.join(filePath, "*.object.json"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      let json:any = loadFile(matchedPath);
      try {
        if (json) {
          json.__filename = matchedPath;
        }
      } catch (error) {
        console.error("loadObjects error", matchedPath, error);
      }
    //   if (validateObject(json)) {
        results.push(json);
    //   }
    });
    return results;
  };

  export const loadFields = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.field.yml"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      let json: any = loadFile(matchedPath);
      if (!json.name) {
        json.name = path.basename(matchedPath).split(".")[0];
      }
      if (!json.object_name) {
        json.object_name = path.parse(
          path.dirname(path.dirname(matchedPath))
        ).name;
      }
      results.push(json);
    });
    return results;
  };

  export const loadListViews = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.listview.yml"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        let json: any = loadFile(matchedPath);
        if(!json.name){
            json.name = path.basename(matchedPath).split('.')[0]
        }
        if(!json.object_name){
            json.object_name =  path.parse(path.dirname(path.dirname(matchedPath))).name
        }
        results.push(json)
    })
    return results
}

export const loadButtons = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.button.yml"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        let json: any = loadFile(matchedPath);
        if(!json.name){
            json.name = path.basename(matchedPath).split('.')[0]
        }
        if(!json.object_name){
            json.object_name =  path.parse(path.dirname(path.dirname(matchedPath))).name
        }
        results.push(json)
    })
    return results
}

export const loadButtonScripts = (filePath: string)=>{
    let results = []
    const filePatten = [
        path.join(filePath, "*.button.js"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        delete require.cache[require.resolve(matchedPath)]
        let json: any = loadFile(matchedPath);
        if(!_.has(json, 'listenTo')){
            json.listenTo = path.parse(path.dirname(path.dirname(matchedPath))).name
        }
        results.push(json)
    })
    return results
}

export const loadActions = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.action.js"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      delete require.cache[require.resolve(matchedPath)];
      let json: any = loadFile(matchedPath);
      if (!_.has(json, "listenTo")) {
        json.listenTo = path.basename(matchedPath).split(".")[0];
      }
      results.push(json);
    });
    return results;
  };
  

  const getRouterInfoList = (router, md5) => {
    const infoList = [];
    if (
      router &&
      router.default &&
      router.default.stack &&
      router.default.stack.length > 0
    ) {
      _.each(router.default.stack, (_route) => {
        const info = {
          path: "",
          methods: "",
          md5: md5,
        };
        if (_route.route) {
          info.path = _route.route.path;
          info.methods = _route.route.methods;
          infoList.push(info);
        }
      });
    }
    return infoList;
  };
  
  const getFileMD5 = (filePath) => {
    const buffer = fs.readFileSync(filePath);
    return getMD5(buffer);
  };
  
  export const loadRouters = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.router.js"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      delete require.cache[require.resolve(matchedPath)];
      let router = loadFile(matchedPath);
      let md5 = getFileMD5(matchedPath);
      let infoList = getRouterInfoList(router, md5);
      results.push({ router: router, infoList: infoList });
    });
    return results;
  };
  function getI18nLng(filePath) {
    try {
      let pathJson = path.parse(filePath);
      let filename = pathJson.base;
      if (filename) {
        let f = filename.split(".");
        if (f.length >= 3) {
          return f[f.length - 3];
        }
      }
      console.log(`getI18nLng warn: Invalid file: ${filePath}`);
    } catch (error) {
      console.error(`getI18nLng error: ${filePath}`, error);
    }
  }
  export const loadI18n = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.i18n.yml"),
      path.join(filePath, "*.i18n.json"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      let json = loadFile(matchedPath);
      let lng = getI18nLng(matchedPath);
      if (lng) {
        results.push({ lng: lng, __filename: matchedPath, data: json });
      }
    });
    return results;
  };

  export function loadObjectDataFiles(filePath: string){
    let results = []
    const filePatten = [
        path.join(filePath, "*.data.json"),
        "!" + path.join(filePath, "node_modules"),
    ]
    const matchedPaths:[string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath:string)=>{
        let records = loadFile(matchedPath);
        let objectName = path.basename(matchedPath).split('.')[0];
        results.push({objectName: objectName, records: records});
    })
    return results
}

export const loadLayouts = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.layout.yml"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      let json: any = loadFile(matchedPath);
      let names = path.basename(matchedPath).split(".");
  
      if (!json.name) {
        json.name = names[1];
      }
      if (!json.object_name) {
        json.object_name = names[0];
      }
      results.push(json);
    });
    return results;
  };

  function getObjectApiName(filePath) {
    try {
      let pathJson = path.parse(filePath);
      let filename = pathJson.base;
      if (filename) {
        let f = filename.split(".");
        if (f.length >= 3) {
          return f[0];
        }
      }
      console.log(`getObjectApiName warn: Invalid file: ${filePath}`);
    } catch (error) {
      console.error(`getObjectApiName error: ${filePath}`, error);
    }
  }

  export const loadObjectTranslations = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.objectTranslation.yml"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      let json = loadFile(matchedPath);
      let lng = getI18nLng(matchedPath);
      let objectApiName = getObjectApiName(matchedPath);
      if (lng) {
        results.push({
          lng: lng,
          objectApiName,
          __filename: matchedPath,
          data: json,
        });
      }
    });
    return results;
  };
  
  export const loadTranslations = (filePath: string) => {
    let results = [];
    const filePatten = [
      path.join(filePath, "*.translation.yml"),
      "!" + path.join(filePath, "node_modules"),
    ];
    const matchedPaths: [string] = syncMatchFiles(filePatten);
    _.each(matchedPaths, (matchedPath: string) => {
      let json = loadFile(matchedPath);
      let lng = getI18nLng(matchedPath);
      if (lng) {
        results.push({ lng: lng, __filename: matchedPath, data: json });
      }
    });
    return results;
  };