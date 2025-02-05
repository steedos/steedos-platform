export function requests(status) {
    return (dispatch) => {
        dispatch({
            type:"change",
            data: status,
        });
    }
}

