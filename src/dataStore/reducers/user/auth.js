export const auth = (state = false, action) => {
    switch (action.type) {
        case 'AUTH':
            return action.auth
        default:
            return state;
    }
  }
