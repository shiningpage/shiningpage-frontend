export const pageYOffset = (state = 0, action) => {
    switch (action.type) {
        case 'pageYOffset':
            return action.pageYOffset
        default:
            return state;
    }
  }
