export const starredVideo = (state = [], action) => {
    switch (action.type) {
        case 'starredVideo':
            return action.starredVideo
        default:
            return state;
    }
  }
