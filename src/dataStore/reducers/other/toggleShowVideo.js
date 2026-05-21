export const toggleShowVideo = (state = false, action) => {
    switch (action.type) {
        case 'toggleShowVideo':
            return action.toggleShowVideo
        default:
            return state;
    }
}
