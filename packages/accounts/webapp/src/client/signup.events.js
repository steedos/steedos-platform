import { ApplyCode } from './index';

const EventEmitter = require('events');

const signUpEvent = new EventEmitter();

let lastOnError = null;

signUpEvent.on('inputNext', async (tenant, history, location, spaceId, name, action)=>{
    try {
        if(tenant.enable_bind_mobile || tenant.enable_bind_email){
            const data = await ApplyCode({
                name: name,
                action: action,
                spaceId: spaceId
            });
            if (data.token) {
                history.push({
                    pathname: `/verify/${data.token}`,
                    search: location.search,
                    state: { email: name.trim() }
                })
            }
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