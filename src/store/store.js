import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import pageReducer from './slices/pageSlice';
import chatReducer from './slices/chatSlice';
import mediaReducer from './slices/mediaSlice';
import rubyReducer from './slices/rubySlice';
import appReducer from './slices/appSlice';

import { loadState, saveState } from '../localStorage';

const persistedState = loadState();

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        page: pageReducer,
        chat: chatReducer,
        media: mediaReducer,
        ruby: rubyReducer,
        app: appReducer,
    },

    preloadedState: persistedState,
});

store.subscribe(() => {
    saveState(store.getState());
});

export default store;