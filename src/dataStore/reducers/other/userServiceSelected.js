export const userServiceSelected = (state = [], action) => {
    switch (action.type) {
        case 'UserServiceSelected':
            return action.userServiceSelected
        default:
            return state;
    }
  }
