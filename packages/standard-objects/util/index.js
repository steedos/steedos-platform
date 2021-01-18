const objectql = require('@steedos/objectql');
const isAPIName = function(apiName){
    var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$');
    if(!reg.test(apiName)){
        throw new Error("API 名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符");
    }
    if(apiName.length > 20){
        throw new Error("名称长度不能大于20个字符");
    }
    return true
}

exports.checkAPIName = async function(objectName, fieldName, fieldValue, recordId, filters){
    isAPIName(fieldValue);
    if(!filters){
        filters = []
    }
    filters.push([fieldName,'=', fieldValue])
    if(recordId){
        filters.push(['_id','!=', recordId])
    }

    var count = await objectql.getObject(objectName).count({filters: filters});

    if(count > 0){
        throw new Error('该 API 名称 已存在或先前已使用过。请选择其他名称。');
    }
}