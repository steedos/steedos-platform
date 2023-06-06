import { RegisterBase } from "./_base";
const SERVICE_NAME = 'restriction_rules';
class RegisterRestrictionRules extends RegisterBase {
    constructor() {
        super(SERVICE_NAME);
    }

    getApiName(config) {
        return `${config.object_name}.${config.name}`
    }
}
export const registerRestrictionRules = new RegisterRestrictionRules();