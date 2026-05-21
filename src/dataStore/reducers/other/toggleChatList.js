export const toggleChatList = (state = false, action) => {
    switch (action.type) {
        case 'Toggle_Chat_List':
            return action.toggleChatList
        default:
            return state;
    }
  }
