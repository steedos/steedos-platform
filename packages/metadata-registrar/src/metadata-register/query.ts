import { RegisterBase } from "./_base";
const SERVICE_NAME = 'queries';
class RegisterQuery extends RegisterBase{
    constructor(){
        super(SERVICE_NAME);
    }
}

export const registerQuery = new RegisterQuery();