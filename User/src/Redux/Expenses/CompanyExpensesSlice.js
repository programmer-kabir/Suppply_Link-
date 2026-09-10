import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// investments/thunk.js
export const fetchCompanyExpenses = createAsyncThunk(
  "companyExpenses/fetchCompanyExpenses",
  async ({ start, end, months, year }, { rejectWithValue }) => {
    try {
      const base = `${
        import.meta.env.VITE_LOCALHOST_KEY
      }/expenses/getTotalExpenses.php`;
      const params = new URLSearchParams();

      // sanitize: trim and only append if both present
      if (start && end) {
        const s = String(start).trim();
        const e = String(end).trim();
        if (s && e) {
          params.append("start_date", s);
          params.append("end_date", e);
        }
      } else if (months) {
        params.append("months", String(months).trim());
      } else if (year) {
        params.append("year", String(year).trim());
      } else {
        // nothing to filter -> you may choose to return [] or let backend return all
        // return rejectWithValue("No filter provided");
      }

      const finalUrl = params.toString()
        ? `${base}?${params.toString()}`
        : base;

      const response = await axios.get(finalUrl);
      return response.data;
    } catch (error) {
      // console.error("FETCH ERROR:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const CompanyExpensesSlice = createSlice({
  name: "companyExpenses",
  initialState: {
    isCompanyExpensesLoading: false,
    companyExpenses: [],
    isExpensesError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCompanyExpenses.pending, (state) => {
      state.isCompanyExpensesLoading = true;
    });
    builder.addCase(fetchCompanyExpenses.fulfilled, (state, action) => {
      state.isCompanyExpensesLoading = false;
      state.companyExpenses = action.payload;
      state.isExpensesError = null;
    });
    builder.addCase(fetchCompanyExpenses.rejected, (state, action) => {
      state.isCompanyExpensesLoading = false;
      state.companyExpenses = [];
      state.isExpensesError = action.error.message;
    });
  },
});

export default CompanyExpensesSlice.reducer;
