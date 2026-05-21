export const rtl = (state = false, action) => {
    switch (action.type) {
        case 'RTL':
            return action.rtl
        default:
            return state;
    }
  }
