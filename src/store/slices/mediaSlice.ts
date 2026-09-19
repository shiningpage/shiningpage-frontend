import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Ads = {
    userId: string;
    adsTitle?: string;
    slug?: string;
    adsComment?: string;
    adsLink: string | null;

    consumerGenderValue: number;
    consumerAgeValue: number;

    pictures: string[];
    pictureType: number;
    status: number;

    adsDate?: string;

    adsColor: unknown[];
    adsColorQty: number;
    adsGroup?: string;

    star: number;

    negotiablePrice: boolean;
    unitPrice: number | null;

    currency: string;
    unitMeasurement: string;

    category: unknown[];

    starDate?: string;

    userCategoryId: string;
    userSubCategoryId: string;

    adsType: number;

    adminComment?: string;

    checkZ?: Record<string, unknown>;

    _id: string;

    createdAt?: string;
    updatedAt?: string;

    __v?: number;
};

type Video = {
    userId: string;
    title?: string;
    comment?: string;
    link: string | null;

    vType?: string;
    vCode?: string;

    star: number;
    category: unknown[];

    userCategoryId: string;
    userSubCategoryId: string;

    starDate?: string;
    adminComment?: string;

    status: number;

    checkZ?: Record<string, unknown>;

    _id: string;

    createdAt?: string;
    updatedAt?: string;

    __v?: number;
};

type Instagram = {
    userId: string;
    title?: string;
    comment?: string;

    star: number;
    starDate?: string;
    adminComment?: string;
    status: number;

    code?: string;

    userCategoryId: string;
    userSubCategoryId: string;

    _id: string;

    createdAt?: string;
    updatedAt?: string;

    __v?: number;
};

type MediaToggle = {
    type: boolean;
    title: string;
    color: string;
    btn: string;
};

type MediaState = {
    adsInfo: Ads;
    videoInfo: Video;
    instaInfo: Instagram;

    toggleAds: MediaToggle;
    toggleInsta: MediaToggle;
    toggleVideo: MediaToggle;

    starredAds: Ads[];

    toggleShowVideo: boolean;
};

const initialState: MediaState = {
    adsInfo: {} as Ads,
    videoInfo: {} as Video,
    instaInfo: {} as Instagram,

    toggleAds: {
        type: false,
        title: '',
        color: '',
        btn: '',
    },

    toggleInsta: {
        type: false,
        title: '',
        color: '',
        btn: '',
    },

    toggleVideo: {
        type: false,
        title: '',
        color: '',
        btn: '',
    },

    starredAds: [],

    toggleShowVideo: false,
};

const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        setAdsInfo: (state, action: PayloadAction<Ads>) => {
            state.adsInfo = action.payload;
        },

        setVideoInfo: (state, action: PayloadAction<Video>) => {
            state.videoInfo = action.payload;
        },

        setInstaInfo: (state, action: PayloadAction<Instagram>) => {
            state.instaInfo = action.payload;
        },

        setToggleAds: (state, action: PayloadAction<MediaToggle>) => {
            state.toggleAds = action.payload;
        },

        setToggleInsta: (state, action: PayloadAction<MediaToggle>) => {
            state.toggleInsta = action.payload;
        },

        setToggleVideo: (state, action: PayloadAction<MediaToggle>) => {
            state.toggleVideo = action.payload;
        },

        setStarredAds: (state, action: PayloadAction<Ads[]>) => {
            state.starredAds = action.payload;
        },

        setToggleShowVideo: (state, action: PayloadAction<boolean>) => {
            state.toggleShowVideo = action.payload;
        },
    },
});

export const {
    setAdsInfo,
    setVideoInfo,
    setInstaInfo,
    setToggleAds,
    setToggleInsta,
    setToggleVideo,
    setStarredAds,
    setToggleShowVideo,
} = mediaSlice.actions;

export default mediaSlice.reducer;