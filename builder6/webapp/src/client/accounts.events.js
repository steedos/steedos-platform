const EventEmitter = require('events');

const accountsEvent = new EventEmitter();
let lastOnError = null;

accountsEvent.on("goSignup", (tenant, history, location, state)=>{
    try {
        if(tenant.enable_mobile_code_login || tenant.enable_email_code_login){
            history.push({
                pathname: `/signup`,
                search: location.search,
                state: state
            })
        }else{
            history.push({
                pathname: `/signup-password`,
                search: location.search,
                state: state
            })
        }
    } catch (error) {
        accountsEvent.emit('error', error);
    }
})

function accountsEventOnError(Func){
    if(lastOnError){
        accountsEvent.off("error", lastOnError);
    }
    accountsEvent.on("error", Func);
    lastOnError = Func;
}

export {
    accountsEvent,
    accountsEventOnError
};