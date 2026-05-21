export const toggleInsta = (state = {type:false, title:'', color:'', btn:''}, action) => {
    switch (action.type) {
        case 'toggleInsta':
            return action.toggleInsta
        default:
            return state;
    }
}
