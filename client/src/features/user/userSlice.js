import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  allUsers: [],
  onlineUsers: [],   // merged online users here
  isAuthenticated: false,
  loading: false,
  error: null,
};                                                                   

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/user/",
        { withCredentials: true }
      );
      console.log("Fetched users:", data.users); // ✅ Add this                          
      return data.users;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);



export const userSlice = createSlice({              
  name: "user",
  initialState,
  
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },                                                                             

    setUser: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;                                                     
    },

    logoutUser: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    setAllUsers: (state, action) => {
      state.loading = false;
      state.allUsers = action.payload;
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔵 Online users stored here
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;  
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLoading,
  setUser,
  logoutUser,
  setAllUsers,
  setError,
  setOnlineUsers, 
} = userSlice.actions;

export default userSlice.reducer;
