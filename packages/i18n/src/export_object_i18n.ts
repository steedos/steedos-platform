import { getObjectI18nTemplate } from './translation';
const objectql = require('@steedos/objectql');
const clone = require("clone");

export const exportObjectI18n = async (req: any, res: any)=>{
    let lng = req.params.lng;
    let objectName = req.params.objectName;
    console.log('exportObjectI18n', objectName);
    let object = objectql.getOriginalObjectConfig(objectName); //getOriginalObjectConfig
    console.log('getOriginalObjectConfig', object);
    res.setHeader('Content-type', 'application/x-msdownload');
    res.setHeader('Content-Disposition', 'attachment;filename='+encodeURI(`${objectName}.${lng}.i18n.yml`));
    res.setHeader('Transfer-Encoding', '')
    if(object){
        object = Creator.convertObject(clone(object));
        res.send(getObjectI18nTemplate(lng, objectName, object))
    }else{
        res.send({})
    }
}

