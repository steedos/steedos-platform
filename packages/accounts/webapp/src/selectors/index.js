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

export function getCurrentSpace(state) {
    return state.entities.spaces.profiles[getCurrentSpaceId(state)];
}

export function getCurrentSpaceId(state) {
    return state.entities.spaces.currentSpaceId;
}

export function getCurrentUser(state) {
    return state.entities.users.profiles[getCurrentUserId(state)];
}

export function getCurrentUserId(state) {
    return state.entities.users.currentUserId;
}

export function getUsers(state) {
    return state.entities.users.profiles;
}

export function getRequests(state){
    return state.requests
}

export function getSettingsTenantId(state){
    if(state.settings && state.settings.tenant){
        return state.settings.tenant._id
    }
}