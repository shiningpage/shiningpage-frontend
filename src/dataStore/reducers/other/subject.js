export const subject = (state = '', action) => {
    switch (action.type) {
        case 'subject':
            return action.subject
        default:
            return state;
    }
  }
