export const pageRubyTime = (state = '', action) => {
    switch (action.type) {
        case 'Page_Ruby_Time':
            return action.pageRubyTime
        default:
            return state;
    }
}
