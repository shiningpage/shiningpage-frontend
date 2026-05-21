export const subChatInfo = (state = [], action) => {
    switch (action.type) {
        case 'subChatInfo':
            return  action.subChatInfo
        default:
            return state;
    }
  }
