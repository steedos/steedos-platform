import { RegisterBase } from "./_base";
const SERVICE_NAME = 'tabs';
class RegisterTab extends RegisterBase{
    constructor(){
        super(SERVICE_NAME);
    }
}

export const registerTab = new RegisterTab();