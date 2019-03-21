import fs = require("fs");
import path = require('path');
import { Project, AppManager, getObjectConfigManager, TriggerManager, FieldManager, ReportManager} from '.'

var _ = require('underscore');
var util = require('./util')

function useFilePath(filePath: string){
    if(!path.isAbsolute(filePath)){
        filePath = path.resolve(filePath)
    }

    if(!fs.existsSync(filePath)){
        throw new Error(`${filePath} not exist`);
    }

    if(fs.statSync(filePath).isDirectory()){
        Project.load(filePath)
    }

    if(util.isAppFile(filePath)){
        AppManager.loadFile(filePath)
    }else if(util.isObjectFile(filePath)){
        getObjectConfigManager().createFromFile(filePath)
    }else if(util.isTriggerFile(filePath)){
        TriggerManager.loadFile(filePath)
    }else if(util.isFieldFile(filePath)){
        FieldManager.loadFile(filePath)
    }else if(util.isReportFile(filePath)){
        ReportManager.loadFile(filePath)
    }
}

export function use(filePath: any){
    if(_.isArray(filePath)){
        filePath.forEach((element) => {
            useFilePath(element)
        });
    }else if(_.isString(filePath)){
        useFilePath(filePath)
    }else{
        throw new Error('filePath can only be a string or array')
    }
}