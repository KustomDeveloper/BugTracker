const authReducer = (state = false, action) => {
    switch(action.type) {
        case 'AUTHENTICATE':
            return state = true;
        case 'UNAUTHENTICATE':
            return state = false;
        default: 
            return state;
    }
}

export default authReducer;