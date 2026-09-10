import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchAllInvestInstallments = createAsyncThunk(
  "allInvestInstallments/fetchAllInvestInstallments",
  async () => {
    try {
        const baseUrl = `${
        import.meta.env.VITE_LOCALHOST_KEY
      }/investors/getAllInstallments.php`;
      const response = await axios.get(baseUrl);
      return response.data.data;
    } catch (error) {
      return error;
    }
  }
);
const allInvestInstallmentsSlice = createSlice({
  name: "allInvestInstallments",
  initialState: {
    isAllInvestInstallmentsLoading: false,
    allInvestInstallments: [],
    isAllInvestInstallmentsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllInvestInstallments.pending, (state) => {
      state.isAllInvestInstallmentsLoading = true;
    });
    builder.addCase(fetchAllInvestInstallments.fulfilled, (state, action) => {
      state.isAllInvestInstallmentsLoading = false;
      state.allInvestInstallments = action.payload;
      state.isAllInvestInstallmentsError = null;
    });
    builder.addCase(fetchAllInvestInstallments.rejected, (state, action) => {
      state.isAllInvestInstallmentsLoading = false;
      state.allInvestInstallments = [];
      state.isAllInvestInstallmentsError = action.error.message;
    });
  },
});

export default allInvestInstallmentsSlice.reducer;
