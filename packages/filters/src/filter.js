// const DevExpress = require("devextreme/bundles/modules/core");
// const DevExpressData = require("devextreme/bundles/modules/data");
// const DevExpressOData = require("devextreme/bundles/modules/data.odata");
import { getFormatter as getLDMLFormatter } from "./date.formatter";
// const Guid = require("devextreme/core/guid");
// const EdmLiteral = require("devextreme/data/odata/utils").EdmLiteral;

const DevExpressData = {
    utils: {
        isConjunctiveOperator: function (condition) {
            return /^(and|&&|&)$/i.test(condition);
        },
        normalizeBinaryCriterion: function (crit) {
            return [
                crit[0],
                crit.length < 3 ? "=" : String(crit[1]).toLowerCase(),
                crit.length < 2 ? true : crit[crit.length - 1]
            ];
        },
        isUnaryOperation: function (crit) {
            return crit[0] === "!" && Array.isArray(crit[1]);
        }
    }
}

// const defaultDateNames = DevExpress.localization.date;
import defaultDateNames from "./default_date_names";

const DevExpressOData = {
    pad(text, length, right) {
        text = String(text);
        while (text.length < length) {
            text = right ? (text + "0") : ("0" + text);
        }
        return text;
    },
    padLeft2(text) {
        return this.pad(text, 2);
    },
    serializePropName(propName) {
        return propName.replace(/\./g, "/");
    },
    serializeValue(value, protocolVersion) {
        if(value === undefined){
            // 解决value为undefined的时候解析异常，需要返回null值
            // 有可能serializeValueV4函数中if (value instanceof Guid)逻辑被注释掉造成的，放开应该就会自动返回null
            return null;
        }
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
    serializeValueV2(value) {
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
    serializeValueV4(value) {
        if (value instanceof Date) {
            return this.formatISO8601(value, false, false);
        }
        // if (value instanceof Guid) {
        //     return value.valueOf();
        // }
        if (Array.isArray(value)) {
            return "[" + value.map((item)=>{
                return this.serializeValueV4(item);
            }).join(",") + "]";
        }
        return this.serializeValueV2(value);
    }, 
    serializeString(value) {
        return "'" + value.replace(/'/g, "''") + "'";
    },
    serializeDate(value, serializationFormat) {
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
    formatISO8601(date, skipZeroTime, skipTimezone) {
        var bag = [];

        var isZeroTime = function () {
            return date.getUTCHours() + date.getUTCMinutes() + date.getUTCSeconds() + date.getUTCMilliseconds() < 1;
        };

        bag.push(date.getUTCFullYear());
        bag.push("-");
        bag.push(this.padLeft2(date.getUTCMonth() + 1));
        bag.push("-");
        bag.push(this.padLeft2(date.getUTCDate()));

        if (!(skipZeroTime && isZeroTime())) {
            bag.push("T");
            bag.push(this.padLeft2(date.getUTCHours()));
            bag.push(":");
            bag.push(this.padLeft2(date.getUTCMinutes()));
            bag.push(":");
            bag.push(this.padLeft2(date.getUTCSeconds()));

            if (date.getUTCMilliseconds()) {
                bag.push(".");
                bag.push(this.pad(date.getUTCMilliseconds(), 3));
            }

            if (!skipTimezone) {
                bag.push("Z");
            }
        }

        return bag.join("");
    }
};


class SteedosFilter {

    constructor(filters, odataProtocolVersion = 4, forceLowerCase){
        this.filters = filters || [];
        this.protocolVersion = odataProtocolVersion;
        this.forceLowerCase = forceLowerCase;
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
                "notcontains": this.createStringFuncFormatter("not contains"),
                "notstartswith": this.createStringFuncFormatter("not startswith"),
                "notendswith": this.createStringFuncFormatter("not endswith"),
                "in": this.createBinaryOperationFormatter("in"),
                "notin": this.createBinaryOperationFormatter("notin")
            }
        };
    }

    createBinaryOperationFormatter(op) {
        return (prop, val)=> {
            return prop + " " + op + " " + val;
        };
    }

    createStringFuncFormatter(op, reverse) {
        return (prop, val)=> {
            var bag = [op, "("];

            if (val && this.forceLowerCase) {
                // prop = prop.indexOf("tolower(") === -1 ? "tolower(" + prop + ")" : prop;
                // forceLowerCase时不需要在prop外面增加tolower(..)，因为odata-v4-mongodb等包不支持
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

    compileUnary(criteria) {
        var op = criteria[0],
            crit = this.compileCore(criteria[1]);

        if (op === "!") {
            return "not (" + crit + ")";
        }
        throw new Error("E4003");
    }

    compileGroup(criteria) {
        var bag = [],
            groupOperator,
            nextGroupOperator;

        criteria.forEach((criterion) => {
            if (Array.isArray(criterion)) {

                if (bag.length > 1 && groupOperator !== nextGroupOperator) {
                    throw new Error("E4019");
                }

                bag.push("(" + this.compileCore(criterion) + ")");

                groupOperator = nextGroupOperator;
                nextGroupOperator = "and";
            } else {
                nextGroupOperator = DevExpressData.utils.isConjunctiveOperator(criterion) ? "and" : "or";
            }
        })

        return bag.join(" " + groupOperator + " ");
    }

    compileBinary(criteria){
        criteria = DevExpressData.utils.normalizeBinaryCriterion(criteria);

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
            (op === 'in' || op === 'notin') ? value : DevExpressOData.serializeValue(value, this.protocolVersion)
        );
    }

    compileCore(criteria) {
        if (!criteria || criteria.length === 0){
            return "";
        }
        if (Array.isArray(criteria[0])) {
            return this.compileGroup(criteria);
        }

        if (DevExpressData.utils.isUnaryOperation(criteria)) {
            return this.compileUnary(criteria);
        }

        return this.compileBinary(criteria);
    }
    
    formatFiltersToODataQuery() {
        // 转换filters为odata串
        let filters = this.filters;
        let query = this.compileCore(filters);
        return query;
    }
}

export default SteedosFilter;

