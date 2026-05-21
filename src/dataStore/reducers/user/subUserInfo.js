export const subUserInfo = (state = [], action) => {
    switch (action.type) {
        case 'SUB_USER_INFO':
            return  action.subUserInfo
        default:
            return state;
    }
  }
