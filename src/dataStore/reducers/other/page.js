export const page = (state = '', action) => {
    switch (action.type) {
        case 'PAGE':
            return action.page
        default:
            return state;
    }
  }
