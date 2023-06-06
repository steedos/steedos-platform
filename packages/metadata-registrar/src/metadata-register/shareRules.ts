import { RegisterBase } from "./_base";
const SERVICE_NAME = 'share_rules';
class RegisterShareRules extends RegisterBase {
    constructor() {
        super(SERVICE_NAME);
    }

    getApiName(config) {
        return `${config.object_name}.${config.name}`
    }
}

export const registerShareRules = new RegisterShareRules();