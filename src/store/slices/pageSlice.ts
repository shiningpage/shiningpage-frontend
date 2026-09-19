import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PageState = {
    name: string;
    title: string;
    is404: boolean;
    yOffset: number;
};

const initialState: PageState = {
    name: '',
    title: '',
    is404: false,
    yOffset: 0,
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setPageName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },

        setPageTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },

        setPage404: (state, action: PayloadAction<boolean>) => {
            state.is404 = action.payload;
        },

        setPageYOffset: (state, action: PayloadAction<number>) => {
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