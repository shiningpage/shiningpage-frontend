export const toggleChat = (state = false, action) => {
    switch (action.type) {
        case 'toggleChat':
            return action.toggleChat
        default:
            return state;
    }
}
