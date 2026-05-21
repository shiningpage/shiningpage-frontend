export const adsClick = (state = {click:0, dateTime:''}, action) => {
    switch (action.type) {
        case 'Ads_Click':
            return action.adsClick
        default:
            return state;
    }
  }
