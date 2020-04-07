const tenant = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIVED_TENANT':
            return Object.assign({}, state, action.data);
        case 'UNEXISTS_TENANT':
            let searchStr = window.location.hash.substring(window.location.hash.indexOf("?"));
            const searchParams = new URLSearchParams(searchStr);
            searchParams.delete('X-Space-Id');
            window.location.href = window.location.href.replace(searchStr, "?"+searchParams.toString());
            window.location.reload();
            return state
        default:
            return state
    }
}

export default tenant