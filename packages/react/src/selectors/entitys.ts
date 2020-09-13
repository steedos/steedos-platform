export function entityStateSelector(state: any, entityName: string){
    return state.entities ? state.entities[entityName] : undefined
}

export function getObject(state: any, objectName: string){
    return state.entities ? state.entities.objects[objectName] : undefined
}