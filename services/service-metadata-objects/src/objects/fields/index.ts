export async function addObjectField() {}

enum SteedosFieldDBType {
    varchar = "varchar",
    text = "text",
    number = "number",
    boolean = "boolean",
    date = "date",
    dateTime = "dateTime",
    json = "json",
    array = "array",
    // oneToOne,
    // oneToMany,
    // manyToOne,
    // manyToMany
}

export function getDBType(objectName, field) {
    switch (field.type) {
        case "text":
            return SteedosFieldDBType.varchar;
        case "textarea":
            return SteedosFieldDBType.text;
        case "html":
            return SteedosFieldDBType.text;
        case "select":
            if (field.multiple) {
                return SteedosFieldDBType.varchar;
            } else {
                return SteedosFieldDBType.varchar;
            }
        case "color":
            return SteedosFieldDBType.text;
        case "boolean":
            return SteedosFieldDBType.boolean;
        case "toggle":
            return SteedosFieldDBType.boolean;
        case "date":
            return SteedosFieldDBType.date;
        //时间字段按日期时间类型处理
        case "time":
        case "datetime":
            return SteedosFieldDBType.dateTime;
        //百分比字段按数值类型处理
        case "percent":
        case "number":
            return SteedosFieldDBType.number;
        case "currency":
            if (!field.scale && field.scale != 0) {
                field.scale = 2;
            }
            return SteedosFieldDBType.number;
        case "password":
            return SteedosFieldDBType.varchar;
        case "lookup":
            // let reference_to = this.reference_to
            // if(_.isFunction(this.reference_to)){
            //     reference_to = this.reference_to()
            // }

            // if(_.isArray(reference_to)){
            //     this._columnType = SteedosColumnType.manyToMany
            // }else{
            //     if(this.multiple){
            //         this._columnType = SteedosColumnType.oneToMany
            //     }else{
            //         this._columnType = SteedosColumnType.oneToOne
            //     }
            // }
            return SteedosFieldDBType.varchar;
        case "master_detail":
            // let reference_to2 = this.reference_to
            // if(_.isFunction(this.reference_to)){
            //     reference_to2 = this.reference_to()
            // }

            // if(_.isArray(reference_to2)){
            //     this._columnType = SteedosColumnType.manyToMany
            // }else{
            //     if(this.multiple){
            //         this._columnType = SteedosColumnType.manyToOne //TODO
            //     }else{
            //         this._columnType = SteedosColumnType.oneToOne
            //     }
            // }
            return SteedosFieldDBType.varchar;
        case "grid":
            return SteedosFieldDBType.array;
        case "url":
            return SteedosFieldDBType.varchar;
        case "email":
            return SteedosFieldDBType.varchar;
        case "avatar":
            return SteedosFieldDBType.varchar;
        case "location":
            return SteedosFieldDBType.json;
        case "image":
            return SteedosFieldDBType.varchar;
        case "object":
            return SteedosFieldDBType.json;
        case "url":
            return SteedosFieldDBType.varchar;
        case "[object]":
            return SteedosFieldDBType.array;
        case "[Object]":
            return SteedosFieldDBType.array;
        case "[grid]":
            return SteedosFieldDBType.array;
        case "[text]":
            return SteedosFieldDBType.array;
        case "selectCity":
            return SteedosFieldDBType.json;
        case "audio":
            return SteedosFieldDBType.varchar;
        case "filesize":
            return SteedosFieldDBType.number;
        case "file":
            return SteedosFieldDBType.varchar;
        case "string":
            return SteedosFieldDBType.varchar;
        case "code":
            return SteedosFieldDBType.varchar;
        case "function Object() { [native code] }":
            return SteedosFieldDBType.json;
        case Object:
            return SteedosFieldDBType.json;
        case "function String() { [native code] }":
            return SteedosFieldDBType.varchar;
        case String:
            return SteedosFieldDBType.varchar;
        case "Object":
            return SteedosFieldDBType.json;
        case "autonumber":
            return SteedosFieldDBType.varchar;
        case "markdown":
            return SteedosFieldDBType.varchar;
        case "formula":
            return getDBType(objectName, { ...field, type: field.data_type });
        case "summary":
            //汇总不需要check类型
            return SteedosFieldDBType.varchar;
        default:
            console.log(`field`, field);
            throw new Error(
                `${objectName}.${field.name} invalid field type ${field.type}`
            );
    }
}
