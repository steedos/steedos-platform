const tenant = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIVED_TENANT':
            return Object.assign({}, state, action.data);
        default:
            return state
    }
}

export default tenant