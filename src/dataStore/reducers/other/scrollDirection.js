export const scrollDirection = (state = '', action) => {
    switch (action.type) {
        case 'Scroll_Direction':
            return action.scrollDirection
        default:
            return state;
    }
  }
