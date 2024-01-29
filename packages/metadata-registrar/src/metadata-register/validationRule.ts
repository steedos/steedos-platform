import { RegisterBase } from "./_base";
const SERVICE_NAME = 'validationRule';
class RegisterValidationRule extends RegisterBase {
    constructor() {
        super(SERVICE_NAME);
    }

    getApiName(config) {
        return `${config.object_name}.${config.name}`
    }
}

export const registerShareRules = new RegisterValidationRule();