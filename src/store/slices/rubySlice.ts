import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RubyInterval = {
    ruby: number;
    done: number;
    dateTime: string;
};

type RubyState = {
    amount: string;
    block: boolean;
    interval: RubyInterval;
    pageTime: string;
};

const initialState: RubyState = {
    amount: '0.00',
    block: false,
    interval: {
        ruby: 0,
        done: 0,
        dateTime: '',
    },
    pageTime: '',
};

const rubySlice = createSlice({
    name: 'ruby',
    initialState,
    reducers: {
        setRubyAmount: (state, action: PayloadAction<string>) => {
            state.amount = action.payload;
        },

        setRubyBlock: (state, action: PayloadAction<boolean>) => {
            state.block = action.payload;
        },

        setRubyInterval: (state, action: PayloadAction<RubyInterval>) => {
            state.interval = action.payload;
        },

        setPageRubyTime: (state, action: PayloadAction<string>) => {
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