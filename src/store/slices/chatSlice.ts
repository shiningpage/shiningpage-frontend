import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ChatState = {
    toggleChat: boolean;
    toggleChatList: boolean;
    subChatInfo: Record<string, unknown>;
    notSeenChatQTY: string;
    sendMessage: boolean;
};

const initialState: ChatState = {
    toggleChat: false,
    toggleChatList: false,
    subChatInfo: {},
    notSeenChatQTY: '0',
    sendMessage: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setToggleChat: (state, action: PayloadAction<boolean>) => {
            state.toggleChat = action.payload;
        },

        setToggleChatList: (state, action: PayloadAction<boolean>) => {
            state.toggleChatList = action.payload;
        },

        setSubChatInfo: (state, action: PayloadAction<Record<string, unknown>>) => {
            state.subChatInfo = action.payload;
        },

        setNotSeenChatQTY: (state, action: PayloadAction<string>) => {
            state.notSeenChatQTY = action.payload;
        },

        setSendMessage: (state, action: PayloadAction<boolean>) => {
            state.sendMessage = action.payload;
        },
    },
});

export const {
    setToggleChat,
    setToggleChatList,
    setSubChatInfo,
    setNotSeenChatQTY,
    setSendMessage,
} = chatSlice.actions;

export default chatSlice.reducer;