import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    amount: '0.00',
    block: false,
    interval: { ruby:0, done:0, dateTime:'' },
    pageTime: '',
};

const rubySlice = createSlice({
    name: 'ruby',
    initialState,
    reducers: {
        setRubyAmount: (state, action) => {
            state.amount = action.payload;
        },

        setRubyBlock: (state, action) => {
            state.block = action.payload;
        },

        setRubyInterval: (state, action) => {
            state.interval = action.payload;
        },

        setPageRubyTime: (state, action) => {
            state.pageTime = action.payload;
        },
    },
});

export const {
    setRubyAmount,
    setRubyBlock,
    setRubyInterval,
    setPageRubyTime,
} = rubySlice.actions;

export default rubySlice.reducer;