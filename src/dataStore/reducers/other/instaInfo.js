export const instaInfo = (state = {}, action) => {
    switch (action.type) {
        case 'instaInfo':
            return action.instaInfo
        default:
            return state;
    }
  }
