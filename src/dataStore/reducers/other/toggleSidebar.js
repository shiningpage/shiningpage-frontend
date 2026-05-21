export const toggleSidebar = (state = false, action) => {
    switch (action.type) {
        case 'toggleSidebar':
            return action.toggleSidebar
        default:
            return state;
    }
}
