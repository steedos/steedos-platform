const settings = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIVED_SETTINGS':
            return Object.assign({}, state, action.data);
        default:
            return state
    }
}

export default settings