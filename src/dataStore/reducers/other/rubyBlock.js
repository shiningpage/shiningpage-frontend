export const rubyBlock = (state = false, action) => {
    switch (action.type) {
        case 'Ruby_Block':
            return action.rubyBlock
        default:
            return state;
    }
  }
