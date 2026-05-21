export const sendMessage = (state = false, action) => {
    switch (action.type) {
        case 'sendMessage':
            return action.sendMessage
        default:
            return state;
    }
}
