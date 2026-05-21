export const updateVersionDate = (state = 0, action) => {
    switch (action.type) {
        case 'updateVersionDate':
            return action.updateVersionDate
        default:
            return state;
    }
}
