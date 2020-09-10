import { ApplyCode } from './index';

const EventEmitter = require('events');

const signUpEvent = new EventEmitter();

let lastOnError = null;

signUpEvent.on('inputNext', async (tenant, history, location, spaceId, name, action)=>{
    try {
        if(tenant.enable_mobile_code_login || tenant.enable_email_code_login){
            history.push({
                pathname: `/verify/${action}`,
                search: location.search,
                state: { email: name.trim() }
            })
        }else{
            history.push({
                pathname: `/signup-password`,
                search: location.search,
                state: { email: name.trim() }
            })
        }
    } catch (error) {
        signUpEvent.emit('error', error);
    }
})

function signUpEventOnError(Func){
    if(lastOnError){
        signUpEvent.off("error", lastOnError);
    }
    signUpEvent.on("error", Func);
    lastOnError = Func;
}

export {
    signUpEvent,
    signUpEventOnError
};