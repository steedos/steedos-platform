const settings = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIEVED_SETTINGS':
            return action.data;
        default:
            return state
    }
}

export default settings