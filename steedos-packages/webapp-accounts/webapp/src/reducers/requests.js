const requests = (state = {}, action) => {
    switch (action.type) {
        case 'change':
            return Object.assign({}, state, {status: action.data});
        default:
            return state
    }
}

export default requests