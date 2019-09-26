function getSettingsState(state: any){
    return state.settings ? state.settings: undefined
}

function getDataServices(state: any){
    return state.settings ? state.settings.services.odata: undefined
}

export default {
    getSettingsState,
    getDataServices
}