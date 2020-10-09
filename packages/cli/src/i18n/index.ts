import fs = require("fs-extra");
import inquirer = require("inquirer");
import path = require("path");
const _ = require("underscore");
const colors = require('colors/safe');

export async function CliLogic(lng) {
    await updateObjectsI18n(lng)
}

async function updateObjectsI18n(lng){
    const objectql = require(require.resolve('@steedos/objectql', {paths: [process.cwd()]}));
    const I18n = require(require.resolve('@steedos/i18n', {paths: [process.cwd()]}));
    const I18nExport = require(require.resolve('@steedos/i18n/lib/export_object_i18n', {paths: [process.cwd()]}));
    var steedosSchema = objectql.getSteedosSchema();
    for (let dataSource in steedosSchema.getDataSources()) {
        await steedosSchema.getDataSource(dataSource).init();
    }
    const configs = objectql.getOriginalObjectConfigs();

    _.each(configs, function(config){
        let filename = config.__filename
        if(filename && filename.indexOf("node_modules") < 0){
            let objectName = config.name;
            let filePath = path.join(path.dirname(filename), `${objectName}.${lng}.i18n.yml`)
            let data = I18n.getObjectI18nTemplate(lng, objectName, config);
            if(fs.existsSync(filePath)){
                let _i18nData = objectql.loadFile(filePath);
                //old keys
                let oldKeys = _.keys(_i18nData);
                //new keys
                let keys = _.keys(data);

                let inheritedObjectConfig = objectql.getObjectConfig(objectName);
                let inheritedKeys = keys;
                if(inheritedObjectConfig){
                    let inheritedTemplateData = I18n.getObjectI18nTemplate(lng, objectName, inheritedObjectConfig);
                    inheritedKeys = _.keys(inheritedTemplateData)
                }
                
                let deleteKeys = _.difference(oldKeys, inheritedKeys);
                let newKeys = _.difference(keys, oldKeys);
                
                _.each(deleteKeys, function(key){
                    delete _i18nData[key];
                })

                _.each(newKeys, function(key){
                    _i18nData[key] = data[key];
                })
                fs.outputFileSync(filePath, I18nExport.toYml(_i18nData));
                console.info(`${colors.magenta('Modify: ')} ${filePath}`);
            }else{
                fs.outputFileSync(filePath, I18nExport.toYml(data));
                console.info(`${colors.cyan('Add   : ')} ${filePath}`);
            }
            
        }
    })
}