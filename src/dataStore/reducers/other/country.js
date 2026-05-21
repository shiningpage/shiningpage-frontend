export const country = (state = {}, action) => {
    switch (action.type) {
        case 'country':
            return action.country
        default:
            return state;
    }
  }
