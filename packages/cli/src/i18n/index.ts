import fs = require("fs-extra");
import inquirer = require("inquirer");
import path = require("path");
const _ = require("underscore");

export async function CliLogic(lng) {
    await updateObjectsI18n(lng)
}

async function updateObjectsI18n(lng){
    const objectql = require('@steedos/objectql');
    const I18n = require("@steedos/i18n");
    var steedosSchema = objectql.getSteedosSchema();
    for (let dataSource in steedosSchema.getDataSources()) {
        await steedosSchema.getDataSource(dataSource).init();
    }
    const configs = objectql.getOriginalObjectConfigs();

    _.each(configs, function(config){
        let filename = config.__filename
        if(filename && filename.indexOf("node_modules") < 0){
            let filePath = path.join(path.dirname(filename), `${lng}.i18n.yml`)
            let data = I18n.getObjectI18nTemplate(lng, config.name, config);
            if(fs.existsSync(filePath)){
                console.log('修改资源文件 filePath', filePath);
                //fs.outputFileSync(filePath, data)
            }else{
                fs.outputFileSync(filePath, data);
            }
            
        }
    })

    // console.log('objectql.getObjectConfigs ', _.pluck(configs, 'name'));
}