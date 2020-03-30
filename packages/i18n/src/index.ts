import { locales } from './locales'
const i18next = require("i18next");
const sprintf  = require("i18next-sprintf-postprocessor");


type StringMap = { [key: string]: any };
type Callback = (error: any, t: Function) => void;
type events = "initialized" | "loaded" | "failedLoading" | "missingKey" | 'added' | 'removed' | 'languageChanged' | string;

const en = require('../resources/base/en.i18n.json');
const zhCN = require('../resources/base/zh-CN.i18n.json');

const en_creator = require('../resources/creator/en.i18n.json');
const zhCN_creator = require('../resources/creator/zh-CN.i18n.json');

const en_objectCore = require('../resources/object_core/en.i18n.json');
const zhCN_objectCore = require('../resources/object_core/zh-CN.i18n.json');

const en_workflow = require('../resources/workflow/en.i18n.json');
const zhCN_workflow = require('../resources/workflow/zh-CN.i18n.json');

i18next.use(sprintf).init({
    lng: 'en',
    debug: true,
    fallbackNS: [], 
    interpolation: {
        prefix: "{$",
        suffix: "}"
    },
    resources: {
        en: {
            translation: Object.assign({}, en, en_creator, en_objectCore, en_workflow)
        },
        'zh-CN': {
            translation: Object.assign({}, zhCN, zhCN_creator, zhCN_objectCore, zhCN_workflow)
        }
    }
}, function (err: any, t: any) {
    console.log('initialized and ready to go', err);
});

export const t = function(key: any, options: StringMap){
    return i18next.t(key, options)
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

export const exists = function(key: string, options: StringMap){
    return i18next.exists(key, options);
}

export const changeLanguage = function(lng: string, callback?: Callback){
    return i18next.changeLanguage(lng, callback);
}

export const format = function(value: any, format?: string, lng?: string){
    return i18next.format(value, format, lng);
}

export const getLanguages = function(){
    return i18next.languages;
}

//Events
export const on = function(event: events, listener: (...args: any[]) => void){
    return i18next.on(event, listener)
}

export const off = function(event: string, listener: (...args: any[]) => void){
    return i18next.off(event, listener)
}

export const init = function({ app }){
    console.log('init.....');
    app.use("/locales/:lng/:ns", locales);
}