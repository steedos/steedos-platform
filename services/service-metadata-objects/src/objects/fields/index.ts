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
            if (this.multiple) {
                return SteedosFieldDBType.array;
            } else {
                return SteedosFieldDBType.varchar;
            }
        case "boolean":
            return SteedosFieldDBType.boolean;
        case "toggle":
            return SteedosFieldDBType.boolean;
        case "date":
            return SteedosFieldDBType.date;
        case "datetime":
            return SteedosFieldDBType.dateTime;
        case "number":
            return SteedosFieldDBType.number;
        case "currency":
            if (!this.scale && this.scale != 0) {
                this.scale = 2;
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
            return this.getDBType(this.data_type);
        case "summary":
            //汇总不需要check类型
            return SteedosFieldDBType.varchar;
        case "percent":
            //百分比字段按数值类型处理
            return this.getDBType("number");
        default:
            console.log(`field`, field);
            throw new Error(
                `${objectName}.${field.name} invalid field type ${field.type}`
            );
    }
}
