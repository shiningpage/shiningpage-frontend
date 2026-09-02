const STORE_VERSION = 'rtk-v1';

export const loadState = () => {
    try {
        const savedVersion = localStorage.getItem('shiningPageStoreVersion');

        // پاک کردن state قدیمی بعد از مهاجرت به RTK
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

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);

        localStorage.setItem('state', serializedState);

    } catch (err) {
        // Ignore write errors.
    }
};