import { defaultsDeep, cloneDeep, compact, each, isString, get } from 'lodash';
import { getBaseDirectory, isJsonMap } from '../util';
const path = require("path");
const fs = require("fs");
const clone = require("clone");
const validator = require('validator');
const yaml = require('js-yaml');

function calcString(str: string, content: any = process.env): any{
    if(!isString(str)){
        return str;
    }
    let calcFun: any = null;
    var reg = /(\${[^{}]*\})/g;
    let rev = str.replace(reg,function(m,$1){
        return $1.replace(/\{\s*/,"{args[\"").replace(/\s*\}/,"\"]}");
    })
    eval(`calcFun = function(args){return \`${rev}\`}`);
    let val = calcFun.call({}, content);
    if(isString(val) && val){
        return val.replace(/\\r/g, '\r').replace(/\\n/g, '\n').replace(/undefined/g, '')
    }else{
        return null;
    }
}

function calcSteedosConfig(config: any){
    each(config, (v:never, k: string)=>{
        if(isJsonMap(v)){
            let _d = get(config, k);
            if(isJsonMap(_d)){
                config[k] = calcSteedosConfig(clone(_d))
            }else{
                config[k] = calcString(v);
                if(k && isString(k) && k.startsWith('enable_') && config[k] && isString(config[k])){
                    config[k] = validator.toBoolean(config[k], true);
                }
            }
        }else{
            config[k] = calcString(v)
            if(k && isString(k) && k.startsWith('enable_') && config[k] && isString(config[k])){
                config[k] = validator.toBoolean(config[k], true);
            }
        }
    });

    return config
}

export class Start{

    static loadSettings = (filePath: string)=>{
        try {
            const settings = yaml.load(fs.readFileSync(filePath, 'utf8'));

            if (settings.env){
                each(settings.env, function(item, key){
                    process.env[key] = calcString(item)
                })
            }
            let emailConfig = settings.email;
            if(emailConfig){
                if (!emailConfig.url && emailConfig.host && emailConfig.port && emailConfig.username && emailConfig.password) {
                    let url = `smtps://${emailConfig.username}:${emailConfig.password}@${emailConfig.host}:${emailConfig.port}/`;
                    emailConfig.url = url;
                }
                if(emailConfig.url){
                    process.env["MAIL_URL"] = calcString(emailConfig.url);
                }
                if(emailConfig.from){
                    // 测试下来注册用户时不用MAIL_FROM这个环境变量也是可以的，这里重写是为了保险起见，怕其他地方用到这个环境变量
                    process.env["MAIL_FROM"] = calcString(emailConfig.from);
                }
            }
            const res = calcSteedosConfig(settings);
            if(res){
                (res as any).setTenant = (tenant)=>{
                    res.tenant = defaultsDeep(tenant, res.tenant);
                }
            }
            return res;
        } catch (error) {
            console.error('loadFile error', filePath, error);
        }
    }
    
    static loadDefaultSettings(){
        const filePath = path.join(__dirname, '../', '../', "default.steedos.settings.yml");
        if(fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory() ){
            return Start.loadSettings(filePath)
        }else{
            return null;
        }
    }

    static loadProjectSettings(){
        let configPath = path.join(getBaseDirectory(), 'steedos-config.yml')
        if (fs.existsSync(configPath) && !fs.statSync(configPath).isDirectory()) {
            return Start.loadSettings(configPath)
        }
    }

    static async loadDefaultConfig(){
        const filePath = path.join(__dirname, '../', '../', "default.steedos.config.js");
        if (filePath) {

			if (!fs.existsSync(filePath))
				return Promise.reject(new Error(`Config file not found: ${filePath}`));

			const mod = await import(filePath.startsWith("/") ? filePath : "/" + filePath);
            return mod.default;
		}
    }

    static async mergeConfig(projectConfig){
        const loadProjectSettings = Start.loadProjectSettings();
        const _projectConfig = defaultsDeep(projectConfig, {settings: loadProjectSettings});

        const defaultConfig = await Start.loadDefaultConfig();
        const defaultSettings = Start.loadDefaultSettings();

        const _defaultConfig = defaultsDeep(defaultConfig, {settings: defaultSettings})

        const res = cloneDeep(_defaultConfig);

		const mods = cloneDeep(_projectConfig);

        Object.keys(mods).forEach(key => {
            if (["created", "started", "stopped"].indexOf(key) !== -1) {
                const functionArray = Start.mergeSchemaLifecycleHandlers(mods[key], res[key]);
                if(functionArray.length > 0){
                    res[key] = function(broker){
                        functionArray.forEach((fn: any) => fn.call(this, broker))
                    }
                }
            } else {
                res[key] = defaultsDeep(mods[key], res[key]);
            }
        })

        return res;
    }

    static mergeSchemaLifecycleHandlers(src, target) {
		return compact(Start.flatten([target, src]));
	}

    static flatten(arr) {
		return Array.prototype.reduce.call(arr, (a, b) => a.concat(b), []);
	}
}