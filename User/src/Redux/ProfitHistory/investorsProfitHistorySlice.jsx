import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchInvestProfitHistory = createAsyncThunk(
  "investProfit/fetchInvestProfitHistory",
  async () => {
    try {
      let url = `${
        import.meta.env.VITE_LOCALHOST_KEY
      }/profit/getAllProfitHistory.php`;
      const response = await axios.get(url);
      // console.log(response?.data?.data);
      return response.data?.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  }
);

const investorsProfitHistorySlice = createSlice({
  name: "investorProfitHistory",
  initialState: {
    isInvestProfitHistoryLoading: false,
    investorProfitHistory: [],
    isInvestProfitHistoryError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvestProfitHistory.pending, (state) => {
      state.isInvestProfitHistoryLoading = true;
    });
    builder.addCase(fetchInvestProfitHistory.fulfilled, (state, action) => {
      state.isInvestProfitHistoryLoading = false;
      state.investorProfitHistory = action.payload;
      state.isInvestProfitHistoryError = null;
    });
    builder.addCase(fetchInvestProfitHistory.rejected, (state, action) => {
      state.isInvestProfitHistoryLoading = false;
      state.investorProfitHistory = [];
      state.isInvestProfitHistoryError = action.error.message;
    });
  },
});

export default investorsProfitHistorySlice.reducer;
