import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AttachmentItem = {
    id: number;
    fileName: string;
    extname: string;
    fileSize: number;
};

type UserLimits = {
    attachment: number;
    category: number;
    ads: number;
    video: number;
    instagram: number;
};

type UserInfo = {
    active: boolean;
    ads: boolean;
    access: unknown[];
    team: unknown[];
    star: number;
    category: unknown[];
    application: unknown[];
    expoPushTokens: string[];
    attachmentItems: AttachmentItem[];
    limits: UserLimits;
    ruby: boolean;

    _id: string;
    userType: number;
    username: string;
    genderValue: number;
    businessType: number;

    continent: string;
    country: string;
    countryCode: string;

    fc: number;

    createdAt: string;
    updatedAt: string;
    __v: number;

    bizName: string;
    profileIndex: string;
    aboutIndex: string;
    biography: string;
    jobSummary: string;

    celphone: string | null;
    city: string;
    email: string;
    instagram: string;
    linkedin: string;
    website: string;
    whatsapp: string;
    phone: string | null;
    telegram: string;

    attachmentsTotalSize: number;
    categoryItems: unknown[];
};

type UserState = {
    userInfo: UserInfo;
    subUserInfo: UserInfo;
};

const initialState: UserState = {
    userInfo: {} as UserInfo,
    subUserInfo: {} as UserInfo,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
        },

        setSubUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.subUserInfo = action.payload;
        },
    },
});

export const {
    setUserInfo,
    setSubUserInfo,
} = userSlice.actions;

export default userSlice.reducer;