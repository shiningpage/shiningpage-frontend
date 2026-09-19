const STORE_VERSION = 'rtk-v1';

export const loadState = () => {
    try {
        const savedVersion = localStorage.getItem('shiningPageStoreVersion');

        if (savedVersion !== STORE_VERSION) {
            localStorage.removeItem('state');
            localStorage.setItem('shiningPageStoreVersion', STORE_VERSION);

            return undefined;
        }

        const serializedState = localStorage.getItem('state');

        if (serializedState === null) {
            return undefined;
        }

        return JSON.parse(serializedState);

    } catch (err) {
        localStorage.removeItem('state');
        return undefined;
    }
};

export const saveState = (state: unknown): void => {
    try {
        const serializedState = JSON.stringify(state);

        localStorage.setItem('state', serializedState);
    } catch (err) {
        // Ignore write errors.
    }
};