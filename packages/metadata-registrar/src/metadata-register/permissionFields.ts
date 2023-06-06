import { RegisterBase } from "./_base";
const SERVICE_NAME = 'permission_fields';
class RegisterPermissionFields extends RegisterBase {
    constructor() {
        super(SERVICE_NAME);
    }

    getApiName(config) {
        return `${config.name}`
    }
}

export const registerPermissionFields = new RegisterPermissionFields();