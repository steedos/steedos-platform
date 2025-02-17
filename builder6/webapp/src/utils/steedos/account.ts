

export const Account = {
    disabledAccountRegister: ()=>{
        //TODO
        return (window as any).Tenant?.settings?.public?.accounts?.disabled_account_register
    }
}