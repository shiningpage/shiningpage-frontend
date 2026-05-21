export const geo = (state = {}, action) => {
    switch (action.type) {
        case 'GEO':
            return action.geo
        default:
            return state;
    }
  }
