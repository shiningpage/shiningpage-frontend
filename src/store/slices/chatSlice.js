import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    toggleChat: false,
    toggleChatList: false,
    subChatInfo: [],
    notSeenChatQTY: '0',
    sendMessage: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setToggleChat: (state, action) => {
            state.toggleChat = action.payload;
        },

        setToggleChatList: (state, action) => {
            state.toggleChatList = action.payload;
        },

        setSubChatInfo: (state, action) => {
            state.subChatInfo = action.payload;
        },

        setNotSeenChatQTY: (state, action) => {
            state.notSeenChatQTY = action.payload;
        },

        setSendMessage: (state, action) => {
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