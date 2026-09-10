import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchInvestProfit = createAsyncThunk(
  "investProfit/fetchInvestProfit",
  async ({ start, end, months, year }, { rejectWithValue }) => {
    try {
      let url = `${
        import.meta.env.VITE_LOCALHOST_KEY
      }/profit/getTotalProfit.php`;

      const params = new URLSearchParams();

      if (start && end) {
        params.append("start_date", start);
        params.append("end_date", end);
      } else if (months) {
        params.append("months", months);
      } else if (year) {
        params.append("year", year);
      }
      const finalUrl = `${url}?${params.toString()}`;
      const response = await axios.get(finalUrl);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const InvestmentsProfitSlice = createSlice({
  name: "investProfit",
  initialState: {
    isInvestProfitLoading: false,
    investProfit: [],
    isInvestProfitError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvestProfit.pending, (state) => {
      state.isInvestProfitLoading = true;
    });
    builder.addCase(fetchInvestProfit.fulfilled, (state, action) => {
      state.isInvestProfitLoading = false;
      state.investProfit = action.payload;
      state.isInvestProfitError = null;
    });
    builder.addCase(fetchInvestProfit.rejected, (state, action) => {
      state.isInvestProfitLoading = false;
      state.investProfit = [];
      state.isInvestProfitError = action.error.message;
    });
  },
});

export default InvestmentsProfitSlice.reducer;
