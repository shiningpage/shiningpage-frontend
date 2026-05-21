
export const objects = (state = [], action) => {
    switch (action.type) {
        case 'OBJECTS':
            return action.objects
        default:
            return state;
    }
  }
