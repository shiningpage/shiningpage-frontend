export const toggleViewStatus = (state = {toggle:false, page:false}, action) => {
    switch (action.type) {
        case 'Toggle_View_Status':
            return action.toggleViewStatus
        default:
            return state;
    }
  }
