export const toggleVideo = (state = {type:false, title:'', color:'', btn:''}, action) => {
    switch (action.type) {
        case 'toggleVideo':
            return action.toggleVideo
        default:
            return state;
    }
}
