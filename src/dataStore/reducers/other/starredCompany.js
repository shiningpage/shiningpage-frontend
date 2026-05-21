export const starredCompany = (state = [], action) => {
    switch (action.type) {
        case 'starredCompany':
            return action.starredCompany
        default:
            return state;
    }
  }
