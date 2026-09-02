import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    starredCompany: [],
    toggleLoading: false,
    updateVersionDate: 0,
    balance: '0.00',
    objects: [],
    toggleSidebar: false,
    setLT: {},
    subject: '',
    geo: {},
    lang: 'en',
    rtl: false,
    seenStatus: [],
    address: { content:[], fix:'' },
    toggleViewStatus: {toggle:false, page:false},
    country: {},
    scrollDirection: '',
    categoryX: {},
    userServiceSelected: [],
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStarredCompany: (state, action) => {
            state.starredCompany = action.payload;
        },

        setToggleLoading: (state, action) => {
            state.toggleLoading = action.payload;
        },

        setUpdateVersionDate: (state, action) => {
            state.updateVersionDate = action.payload;
        },

        setBalance: (state, action) => {
            state.balance = action.payload;
        },

        setObjects: (state, action) => {
            state.objects = action.payload;
        },

        setToggleSidebar: (state, action) => {
            state.toggleSidebar = action.payload;
        },

        setSetLT: (state, action) => {
            state.setLT = action.payload;
        },

        setSubject: (state, action) => {
            state.subject = action.payload;
        },

        setGeo: (state, action) => {
            state.geo = action.payload;
        },

        setLang: (state, action) => {
            state.lang = action.payload;
        },

        setRtl: (state, action) => {
            state.rtl = action.payload;
        },

        setSeenStatus: (state, action) => {
            state.seenStatus = action.payload;
        },

        setAddress: (state, action) => {
            state.address = action.payload;
        },

        setToggleViewStatus: (state, action) => {
            state.toggleViewStatus = action.payload;
        },

        setCountry: (state, action) => {
            state.country = action.payload;
        },

        setScrollDirection: (state, action) => {
            state.scrollDirection = action.payload;
        },

        setCategoryX: (state, action) => {
            state.categoryX = action.payload;
        },

        setUserServiceSelected: (state, action) => {
            state.userServiceSelected = action.payload;
        },
    },
});

export const {
    setStarredCompany, setToggleLoading, setUpdateVersionDate, setBalance, setObjects, setToggleSidebar,
    setSetLT, setSubject, setGeo, setLang, setRtl, setSeenStatus, setAddress, setToggleViewStatus, 
    setCountry, setScrollDirection, setCategoryX, setUserServiceSelected
} = appSlice.actions;

export default appSlice.reducer;