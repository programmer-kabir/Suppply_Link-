import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchCustomerGranters = createAsyncThunk(
  "CustomerGranters/fetchCustomerGranters",
  async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/users/get_customer_guarantors.php`,
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  },
);
const CustomerGranterSlice = createSlice({
  name: "CustomerGranter",
  initialState: {
    isCustomerGranterLoading: false,
    CustomerGranter: [],
    isCustomerGranterError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomerGranters.pending, (state) => {
      state.isCustomerGranterLoading = true;
    });
    builder.addCase(fetchCustomerGranters.fulfilled, (state, action) => {
      state.isCustomerGranterLoading = false;
      state.CustomerGranter = action.payload;
      state.isCustomerGranterError = null;
    });
    builder.addCase(fetchCustomerGranters.rejected, (state, action) => {
      state.isCustomerGranterLoading = false;
      state.CustomerGranter = [];
      state.isCustomerGranterError = action.error.message;
    });
  },
});

export default CustomerGranterSlice.reducer;
