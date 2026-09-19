import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    isAuthenticated: boolean;
    toggleMembership: boolean;
    fullAccess: boolean;
};

const initialState: AuthState = {
    isAuthenticated: false,
    toggleMembership: false,
    fullAccess: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },

        setToggleMembership: (state, action: PayloadAction<boolean>) => {
            state.toggleMembership = action.payload;
        },

        setFullAccess: (state, action: PayloadAction<boolean>) => {
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