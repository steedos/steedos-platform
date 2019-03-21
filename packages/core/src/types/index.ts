import { Dictionary } from "@salesforce/ts-types";

export class SteedosObjectType {

    name: String
    fields: Dictionary<SteedosObjectType>

}

export type SteedosAction = {
    
}

export class SteedosDataSource {
    
}

export class SteedosTrigger {
    
}

export class SteedosField {
    
}

export { SteedosSchema } from "./schema";