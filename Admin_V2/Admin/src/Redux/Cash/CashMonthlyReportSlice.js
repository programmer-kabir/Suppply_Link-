import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchCashMonthlyReports = createAsyncThunk(
  "CashMonthlyReports/fetchCashMonthlyReports",
  async ({ month }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/report_monthly.php?month=${month}`,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
const CashMonthlyReportSlice = createSlice({
  name: "CashMonthlyReports",
  initialState: {
    isCashMonthlyReportsLoading: true,
    CashMonthlyReports: [],
    isCashMonthlyReportsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCashMonthlyReports.pending, (state) => {
      state.CashMonthlyReports = true;
    });
    builder.addCase(fetchCashMonthlyReports.fulfilled, (state, action) => {
      state.isCashMonthlyReportsLoading = false;
      state.CashMonthlyReports = action.payload;
      state.isCashMonthlyReportsError = null;
    });
    builder.addCase(fetchCashMonthlyReports.rejected, (state, action) => {
      state.isCashMonthlyReportsLoading = false;
      state.CashMonthlyReports = [];
      state.isCashMonthlyReportsError = action.error.message;
    });
  },
});

export default CashMonthlyReportSlice.reducer;
