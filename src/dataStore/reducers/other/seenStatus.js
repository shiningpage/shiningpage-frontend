export const seenStatus = (state = [], action) => {
    switch (action.type) {
        case 'Seen_Status':
            return action.seenStatus
        default:
            return state;
    }
  }
