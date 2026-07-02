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

        console.log("Entire state:", state);
  console.log("state.chats:", state.chats);
  console.log("Adding chat:", action.payload);
      state.chats.unshift(action.payload);
    },
  },
});

export const { setChats, addChat } = chatSlice.actions;
                
// ✅ FIX HERE
export default chatSlice.reducer;