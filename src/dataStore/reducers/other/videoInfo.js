export const videoInfo = (state = {}, action) => {
    switch (action.type) {
        case 'videoInfo':
            return action.videoInfo
        default:
            return state;
    }
  }
