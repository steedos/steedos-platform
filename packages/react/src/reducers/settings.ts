const settings = (state = {}, action: any) => {
    switch (action.type) {
        case 'RECEIVED_SETTINGS':
            return Object.assign({}, state, action.data);
        default:
            return state
    }
}

export default settings