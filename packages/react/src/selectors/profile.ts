export function getProfile(state: any){
    return state.entities ? state.entities.user : undefined
}