export const toggleAds = (state = {type:false, title:'', color:'', btn:''}, action) => {
    switch (action.type) {
        case 'toggleAds':
            return action.toggleAds
        default:
            return state;
    }
}
