import { RegisterBase } from "./_base";
const SERVICE_NAME = 'pages';
class RegisterPage extends RegisterBase{
    constructor(){
        super(SERVICE_NAME);
    }
}

export const registerPage = new RegisterPage();