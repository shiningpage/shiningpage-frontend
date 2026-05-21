export const categoryX = (state = {}, action) => {
    switch (action.type) {
        case 'categoryX':
            return action.categoryX
        default:
            return state;
    }
  }
