import { RegisterBase } from "./_base";
const SERVICE_NAME = 'processTrigger';
class RegisterProcessTrigger extends RegisterBase {
    constructor() {
        super(SERVICE_NAME);
    }

    /**
     * 
     * @param metadata 
     *  {
            "name": name,
            "listenTo": wt.listenTo,
            "when": when,
            "handler": handler.toString()
        }
     * @returns 
     */
    getApiName(metadata) {
        return `${metadata.listenTo}.${metadata.when}.${metadata.name}`;
    }
}

export const registerProcessTrigger = new RegisterProcessTrigger();