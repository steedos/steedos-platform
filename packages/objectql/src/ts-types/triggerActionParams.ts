import { JsonMap } from "@salesforce/ts-types";
import { SteedosIDType } from "..";

export type TriggerActionParams = {
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
    operationType?: "BEFORE_INSERT" | "BEFORE_UPDATE" | "BEFORE_DELETE" | "AFTER_INSERT" | "AFTER_UPDATE" | "AFTER_DELETE" | "AFTER_UNDELETE",
    size?: number
}

