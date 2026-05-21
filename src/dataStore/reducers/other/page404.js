export const page404 = (state = false, action) => {
    switch (action.type) {
        case 'page404':
            return action.page404
        default:
            return state;
    }
}
