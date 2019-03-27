// import { getFormatter } from "../date.formatter";
// import getFormatter = require("../date.formatter");
const getLDMLFormatter = require("./date.formatter").getFormatter;
// const defaultDateNames = require("../default_date_names");
import DevExpress = require("devextreme/bundles/modules/core");
import DevExpressData = require("devextreme/bundles/modules/data");
// import DevExpressOData = require("devextreme/bundles/modules/data.odata");
// declare var DevExpress: any;

// <reference path="../../../../node_modules/devextreme/bundles/dx.all.d.ts" />
// <reference path="../../types/devexpress/dx.all.d.ts" />
// <reference path="../../types/devextreme/index.d.ts" />
// declare global {
//     interface DevExpress {

//     }
// }
// import DevExpress from "devextreme/bundles/dx.all.d";
// import DevExpress from "devextreme/bundles/modules/core";
// declare var DevExpress: any;

// import DevExpressData from "devextreme/bundles/modules/data";
// import DevExpressOData from "devextreme/bundles/modules/data.odata";

// DevExpress.data = DevExpressData;
// DevExpress.data.odata = DevExpressData;
// import DevExpress = require("devextreme/bundles/dx.all");
// import DevExpress = require("devextreme/bundles/dx.all.d");
// <reference path="devextreme/bundles/dx.all.d.ts" />
// <reference path="../../../../node_modules/devextreme/bundles/dx.all.d.ts" />

// declare var DevExpress: any;
// const DevExpress = require("devextreme/bundles/modules/core");
// const DevExpressData = require("devextreme/bundles/modules/data");
// const DevExpressOData = require("devextreme/bundles/modules/data.odata");

// import * as DevExpress from "../../types/devexpress/dx.all.d.ts";
// import * as DevExpress from "../../types/devexpress/index";
// import * as DevExpress from 'devextreme';


// const DevExpressData = {
//     isConjunctiveOperator(criterion:any):any{
//     },
//     normalizeBinaryCriterion(criteria: any): any {
//     },
//     isUnaryOperation(criteria: any): any {
//     }
// };

DevExpressData.isUnaryOperation = (crit: any[]): boolean => {
    return crit[0] === "!" && Array.isArray(crit[1]);
}

const defaultDateNames = DevExpress.localization.date;

const DevExpressOData = {
    serializePropName(propName: string): string {
        return propName.replace(/\./g, "/");
    },
    serializeValue(value: any, protocolVersion: number): any {
        switch (protocolVersion) {
            case 2:
                return this.serializeValueV2(value);
            case 3:
                return this.serializeValueV2(value);
            case 4:
                return this.serializeValueV4(value);
            default: 
                return this.serializeValueV4(value);
        }
    },
    serializeValueV2(value: any): any {
        if (value instanceof Date) {
            return this.serializeDate(value);
        }
        // if (value instanceof Guid) {
        //     return "guid'" + value + "'";
        // }
        // if (value instanceof EdmLiteral) {
        //     return value.valueOf();
        // }
        if (typeof value === "string") {
            return this.serializeString(value);
        }
        return String(value);
    },
    serializeValueV4(value: any): any {
        if (value instanceof Date) {
            return this.formatISO8601(value, false, false);
        }
        // if (value instanceof Guid) {
        //     return value.valueOf();
        // }
        if (Array.isArray(value)) {
            return "[" + value.map(function (item) {
                return this.serializeValueV4(item);
            }).join(",") + "]";
        }
        return this.serializeValueV2(value);
    },
    serializeDate(value: any, serializationFormat?: any): any {
        if (!serializationFormat) {
            return value;
        }

        if (!(value instanceof Date)) {
            return null;
        }

        if (serializationFormat === "number") {
            return value && value.valueOf ? value.valueOf() : null;
        }

        return getLDMLFormatter(serializationFormat, defaultDateNames)(value);
    },
    formatISO8601(date: Date, skipZeroTime: boolean, skipTimezone: boolean): string {
        var bag = [];

        var isZeroTime = function () {
            return date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1;
        };

        bag.push(date.getFullYear());
        bag.push("-");
        bag.push(this.padLeft2(date.getMonth() + 1));
        bag.push("-");
        bag.push(this.padLeft2(date.getDate()));

        if (!(skipZeroTime && isZeroTime())) {
            bag.push("T");
            bag.push(this.padLeft2(date.getHours()));
            bag.push(":");
            bag.push(this.padLeft2(date.getMinutes()));
            bag.push(":");
            bag.push(this.padLeft2(date.getSeconds()));

            if (date.getMilliseconds()) {
                bag.push(".");
                bag.push(this.pad(date.getMilliseconds(), 3));
            }

            if (!skipTimezone) {
                bag.push("Z");
            }
        }

        return bag.join("");
    }
};

// const DevExpressData = DevExpress.data;
// DevExpress.default.data.utils.odata
console.log("===================11=====34=====33===");
// console.log(DevExpress.data.utils);
// console.log(DevExpress.default.data.utils.odata);
console.log(DevExpress.localization);

class SteedosDriverFilter {

    private filters: Array<string> | Array<Array<string>>;
    private protocolVersion: number;
    private forceLowerCase: boolean;
    private formatters: any;
    private formattersV2: any;
    private formattersV4: any;
    
    constructor(filters: Array<string> | Array<Array<string>>, odataProtocolVersion?: number, forceLowerCase?: boolean){
        this.filters = filters || [];
        this.protocolVersion = odataProtocolVersion || 4;
        this.forceLowerCase = forceLowerCase || true;
        this.formatters = {
            "=": this.createBinaryOperationFormatter("eq"),
            "<>": this.createBinaryOperationFormatter("ne"),
            ">": this.createBinaryOperationFormatter("gt"),
            ">=": this.createBinaryOperationFormatter("ge"),
            "<": this.createBinaryOperationFormatter("lt"),
            "<=": this.createBinaryOperationFormatter("le"),
            "startswith": this.createStringFuncFormatter("startswith"),
            "endswith": this.createStringFuncFormatter("endswith")
        };
        this.formattersV2 = {...this.formatters, ...{
                "contains": this.createStringFuncFormatter("substringof", true),
                "notcontains": this.createStringFuncFormatter("not substringof", true)
            }
        };
        this.formattersV4 = {
            ...this.formatters, ...{
                "contains": this.createStringFuncFormatter("contains"),
                "notcontains": this.createStringFuncFormatter("not contains")
            }
        };
    }

    private createBinaryOperationFormatter(op: string): any {
        return (prop: string, val: string)=> {
            return prop + " " + op + " " + val;
        };
    }

    private createStringFuncFormatter(op: string, reverse?: boolean): any {
        return (prop: string, val: string)=> {
            var bag = [op, "("];

            if (this.forceLowerCase) {
                prop = prop.indexOf("tolower(") === -1 ? "tolower(" + prop + ")" : prop;
                val = val.toLowerCase();
            }

            if (reverse) {
                bag.push(val, ",", prop);
            } else {
                bag.push(prop, ",", val);
            }

            bag.push(")");
            return bag.join("");
        };
    }

    // private isUnaryOperation(crit: any[]): boolean{
    //     return crit[0] === "!" && Array.isArray(crit[1]);
    // }

    // private isConjunctiveOperator(condition: string): boolean {
    //     return /^(and|&&|&)$/i.test(condition);
    // }

    // private serializePropName(propName: string): string {
    //     return propName.replace(/\./g, "/");
    // }

    // private serializeDate(value: any, serializationFormat?: any): any {
    //     if (!serializationFormat) {
    //         return value;
    //     }

    //     if (!(value instanceof Date)) {
    //         return null;
    //     }

    //     if (serializationFormat === "number") {
    //         return value && value.valueOf ? value.valueOf() : null;
    //     }

    //     return getLDMLFormatter(serializationFormat, defaultDateNames)(value);
    // }

    // private serializeString(value: string): string {
    //     return "'" + value.replace(/'/g, "''") + "'";
    // }

    // private serializeValue(value: any, protocolVersion: number): any {
    //     switch (protocolVersion) {
    //         case 2:
    //             return this.serializeValueV2(value);
    //         case 3:
    //             return this.serializeValueV2(value);
    //         case 4:
    //             return this.serializeValueV4(value);
    //         default: 
    //             return this.serializeValueV4(value);
    //     }
    // }

    // private pad(text: any, length?: any, right?: any): string {
    //     text = String(text);
    //     while (text.length < length) {
    //         text = right ? (text + "0") : ("0" + text);
    //     }
    //     return text;
    // }

    // private padLeft2(text: any): string {
    //     return this.pad(text, 2);
    // }

    // private formatISO8601(date: Date, skipZeroTime: boolean, skipTimezone: boolean): string {
    //     var bag = [];

    //     var isZeroTime = function () {
    //         return date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() < 1;
    //     };

    //     bag.push(date.getFullYear());
    //     bag.push("-");
    //     bag.push(this.padLeft2(date.getMonth() + 1));
    //     bag.push("-");
    //     bag.push(this.padLeft2(date.getDate()));

    //     if (!(skipZeroTime && isZeroTime())) {
    //         bag.push("T");
    //         bag.push(this.padLeft2(date.getHours()));
    //         bag.push(":");
    //         bag.push(this.padLeft2(date.getMinutes()));
    //         bag.push(":");
    //         bag.push(this.padLeft2(date.getSeconds()));

    //         if (date.getMilliseconds()) {
    //             bag.push(".");
    //             bag.push(this.pad(date.getMilliseconds(), 3));
    //         }

    //         if (!skipTimezone) {
    //             bag.push("Z");
    //         }
    //     }

    //     return bag.join("");
    // }

    // private serializeValueV2(value: any): any {
    //     if (value instanceof Date) {
    //         return this.serializeDate(value);
    //     }
    //     // if (value instanceof Guid) {
    //     //     return "guid'" + value + "'";
    //     // }
    //     // if (value instanceof EdmLiteral) {
    //     //     return value.valueOf();
    //     // }
    //     if (typeof value === "string") {
    //         return this.serializeString(value);
    //     }
    //     return String(value);
    // }

    // private serializeValueV4(value: any): any {
    //     if (value instanceof Date) {
    //         return this.formatISO8601(value, false, false);
    //     }
    //     // if (value instanceof Guid) {
    //     //     return value.valueOf();
    //     // }
    //     if (Array.isArray(value)) {
    //         return "[" + value.map(function (item) {
    //             return this.serializeValueV4(item);
    //         }).join(",") + "]";
    //     }
    //     return this.serializeValueV2(value);
    // }

    // private normalizeBinaryCriterion(crit: any[]): any[] {
    //     return [
    //         crit[0],
    //         crit.length < 3 ? "=" : String(crit[1]).toLowerCase(),
    //         crit.length < 2 ? true : crit[crit.length - 1]
    //     ];
    // }

    private compileUnary(criteria: any[]): string {
        var op = criteria[0],
            crit = this.compileCore(criteria[1]);

        if (op === "!") {
            return "not (" + crit + ")";
        }
        throw new Error("E4003");
    }

    private compileGroup(criteria: any[]): string {
        var bag = [],
            groupOperator: string,
            nextGroupOperator: string;

        criteria.forEach((criterion) => {
            if (Array.isArray(criterion)) {

                if (bag.length > 1 && groupOperator !== nextGroupOperator) {
                    throw new Error("E4019");
                }

                bag.push("(" + this.compileCore(criterion) + ")");

                groupOperator = nextGroupOperator;
                nextGroupOperator = "and";
            } else {
                nextGroupOperator = DevExpressData.isConjunctiveOperator(criterion) ? "and" : "or";
            }
        })

        return bag.join(" " + groupOperator + " ");
    }

    private compileBinary(criteria: any[]): string {
        criteria = DevExpressData.normalizeBinaryCriterion(criteria);

        var op = criteria[1],
            formatters = this.protocolVersion === 4
                ? this.formattersV4
                : this.formattersV2,
            formatter = formatters[op.toLowerCase()];

        if (!formatter) {
            throw new Error("E4003");
        }

        var fieldName = criteria[0],
            value = criteria[2];

        return formatter(
            DevExpressOData.serializePropName(fieldName),
            DevExpressOData.serializeValue(value, this.protocolVersion)
        );
    }

    private compileCore(criteria: any[]): string {
        if (Array.isArray(criteria[0])) {
            return this.compileGroup(criteria);
        }

        if (DevExpressData.isUnaryOperation(criteria)) {
            return this.compileUnary(criteria);
        }

        return this.compileBinary(criteria);
    }
    


    formatFiltersToODataQuery(): string {
        let filters = this.filters;
        console.log("formatFiltersToODataQuery=========", filters);
        // 转换filters为odata串
        return "(name eq 'ptr') and (title eq 'PTR')";
    }
}

export default SteedosDriverFilter;

let formatFiltersToODataQuery = (filters: Array<string> | Array<Array<string>>, odataProtocolVersion?: number, forceLowerCase?: boolean)=>{
    return new SteedosDriverFilter(filters, odataProtocolVersion, forceLowerCase).formatFiltersToODataQuery();
}

export { formatFiltersToODataQuery }