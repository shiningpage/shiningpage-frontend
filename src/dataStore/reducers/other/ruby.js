export const ruby = (state = '0.00', action) => {
    switch (action.type) {
        case 'ruby':
            return action.ruby
        default:
            return state;
    }
  }
