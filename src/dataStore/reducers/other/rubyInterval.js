export const rubyInterval = (state = { ruby:0, done:0, dateTime:'' }, action) => {
    switch (action.type) {
        case 'Ruby_Interval':
            return action.rubyInterval
        default:
            return state;
    }
  }
