import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchInvestInstallments = createAsyncThunk(
  "investInstallments/fetchInvestInstallments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/investors/getAllInstallments.php`
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const InvestInstallments = createSlice({
  name: "investInstallments",
  initialState: {
    inInvestInstallmentsLoading: false,
    investInstallments: [],
    isInvestInstallmentsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvestInstallments.pending, (state) => {
      state.inInvestInstallmentsLoading = true;
    });
    builder.addCase(fetchInvestInstallments.fulfilled, (state, action) => {
      state.inInvestInstallmentsLoading = false;
      state.investInstallments = Array.isArray(action.payload) ? action.payload : [];
      state.isInvestInstallmentsError = null;
    });
    builder.addCase(fetchInvestInstallments.rejected, (state, action) => {
      state.inInvestInstallmentsLoading = false;
      state.investInstallments = [];
      state.isInvestInstallmentsError = action.payload || action.error.message;
    });
  },
});

export default InvestInstallments.reducer;
