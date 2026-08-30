export const toggleMembership = (state = false, action) => {
    switch (action.type) {
        case 'Toggle_Membership':
            return action.toggleMembership
        default:
            return state;
    }
  }
