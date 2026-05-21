export const address = (state = { content:[], fix:'' }, action) => {
    switch (action.type) {
        case 'address':
            return action.address
        default:
            return state;
    }
  }
