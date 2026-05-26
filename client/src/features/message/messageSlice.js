import { createSlice } from "@reduxjs/toolkit";

  const initialState = {
     messages: [],
     loading: false,
     error: null,
  };

  export const messageSlice = createSlice({
  name: 'message',
  initialState,

  reducers: {

      setMessage: (state, action) => {
           state.loading = false;
           state.messages = action.payload;
           state.error = null;
      },
    
      setLoading: (state) => {
          state.loading = true;
      }, 

      addMessage: (state, action) => {
          state.messages.push(action.payload);
      },

      setError: (state, action) => {
          state.loading = false;
          state.error = action.payload;
      },

      clearMessages: (state) => {
          state.loading = false;
          state.messages = [];
          state.error = null;
      }
  },
})

// Action creators are generated for each case reducer function
export const { setMessage, setLoading, addMessage, setError, clearMessages } = messageSlice.actions

export default messageSlice.reducer; 