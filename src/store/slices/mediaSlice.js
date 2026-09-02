import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    adsInfo: {},
    videoInfo: {},
    instaInfo: {},
    toggleAds: {type:false, title:'', color:'', btn:''},
    toggleInsta: {type:false, title:'', color:'', btn:''},
    toggleVideo: {type:false, title:'', color:'', btn:''},
    starredAds: [],
    toggleShowVideo: false,
};

const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        setAdsInfo: (state, action) => {
            state.adsInfo = action.payload;
        },

        setVideoInfo: (state, action) => {
            state.videoInfo = action.payload;
        },

        setInstaInfo: (state, action) => {
            state.instaInfo = action.payload;
        },

        setToggleAds: (state, action) => {
            state.toggleAds = action.payload;
        },

        setToggleInsta: (state, action) => {
            state.toggleInsta = action.payload;
        },

        setToggleVideo: (state, action) => {
            state.toggleVideo = action.payload;
        },

        setStarredAds: (state, action) => {
            state.starredAds = action.payload;
        },

        setToggleShowVideo: (state, action) => {
            state.toggleShowVideo = action.payload;
        },
    },
});

export const {
    setAdsInfo, setVideoInfo, setInstaInfo,
    setToggleAds, setToggleInsta, setToggleVideo, 
    setStarredAds, setToggleShowVideo, 

} = mediaSlice.actions;

export default mediaSlice.reducer;