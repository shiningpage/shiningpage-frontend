export const membership = (state = false, action) => {
    switch (action.type) {
        case 'MEMBERSHIP':
            return action.membership
        default:
            return state;
    }
  }
