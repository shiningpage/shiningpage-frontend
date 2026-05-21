export const userInfo = (state = [], action) => {
    switch (action.type) {
        case 'USER_INFO':
            return  action.userInfo
        default:
            return state;
    }
  }
