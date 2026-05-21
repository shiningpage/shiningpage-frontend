export const toggleLoading = (state = false, action) => {
    switch (action.type) {
        case 'toggleLoading':
            return action.toggleLoading
        default:
            return state;
    }
  }
