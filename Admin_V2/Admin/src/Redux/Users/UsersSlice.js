import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCALHOST_KEY}/users/users.php`
      );
      return Array.isArray(response?.data?.data) ? response.data.data : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch users"
      );
    }
  }
);
const UsersSlice = createSlice({
  name: "users",
  initialState: {
    isUsersLoading: false,
    users: [],
    isUsersError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.isUsersLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isUsersLoading = false;
      state.users = Array.isArray(action.payload) ? action.payload : [];
      state.isUsersError = null;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isUsersLoading = false;
      state.users = [];
      state.isUsersError = action.payload || action.error.message;
    });
  },
});

export default UsersSlice.reducer;
