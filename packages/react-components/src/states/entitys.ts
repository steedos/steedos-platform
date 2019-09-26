export function getEntityState(state: any, entityName: string){
    return state.entities ? state.entities[entityName] : undefined
}