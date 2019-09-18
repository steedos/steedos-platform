export function getSettings(state) {
    const tenant = state.tenant
    return {
        ...state.settings,
        tenant,
    };
}

export function getTenant(state) {
    const tenant = { ...state.tenant }
    if (tenant.avatar_dark) {
        tenant.logo = "/api/files/avatars/" + tenant.avatar_dark
    }
    if (!tenant.logo && state.settings.tenant.logo) {
        tenant.logo = state.settings.tenant.logo
    }
    if (!tenant.background && state.settings.tenant.background) {
        tenant.background = state.settings.tenant.background
    }
    if (!tenant.name && state.settings.tenant.name) {
        tenant.name = state.settings.tenant.name
    }
    if (!tenant.name)
        tenant.name = "Steedos"
    return tenant;
}