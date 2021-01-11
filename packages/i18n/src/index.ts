let i18next = require("i18next");
const sprintf  = require("i18next-sprintf-postprocessor");
const _ = require("underscore");
// const XHR = require('i18next-xhr-backend');

const loadResources = {};

if(!i18next.use){
    i18next = i18next.default
}

i18next.use(sprintf).init({
    lng: 'en',
    debug: process.env.I18N_DEBUG || false,
    fallbackNS: [],  //'translation'
    fallbackLng: [],
    interpolation: {
        prefix: "{$",
        suffix: "}"
    },
    // resources: {
    //     en: {
    //         translation: {}
    //     },
    //     'zh-CN': {
    //         translation: {}
    //     }
    // }
}, function (err: any, t: any) {
    if(process.env.I18N_DEBUG){
        console.log('i18n initialized and ready to go');
    }
});

export const _t = function(key: any, options: StringMap){
    return i18next.t(key, options)
}

export const t = function(key: any, parameters: any, locale: string){
    if(!key){
        return key;
    }
    if (locale === "zh-cn") {
        locale = "zh-CN";
    }
    let keys;
    if(_.isArray(key)){
        keys = key;
    }else{
        keys = [`CustomLabels.${key}`, key];
    }
    if ((parameters != null) && !(_.isObject(parameters))) {
        return _t(keys, { lng: locale, postProcess: 'sprintf', sprintf: [parameters], keySeparator: false});
    } else {
        return _t(keys, Object.assign({lng: locale}, {keySeparator: false}, parameters));
    }
}

/**
 * Adds a complete bundle.
 * Setting deep (default false) param to true will extend existing translations in that file. Setting deep and overwrite (default false) to true it will overwrite existing translations in that file.
 * So omitting deep and overwrite will overwrite all existing translations with the one provided in resources. Using deep you can choose to keep existing nested translation and to overwrite those with the new ones.
 * @param lng 
 * @param ns 
 * @param resources 
 * @param deep 
 * @param overwrite 
 */
export const addResourceBundle = function(lng: string, ns: string, resources: any, deep?: boolean, overwrite?: boolean){
    return i18next.addResourceBundle(lng, ns, resources, deep, overwrite);
}

export const getResourceBundle = function(lng: string, ns: string){
    return i18next.getResourceBundle(lng, ns);
}

export const getDataByLanguage = function(lng: string){
    return i18next.getDataByLanguage(lng);
}

export const exists = function(key: string, options: StringMap){
    return i18next.exists(key, options);
}

export const changeLanguage = function(lng: string, options: any = {}, callback?: Callback){
    let rootUrl = options.rootUrl;
    let ns = options.ns || 'translation';
    // console.log('changeLanguage', lng, ns, options);
    if(typeof window != 'undefined' && rootUrl){
        if(!rootUrl.endsWith('/')){
            rootUrl = `${rootUrl}/`
        }
        // let connector = i18next.services.backendConnector;
        // connector.backend = new XHR(i18next.services, {
        //     loadPath: `${rootUrl}locales/${lng}/${ns}`
        // });
        // connector.load([lng],[ns],function(err){
        //     i18next.changeLanguage(lng, callback);
        // })
        let loadPath = `${rootUrl}locales/${lng}/${ns}`
        if(loadResources[loadPath] > 0){
            i18next.changeLanguage(lng, callback);
        }else if(loadResources[loadPath] != 0){
            loadResources[loadPath] = 0;
            var request = new XMLHttpRequest();
            request.overrideMimeType("application/json")
            request.open('GET', loadPath, false); 
            request.send(null);

            if(request.status === 200){
                loadResources[loadPath] = 1;
            }else{
                loadResources[loadPath] = -1;
            }
            exports.addResourceBundle(lng, ns, JSON.parse(request.response) || {});
            i18next.changeLanguage(lng, callback);

            // if($ && $.ajax && _.isFunction($.ajax)){
            //     let res = $.ajax({async: false, type: 'GET', url: loadPath, dataType: "json", contentType: "application/json"});
            //     if(res.status === 200){
            //         loadResources[loadPath] = 1;
            //     }else{
            //         loadResources[loadPath] = -1;
            //     }
            //     exports.addResourceBundle(lng, ns, res.responseJSON || {});
            //     i18next.changeLanguage(lng, callback);
            // }else{
            //     let backend = new XHR(
            //         i18next.services,
            //         {
            //           loadPath: loadPath,
            //         },
            //       );
            //     backend.read(lng, ns, function(err, data) {
            //        if(err){
            //             loadResources[loadPath] = -1;
            //        }else{
            //             loadResources[loadPath] = 1
            //        }
            //        addResourceBundle(lng, ns, data);
            //        i18next.changeLanguage(lng, callback);
            //     });
            // }
            
        }
    }else{
        return i18next.changeLanguage(lng, callback);
    }
}

export const format = function(value: any, format?: string, lng?: string){
    return i18next.format(value, format, lng);
}

export const getLanguages = function(){
    return i18next.languages;
}

export const loadLanguages = function(lngs: any, callback: any){
    return i18next.loadLanguages(lngs, callback);
}

export const loadNamespaces = function(ns: any, callback: any){
    return i18next.loadNamespaces(ns, callback);
}

//Events
export const on = function(event: events, listener: (...args: any[]) => void){
    return i18next.on(event, listener)
}

export const off = function(event: string, listener: (...args: any[]) => void){
    return i18next.off(event, listener)
}

export * from './i18n/i18n'

export * from './i18n/i18n.app'

export * from './translations'