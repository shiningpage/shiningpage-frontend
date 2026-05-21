export const balance = (state = '0.00', action) => {
    switch (action.type) {
        case 'balance':
            return action.balance
        default:
            return state;
    }
  }
