import { mkdirsSync } from '@steedos/metadata-core';
import * as _ from 'underscore';
import { getObjectConfig, getOriginalObjectConfig } from '@steedos/metadata-registrar'
const fs = require("fs-extra");
const path = require("path");
const colors = require('colors/safe');
// const Fiber = require('fibers');
declare var Fiber;

const OBJECT_TRANSLATIONS = 'objectTranslations';
const TRANSLATIONS = 'translations';

const OBJECT_TRANSLATION_SUFFIX = 'objectTranslation';
const TRANSLATION_SUFFIX = 'translation';

const TEMP_CONVERT_NS = 'temp_convert_ns';

export async function CliLogic(lng, packageDir) {
    Fiber(async function(){
        await convert(lng, packageDir)
    }).run();
}

function getFileName(filePath){
    try {
        let pathJson = path.parse(filePath);
        let filename = pathJson.base;
        if(filename){
            let f = filename.split('.');
            return f[0];
        }
        console.log(`getI18nLng warn: Invalid file: ${filePath}`);
    } catch (error) {
        console.error(`getI18nLng error: ${filePath}`, error)
    }
}

async function convert(lng, packageDir){
    const objectql = require(require.resolve('@steedos/objectql', {paths: [process.cwd()]}));
    const core = require(require.resolve('@steedos/core/lib/init/i18n', {paths: [process.cwd()]}));
    const I18n = require(require.resolve('@steedos/i18n', {paths: [process.cwd()]}));
    const I18nInit = require(require.resolve('@steedos/i18n/lib/core_i18n', {paths: [process.cwd()]}));
    const I18nExport = require(require.resolve('@steedos/i18n/lib/export_object_i18n', {paths: [process.cwd()]}));
    var steedosSchema = objectql.getSteedosSchema();
    for (let dataSource in steedosSchema.getDataSources()) {
        steedosSchema.getDataSource(dataSource).loadFiles()
        await steedosSchema.getDataSource(dataSource).init();
    }
    I18nInit.InitCoreI18n();
    core.InitObjectI18n();
    const objectConfigs = objectql.getOriginalObjectConfigs();
    if(!path.isAbsolute(packageDir)){
        packageDir = path.join(process.cwd(), packageDir)
    }
    let objectCustomLabelKeys = {};
    let customLabelKeys:any = [];
    //加载项目中的旧18n文件
    let filePath = path.join(packageDir, '**');
    let results = objectql.loadI18n(filePath);
    _.each(results, function(item){
        if(item.__filename){
            I18n.addResourceBundle(item.lng, 'translation', item.data);
            let filename = getFileName(item.__filename);
            try {
                const object = objectql.getObject(filename);
                if(object){
                    const objectTemplate = I18n.getObjectI18nTemplate(lng, filename, getOriginalObjectConfig(filename));
                    let oldKeys = _.keys(item.data);
                    let keys = _.keys(objectTemplate);
                    let inheritedObjectConfig = getObjectConfig(filename);
                    let inheritedKeys = keys;
                    if(inheritedObjectConfig){
                        let inheritedTemplateData = I18n.getObjectI18nTemplate(lng, filename, inheritedObjectConfig);
                        inheritedKeys = _.keys(inheritedTemplateData)
                    }
                    let deleteKeys = _.difference(oldKeys, inheritedKeys);
                    if(!objectCustomLabelKeys[filename]){
                        objectCustomLabelKeys[filename] = []
                    }
                    objectCustomLabelKeys[filename] = objectCustomLabelKeys[filename].concat(deleteKeys);
                }else{
                    customLabelKeys = customLabelKeys.concat(_.keys(item.data))
                }
            } catch (error) {
                // console.log('error', error);
                customLabelKeys = customLabelKeys.concat(_.keys(item.data))
            }
        }else{
            throw new Error(item);
        }
    })

    updateObjectsI18n(lng, packageDir, objectConfigs, objectCustomLabelKeys, {I18n, I18nExport, objectql});

    const appConfigs = objectql.getAppConfigs();

    updateAppsI18n(lng, packageDir, appConfigs, customLabelKeys, {I18n, I18nExport, objectql});
}

async function updateObjectsI18n(lng, packageDir, configs, objectCustomLabelKeys, content){
    const {I18n, objectql, I18nExport} = content;
    _.each(configs, function(config){
        let filename = config.__filename;
        if(!path.normalize(filename).startsWith(path.normalize(packageDir))){ 
            return
        }
        if(filename && filename.indexOf("node_modules") < 0){
            let objectName = config.name;
            let ranslationsFolder = path.join(path.dirname(filename), '../../', OBJECT_TRANSLATIONS);
            // 兼容standard_object文件夹结构
            if(!fs.existsSync(path.join(path.dirname(filename), '../../', 'objects'))){
                ranslationsFolder = path.join(path.dirname(filename),  OBJECT_TRANSLATIONS)
            }
            if(!mkdirsSync(ranslationsFolder)){
                console.info(`${colors.red('Failed to create folder: ')} ${ranslationsFolder}`);
                return
            }
            let fileFolder = path.join(ranslationsFolder, `${objectName}.${lng}`);
            if(!mkdirsSync(fileFolder)){
                console.info(`${colors.red('Failed to create folder: ')} ${fileFolder}`);
                return
            }
            let filePath = path.join(fileFolder, `${objectName}.${lng}.${OBJECT_TRANSLATION_SUFFIX}.yml`);
            let data = I18n.getObjectMetadataTranslationTemplate(lng, objectName, config);

            const objectCustomLabels = {};

            _.each(objectCustomLabelKeys[objectName], function(key){
                const label = I18n._t(key, {lng: lng, ns: 'translation'});
                if(label != key){
                    objectCustomLabels[key] = label;
                }else{
                    objectCustomLabels[key] = '';
                }
            })

            if(!_.isEmpty(objectCustomLabels)){
                data['CustomLabels'] = objectCustomLabels;
            }

            fs.outputFileSync(filePath, I18nExport.toYml(data));
            console.info(`${colors.cyan('Add   : ')} ${filePath}`);
            
        }
    })
}

async function updateAppsI18n(lng, packageDir, configs, customLabelKeys, content){
    const {I18n, objectql, I18nExport} = content;

    const appTemplates = {};

    _.each(configs, function(config){
        let filename = config.__filename;
        if(!path.normalize(filename).startsWith(path.normalize(packageDir))){ 
            return
        }
        if(filename && filename.indexOf("node_modules") < 0){
            let appName = config._id;

            let inheritedTemplateData = I18n.getAppI18nTemplate(lng, appName, config);
            let inheritedKeys = _.keys(inheritedTemplateData);

            customLabelKeys = _.difference(customLabelKeys, inheritedKeys);

            let ranslationsFolder = path.join(path.dirname(filename), '../', TRANSLATIONS);

            // 兼容standard_object文件夹结构
            if(!fs.existsSync(path.join(path.dirname(filename), '../', 'applications'))){
                ranslationsFolder = path.join(path.dirname(filename), TRANSLATIONS);
            }

            if(!mkdirsSync(ranslationsFolder)){
                console.info(`${colors.red('Failed to create folder: ')} ${ranslationsFolder}`);
                return
            }

            if(!appTemplates[ranslationsFolder]){
                appTemplates[ranslationsFolder] = {};
            }
            appTemplates[ranslationsFolder] = Object.assign({}, appTemplates[ranslationsFolder], I18n.getAppMetadataTranslationTemplate(lng, appName, config));
        }
    })

    _.each(appTemplates, function(template:any, ranslationsFolder){
        let filePath = path.join(ranslationsFolder, `${lng}.${TRANSLATION_SUFFIX}.yml`)
        const customLabels = {};

        _.each(customLabelKeys, function(key){
            customLabels[key] = I18n._t(key, {lng: lng, ns: 'translation', returnObjects: true})
        })

        if(!_.isEmpty(customLabels)){
            template['CustomLabels'] = customLabels;
        }
        fs.outputFileSync(filePath, I18nExport.toYml(template));
        console.info(`${colors.cyan('Add   : ')} ${filePath}`);
    })

    if(!_.isEmpty(customLabelKeys)){
        let template = {};
        let ranslationsFolder = path.join(packageDir, 'main', 'default', TRANSLATIONS);
        if(!mkdirsSync(ranslationsFolder)){
            console.info(`${colors.red('Failed to create folder: ')} ${ranslationsFolder}`);
            return
        }

        let filePath = path.join(ranslationsFolder, `${lng}.${TRANSLATION_SUFFIX}.yml`)
        const customLabels = {};

        _.each(customLabelKeys, function(key){
            customLabels[key] = I18n._t(key, {lng: lng, ns: 'translation', returnObjects: true})
        })

        if(!_.isEmpty(customLabels)){
            template['CustomLabels'] = customLabels;
        }
        if(!fs.existsSync(filePath)){
            fs.outputFileSync(filePath, I18nExport.toYml(template));
            console.info(`${colors.cyan('Add   : ')} ${filePath}`);
        }
    }
}