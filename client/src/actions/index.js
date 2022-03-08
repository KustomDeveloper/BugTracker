export const logInUser = () => {
    return {
        type: 'AUTHENTICATE'
    }
}
export const logOutUser = () => {
    return {
        type: 'UNAUTHENTICATE'
    }
}
