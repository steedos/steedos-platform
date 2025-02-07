export function getSettings(state:any) {
    return {
        ...state.settings,
    };
}

export function getTenant(state:any) {
    const tenant = Object.assign({}, state.settings.tenant)
    if (!tenant.name)
        tenant.name = "Steedos"
    return tenant;
}

export function getRequests(state:any){
    return state.requests
}

export function getSettingsTenantId(state:any){
    if(state.settings && state.settings.tenant){
        return state.settings.tenant._id
    }
}

