import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: [],
    subUserInfo: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },

        setSubUserInfo: (state, action) => {
            state.subUserInfo = action.payload;
        },
    },
});

export const {
    setUserInfo,
    setSubUserInfo,
} = userSlice.actions;

export default userSlice.reducer;