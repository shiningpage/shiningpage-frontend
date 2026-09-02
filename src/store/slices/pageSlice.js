import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    title: '',
    is404: false,
    yOffset: 0,
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setPageName: (state, action) => {
            state.name = action.payload;
        },

        setPageTitle: (state, action) => {
            state.title = action.payload;
        },

        setPage404: (state, action) => {
            state.is404 = action.payload;
        },

        setPageYOffset: (state, action) => {
            state.yOffset = action.payload;
        },
    },
});

export const {
    setPageName,
    setPageTitle,
    setPage404,
    setPageYOffset,
} = pageSlice.actions;

export default pageSlice.reducer;