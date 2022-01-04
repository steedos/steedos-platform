import { JsonMap } from "@salesforce/ts-types";
import { SteedosIDType } from "..";

export type TriggerActionParams = {
    objectName?: string
    isExecuting?: boolean,
    isInsert?: boolean,
    isUpdate?: boolean,
    isDelete?: boolean,
    isBefore?: boolean,
    isAfter?: boolean,
    isUndelete?: boolean,
    new?: [JsonMap],
    newMap?: [SteedosIDType],
    old?: [JsonMap],
    oldMap?: [SteedosIDType],
    operationType?: "BEFORE_FIND" | "BEFORE_AGGREGATE" | "BEFORE_INSERT" | "BEFORE_UPDATE" | "BEFORE_DELETE" | "AFTER_FIND" | "AFTER_AGGREGATE" | "AFTER_COUNT" | "AFTER_FINDONE" | "AFTER_INSERT" | "AFTER_UPDATE" | "AFTER_DELETE" | "AFTER_UNDELETE",
    size?: number
}

