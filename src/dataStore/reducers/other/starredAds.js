export const starredAds = (state = [], action) => {
    switch (action.type) {
        case 'starredAds':
            return action.starredAds
        default:
            return state;
    }
  }
