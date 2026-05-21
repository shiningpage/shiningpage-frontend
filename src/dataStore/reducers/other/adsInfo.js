export const adsInfo = (state = {}, action) => {
    switch (action.type) {
        case 'adsInfo':
            return action.adsInfo
        default:
            return state;
    }
  }
