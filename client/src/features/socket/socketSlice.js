import { createSlice } from "@reduxjs/toolkit";

  const initialState = {
      socket: null,
      onlineUsers: [],
      typingUsers: {},
  };

  export const socketSlice = createSlice({
  name: 'socket',
  initialState,

  reducers: {

      setSocket: (state, action) => {
          state.socket = action.payload; 
      },

      setOnlineUsers: (state, action) => {
          state.onlineUsers = action.payload
      },

      userTyping: (state, action) => {
         const {fromUserId} = action.payload;
         state.typingUsers[fromUserId] = true;
      },

      stopUserTyping: (state, action) => {
         const {fromUserId} = action.payload;
         delete state.typingUsers[fromUserId];  
      },

      clearSocketState: (state) => {
         state.socket = null;
         state.onlineUsers = [];
         state.typingUsers = {};
      }
  },
})

// Action creators are generated for each case reducer function
export const { setSocket, setOnlineUsers , userTyping, stopUserTyping, clearSocketState } = socketSlice.actions

export default socketSlice.reducer; 