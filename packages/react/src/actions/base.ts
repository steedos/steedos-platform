export function createAction(actionType: string, partialStateName: any, partialStateValue: any, options: any) {
    return {
        type: actionType,
        payload: {
            partialStateName,
            partialStateValue,
            ...options
        }
    }
}