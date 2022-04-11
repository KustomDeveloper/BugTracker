const userReducer = (state = "", action) => {
    switch(action.type) {
        case 'ADDUSERNAME':
            return {
              value: action.payload
            }
        case 'CLEARUSERNAME':
            return state
        default: 
            return state
    }
}

export default userReducer