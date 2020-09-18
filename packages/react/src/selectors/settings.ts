export function settingsStateSelector(state: any){
    return state.settings ? state.settings: undefined
}

export function dataServicesSelector(state: any){
    return state.settings ? state.settings.services.steedos: undefined
}