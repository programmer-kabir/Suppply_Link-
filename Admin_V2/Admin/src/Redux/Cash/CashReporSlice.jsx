import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchCashReports = createAsyncThunk(
  "CashReports/fetchCashReports",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCALHOST_KEY}/cash/get_cash_report.php`,
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  },
);
const CashReportSlice = createSlice({
  name: "CashReports",
  initialState: {
    isCashReportsLoading: false,
    CashReports: [],
    isCashReportsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCashReports.pending, (state) => {
      state.CashReports = true;
    });
    builder.addCase(fetchCashReports.fulfilled, (state, action) => {
      state.isCashReportsLoading = false;
      state.CashReports = action.payload;
      state.isCashReportsError = null;
    });
    builder.addCase(fetchCashReports.rejected, (state, action) => {
      state.isCashReportsLoading = false;
      state.CashReports = [];
      state.isCashReportsError = action.error.message;
    });
  },
});

export default CashReportSlice.reducer;
