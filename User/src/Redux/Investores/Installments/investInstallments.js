import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchInvestInstallments = createAsyncThunk(
  "investInstallments/fetchInvestInstallments",
  async (card_no) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/investors/getAllInstallments.php?investment_card_no=${card_no}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
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
      state.investInstallments = action.payload;
      state.isInvestInstallmentsError = null;
    });
    builder.addCase(fetchInvestInstallments.rejected, (state, action) => {
      state.inInvestInstallmentsLoading = false;
      state.investInstallments = [];
      state.isInvestInstallmentsError = action.error.message;
    });
  },
});

export default InvestInstallments.reducer;
