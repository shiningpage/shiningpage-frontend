import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    toggleMembership: false,
    fullAccess: false,
};

const authSlice = createSlice({
    name: 'auth',

    initialState,

    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = action.payload;
        },

        setToggleMembership: (state, action) => {
            state.toggleMembership = action.payload;
        },

        setFullAccess: (state, action) => {
            state.fullAccess = action.payload;
        },
    },
});

export const {
    setAuth,
    setToggleMembership,
    setFullAccess,
} = authSlice.actions;

export default authSlice.reducer;