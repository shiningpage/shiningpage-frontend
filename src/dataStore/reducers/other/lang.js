export const lang = (state = 'en', action) => {
    switch (action.type) {
        case 'LANG':
            return action.lang
        default:
            return state;
    }
  }
