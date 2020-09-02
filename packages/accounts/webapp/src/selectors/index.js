export function getSettings(state) {
    const tenant = state.tenant
    return {
        ...state.settings,
        tenant,
    };
}

export function getTenant(state) {
    const tenant = Object.assign({}, state.settings.tenant, state.tenant)
    if (!tenant.name)
        tenant.name = "Steedos"
    return tenant;
}

export function getRequests(state){
    return state.requests
}

export function getSettingsTenantId(state){
    if(state.settings && state.settings.tenant){
        return state.settings.tenant._id
    }
}