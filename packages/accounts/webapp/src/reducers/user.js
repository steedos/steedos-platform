const user = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIVED_USER':
            return Object.assign({}, state, action.data);
        default:
            return state
    }
}

export default user