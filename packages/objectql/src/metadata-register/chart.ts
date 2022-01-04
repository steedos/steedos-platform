import { RegisterBase } from "./_base";
const SERVICE_NAME = 'charts';
class RegisterChart extends RegisterBase{
    constructor(){
        super(SERVICE_NAME);
    }
}

export const registerChart = new RegisterChart();