export const setLT = (state = {}, action) => {
    switch (action.type) {
        case 'setLT':
            return action.setLT
        default:
            return state;
    }
}
