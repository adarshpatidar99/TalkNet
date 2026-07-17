import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   chats: [],
   loading: false
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },

    addChat: (state, action) => {

      if(!Array.isArray(state.chats)) { 
         state.chats = [];
      }

      state.chats.unshift(action.payload);
    },
  },
});

export const { setChats, addChat } = chatSlice.actions;
                
export default chatSlice.reducer;










