import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchCashDailyReports = createAsyncThunk(
  "DailyCashReports/fetchCashDailyReports",
  async ({ date }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/report_daily.php?date=${date}`,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
const CashDailyReportSlice = createSlice({
  name: "DailyCashReports",
  initialState: {
    isDailyCashReportsLoading: false,
    DailyCashReports: [],
    isDailyCashReportsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCashDailyReports.pending, (state) => {
      state.DailyCashReports = true;
    });
    builder.addCase(fetchCashDailyReports.fulfilled, (state, action) => {
      state.isDailyCashReportsLoading = false;
      state.DailyCashReports = action.payload;
      state.isDailyCashReportsError = null;
    });
    builder.addCase(fetchCashDailyReports.rejected, (state, action) => {
      state.isDailyCashReportsLoading = false;
      state.DailyCashReports = [];
      state.isDailyCashReportsError = action.error.message;
    });
  },
});

export default CashDailyReportSlice.reducer;
