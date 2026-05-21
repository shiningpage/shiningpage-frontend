export const pageName = (state = '', action) => {
    switch (action.type) {
        case 'pageName':
            return action.pageName
        default:
            return state;
    }
  }
