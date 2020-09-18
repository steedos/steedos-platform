export function viewStateSelector(state: any, id: string){
    return state.views.byId ? state.views.byId[id] : undefined
}