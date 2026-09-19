import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StarredCompany = Record<string, unknown>;

type AppObject = {
    id: string;
    active: boolean;
};

type Geo = {
    countryCode: string;
    country: string;
    city: string;
    region: string;
};

type Address = {
    content: unknown[];
    fix: string;
};

type ToggleViewStatus = {
    toggle: boolean;
    page: boolean;
};

type AppState = {
    starredCompany: StarredCompany[];
    toggleLoading: boolean;
    updateVersionDate: number;
    balance: string;
    objects: AppObject[];
    toggleSidebar: boolean;
    setLT: Record<string, string>;
    subject: string;
    geo: Geo;
    lang: string;
    rtl: boolean;
    seenStatus: unknown[];
    address: Address;
    toggleViewStatus: ToggleViewStatus;
    country: Record<string, unknown>;
    scrollDirection: string;
    categoryX: Record<string, unknown>;
    userServiceSelected: unknown[];
};

const initialState: AppState = {
    starredCompany: [],
    toggleLoading: false,
    updateVersionDate: 0,
    balance: '0.00',
    objects: [],
    toggleSidebar: false,
    setLT: {},
    subject: '',
    geo: {
        countryCode: '',
        country: '',
        city: '',
        region: '',
    },
    lang: 'en',
    rtl: false,
    seenStatus: [],
    address: {
        content: [],
        fix: '',
    },
    toggleViewStatus: {
        toggle: false,
        page: false,
    },
    country: {},
    scrollDirection: '',
    categoryX: {},
    userServiceSelected: [],
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStarredCompany: (state, action: PayloadAction<StarredCompany[]>) => {
            state.starredCompany = action.payload;
        },

        setToggleLoading: (state, action: PayloadAction<boolean>) => {
            state.toggleLoading = action.payload;
        },

        setUpdateVersionDate: (state, action: PayloadAction<number>) => {
            state.updateVersionDate = action.payload;
        },

        setBalance: (state, action: PayloadAction<string>) => {
            state.balance = action.payload;
        },

        setObjects: (state, action: PayloadAction<AppObject[]>) => {
            state.objects = action.payload;
        },

        setToggleSidebar: (state, action: PayloadAction<boolean>) => {
            state.toggleSidebar = action.payload;
        },

        setSetLT: (state, action: PayloadAction<Record<string, string>>) => {
            state.setLT = action.payload;
        },

        setSubject: (state, action: PayloadAction<string>) => {
            state.subject = action.payload;
        },

        setGeo: (state, action: PayloadAction<Geo>) => {
            state.geo = action.payload;
        },

        setLang: (state, action: PayloadAction<string>) => {
            state.lang = action.payload;
        },

        setRtl: (state, action: PayloadAction<boolean>) => {
            state.rtl = action.payload;
        },

        setSeenStatus: (state, action: PayloadAction<unknown[]>) => {
            state.seenStatus = action.payload;
        },

        setAddress: (state, action: PayloadAction<Address>) => {
            state.address = action.payload;
        },

        setToggleViewStatus: (state, action: PayloadAction<ToggleViewStatus>) => {
            state.toggleViewStatus = action.payload;
        },

        setCountry: (state, action: PayloadAction<Record<string, unknown>>) => {
            state.country = action.payload;
        },

        setScrollDirection: (state, action: PayloadAction<string>) => {
            state.scrollDirection = action.payload;
        },

        setCategoryX: (state, action: PayloadAction<Record<string, unknown>>) => {
            state.categoryX = action.payload;
        },

        setUserServiceSelected: (state, action: PayloadAction<unknown[]>) => {
            state.userServiceSelected = action.payload;
        },
    },
});

export const {
    setStarredCompany,
    setToggleLoading,
    setUpdateVersionDate,
    setBalance,
    setObjects,
    setToggleSidebar,
    setSetLT,
    setSubject,
    setGeo,
    setLang,
    setRtl,
    setSeenStatus,
    setAddress,
    setToggleViewStatus,
    setCountry,
    setScrollDirection,
    setCategoryX,
    setUserServiceSelected,
} = appSlice.actions;

export default appSlice.reducer;