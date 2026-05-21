export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return 'undifined';
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return 'undifined';
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        //Ignore write Errors.
    }
};