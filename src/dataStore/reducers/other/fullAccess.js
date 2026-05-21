export const fullAccess = (state = false, action) => {
    switch (action.type) {
        case 'fullAccess':
            return action.fullAccess
        default:
            return state;
    }
  }
