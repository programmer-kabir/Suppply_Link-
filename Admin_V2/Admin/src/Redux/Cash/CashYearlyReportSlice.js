import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchCashYearlyReports = createAsyncThunk(
  "CashYearlyReports/fetchCashYearlyReports",
  async ({ type, year }) => {
    let url = "";
    if (type === "all") {
      url = `${import.meta.env.VITE_LOCALHOST_KEY}/cash/all_time_summary.php`;
    } else {
      url = `${import.meta.env.VITE_LOCALHOST_KEY}/cash/report_yearly.php?year=${year}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    return data.data || data;
  },
);
const CashYearlyReportSlice = createSlice({
  name: "CashYearlyReports",
  initialState: {
    isCashYearlyReportsLoading: true,
    CashYearlyReports: {},
    isCashYearlyReportsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCashYearlyReports.pending, (state) => {
      state.CashYearlyReports = true;
    });
    builder.addCase(fetchCashYearlyReports.fulfilled, (state, action) => {
      state.isCashYearlyReportsLoading = false;
      state.CashYearlyReports = action.payload;
      state.isCashYearlyReportsError = null;
    });
    builder.addCase(fetchCashYearlyReports.rejected, (state, action) => {
      state.isCashYearlyReportsLoading = false;
      state.CashYearlyReports = [];
      state.isCashYearlyReportsError = action.error.message;
    });
  },
});

export default CashYearlyReportSlice.reducer;
