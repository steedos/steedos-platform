import { mkdirsSync } from '@steedos/metadata-core';
const fs = require("fs-extra");
const inquirer = require("inquirer");
const path = require("path");
const _ = require("underscore");
const colors = require('colors/safe');
const clone = require('clone');

const OBJECT_TRANSLATIONS = 'objectTranslations';
const TRANSLATIONS = 'translations';

const OBJECT_TRANSLATION_SUFFIX = 'objectTranslation';
const TRANSLATION_SUFFIX = 'translation';

export async function CliLogic(lng, packageDir) {
    await translationPackage(lng, packageDir)
}

async function translationPackage(lng, packageDir){
    require('dotenv-flow').config({
        silent: true,
        path: process.cwd()
    });
    const objectql = require(require.resolve('@steedos/objectql', {paths: [process.cwd()]}));
    // const core = require(require.resolve('@steedos/core/lib/init/i18n', {paths: [process.cwd()]}));
    const I18n = require(require.resolve('@steedos/i18n', {paths: [process.cwd()]}));
    // const I18nInit = require(require.resolve('@steedos/i18n/lib/core_i18n', {paths: [process.cwd()]}));
    const I18nExport = require(require.resolve('@steedos/i18n/lib/export_object_i18n', {paths: [process.cwd()]}));
    // var steedosSchema = objectql.getSteedosSchema();
    // objectql.loadStandardBaseObjects();
    // for (let dataSource in steedosSchema.getDataSources()) {
    //     if(dataSource !='meteor'){
    //         await steedosSchema.getDataSource(dataSource).loadFiles()
    //         await steedosSchema.getDataSource(dataSource).init();
    //     }
    // }
    // I18nInit.InitCoreI18n();
    
    // core.InitObjectI18n();

    if(!path.isAbsolute(packageDir)){
        packageDir = path.join(process.cwd(), packageDir)
    }
    await objectql.loadStandardBaseObjects(null);
    await objectql.loadPackageMetadatas(path.join(packageDir, '**'), 'default');
    const objectConfigs = objectql.getOriginalObjectConfigs();
    updateObjectsI18n(lng, packageDir, objectConfigs, {I18n, I18nExport, objectql});

    const appConfigs = objectql.getConfigsFormFiles('app', path.join(packageDir, '**'));
    updateAppsI18n(lng, packageDir, appConfigs, {I18n, I18nExport, objectql});
}

function null2str(data) {
    for (let x in data) {
      if (data[x] === null) { // 如果是null 把直接内容转为 ''
        data[x] = '';
      } else {
        if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
          data[x] = data[x].map(z => {
            return null2str(z);
          });
        }
        if(typeof(data[x]) === 'object'){ // 是json 递归继续处理
          data[x] = null2str(data[x])
        }
      }
    }
    return data;
  }

function sortAttribute(obj: any, debug=false){

    if(typeof obj == 'undefined' || obj == null){
        return
    }

    var temp = clone(obj);

    for(var key in obj){
        delete obj[key]
    }

    if(debug) console.log(obj);

    var keys = _.keys(temp).sort();

    // if(typeof temp['name'] != 'undefined'){
    //     obj['name'] = temp['name'] 
    // }

    if(debug) console.log(obj);
    
    for(var i=0; i<keys.length; i++){
        var k = keys[i]
        obj[k] = temp[k]
    }
    
    if(debug) console.log(obj);
}

async function updateObjectsI18n(lng, packageDir, configs, content){
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
            if(fs.existsSync(filePath)){
                let _translationData = objectql.loadFile(filePath);
                let oldFieldKeys = _.keys(_translationData.fields);
                let oldGroupKeys = _.keys(_translationData.groups);
                let oldListviewKeys = _.keys(_translationData.listviews);
                let oldActionKeys = _.keys(_translationData.actions);

                let translationFieldKeys = _.keys(data.fields);
                let translationGroupKeys = _.keys(data.groups);
                let translationListviewKeys = _.keys(data.listviews);
                let translationActionKeys = _.keys(data.actions);

                let inheritedObjectConfig = objectql.getObjectConfig(objectName);
                let inheritedFieldKeys = translationFieldKeys;
                let inheritedGroupKeys = translationGroupKeys;
                let inheritedListviewKeys = translationListviewKeys;
                let inheritedActionKeys = translationActionKeys;
                if(inheritedObjectConfig){
                    let inheritedTemplateData = I18n.getObjectMetadataTranslationTemplate(lng, objectName, inheritedObjectConfig);
                    inheritedFieldKeys = _.keys(inheritedTemplateData.fields);
                    inheritedGroupKeys = _.keys(inheritedTemplateData.groups);
                    inheritedListviewKeys = _.keys(inheritedTemplateData.listviews);
                    inheritedActionKeys = _.keys(inheritedTemplateData.actions);
                }

                let deleteFieldKeys = _.difference(oldFieldKeys, inheritedFieldKeys);
                let deleteGroupKeys = _.difference(oldGroupKeys, inheritedGroupKeys);
                let deleteListviewKeys = _.difference(oldListviewKeys, inheritedListviewKeys);
                let deleteActionKeys = _.difference(oldActionKeys, inheritedActionKeys);

                let newFieldKeys = _.difference(translationFieldKeys, oldFieldKeys);
                let newGroupKeys = _.difference(translationGroupKeys, oldGroupKeys);
                let newListviewKeys = _.difference(translationListviewKeys, oldListviewKeys);
                let newActionKeys = _.difference(translationActionKeys, oldActionKeys);
                
                _.each(deleteFieldKeys, function(key){
                    delete _translationData.fields[key];
                })

                _.each(deleteGroupKeys, function(key){
                    delete _translationData.groups[key];
                })

                _.each(deleteListviewKeys, function(key){
                    delete _translationData.listviews[key];
                })
                
                _.each(deleteActionKeys, function(key){
                    delete _translationData.actions[key];
                })

                _.each(newFieldKeys, function(key){
                    if(!_translationData.fields){
                        _translationData.fields = {}
                    }
                    _translationData.fields[key] = data.fields[key]
                })

                _.each(newGroupKeys, function(key){
                    if(!_translationData.groups){
                        _translationData.groups = {}
                    }
                    _translationData.groups[key] = data.groups[key]
                })

                _.each(newListviewKeys, function(key){
                    if(!_translationData.listviews){
                        _translationData.listviews = {}
                    }
                    _translationData.listviews[key] = data.listviews[key]
                })

                _.each(newActionKeys, function(key){
                    if(!_translationData.actions){
                        _translationData.actions = {}
                    }
                    _translationData.actions[key] = data.actions[key]
                })

                sortAttribute(_translationData.fields);
                sortAttribute(_translationData.groups);
                sortAttribute(_translationData.listviews);
                sortAttribute(_translationData.actions);
                sortAttribute(_translationData.CustomLabels);

                fs.outputFileSync(filePath, I18nExport.toYml(null2str(_translationData)));
                console.info(`${colors.magenta('Modify: ')} ${filePath}`);
            }else{
                fs.outputFileSync(filePath, I18nExport.toYml(null2str(data)));
                console.info(`${colors.cyan('Add   : ')} ${filePath}`);
            }
            
        }
    })
}

async function updateAppsI18n(lng, packageDir, configs, content){
    const {I18n, objectql, I18nExport} = content;

    const appTemplates = {};

    _.each(configs, function(config){
        let filename = config.__filename;
        if(!path.normalize(filename).startsWith(path.normalize(packageDir))){ 
            return
        }
        if(filename && filename.indexOf("node_modules") < 0){
            let appName = config._id;
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
            const customApplicationTemplate = I18n.getAppMetadataTranslationTemplate(lng, appName, config);
            appTemplates[ranslationsFolder].CustomApplications = Object.assign({}, appTemplates[ranslationsFolder].CustomApplications, customApplicationTemplate.CustomApplications);
            appTemplates[ranslationsFolder].CustomTabs = Object.assign({}, appTemplates[ranslationsFolder].CustomTabs, customApplicationTemplate.CustomTabs);
        }
    })

    _.each(appTemplates, function(template, ranslationsFolder){
        let filePath = path.join(ranslationsFolder, `${lng}.${TRANSLATION_SUFFIX}.yml`)
        if(fs.existsSync(filePath)){
            let _translationData = objectql.loadFile(filePath);
            let oldCustomApplicationsKeys = _.keys(_translationData.CustomApplications);

            let translationCustomApplicationsKeys  = _.keys(template.CustomApplications);
            
            let deleteCustomApplicationsKeys = _.difference(oldCustomApplicationsKeys, translationCustomApplicationsKeys);
            let newCustomApplicationsKeys = _.difference(translationCustomApplicationsKeys, oldCustomApplicationsKeys);
            
            _.each(deleteCustomApplicationsKeys, function(key){
                delete _translationData.CustomApplications[key];
            })

            _.each(newCustomApplicationsKeys, function(key){
                _translationData.CustomApplications[key] = template.CustomApplications[key] || '';
            })
            fs.outputFileSync(filePath, I18nExport.toYml(_translationData));
            console.info(`${colors.magenta('Modify: ')} ${filePath}`);
        }else{
            fs.outputFileSync(filePath, I18nExport.toYml(template));
            console.info(`${colors.cyan('Add   : ')} ${filePath}`);
        }
    })
}