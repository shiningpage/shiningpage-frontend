export const notSeenChatQTY = (state = '0', action) => {
    switch (action.type) {
        case 'notSeenChatQTY':
            return action.notSeenChatQTY
        default:
            return state;
    }
  }
