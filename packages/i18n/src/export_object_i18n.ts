import { getObjectI18nTemplate } from './translation';
const objectql = require('@steedos/objectql');


export const exportObjectI18n = async (req: any, res: any)=>{
    let lng = req.params.lng;
    let objectName = req.params.objectName;
    let object = objectql.getOriginalObjectConfig(objectName); //getOriginalObjectConfig
    res.setHeader('Content-type', 'application/x-msdownload');
    res.setHeader('Content-Disposition', 'attachment;filename='+encodeURI(`${objectName}.${lng}.i18n.yml`));
    res.setHeader('Transfer-Encoding', '')
    if(object){
        let data = toYml(getObjectI18nTemplate(lng, objectName, object));
        res.send(data)
    }else{
        res.send({})
    }
}

export const toYml = function(date: StringMap){
    const yaml = require('js-yaml');
    return yaml.dump(date, {sortKeys: true}).replace(/: ''/g, ': ');
}
