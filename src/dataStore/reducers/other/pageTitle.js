export const pageTitle = (state = 'ShiningPage', action) => {
    switch (action.type) {
        case 'PAGE_TITLE':
            return action.pageTitle
        default:
            return state;
    }
  }
