import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCardProfitHistory = createAsyncThunk(
  "profitHistory/fetchCardProfitHistory",
  async ({ cardId, year, month, investorId }, { rejectWithValue }) => {
    try {
      const baseUrl = `${
        import.meta.env.VITE_LOCALHOST_KEY
      }/profit/get_profit_status.php`;

      const params = new URLSearchParams();
      if (cardId) {
        params.append("card_id", cardId); // cardId থাকলে শুধু তখনই পাঠাবে
      }
      if (investorId) {
        params.append("investor_id", investorId);
      }
      if (year) {
        params.append("year", year);
      }
      if (month) {
        params.append("month", month);
      }

      const url = `${baseUrl}?${params.toString()}`;
      const response = await axios.get(url);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const cardProfitHistorySlice = createSlice({
  name: "profitHistory",
  initialState: {
    isProfitHistoryLoading: false,
    profitHistory: [],
    isProfitHistoryError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCardProfitHistory.pending, (state) => {
      state.isProfitHistoryLoading = true;
      state.isProfitHistoryError = null;
    });
    builder.addCase(fetchCardProfitHistory.fulfilled, (state, action) => {
      state.isProfitHistoryLoading = false;
      // API থেকে যদি {success, data} আসে:
      const payload = action.payload;
      state.profitHistory = payload?.data || [];
      state.isProfitHistoryError = null;
    });
    builder.addCase(fetchCardProfitHistory.rejected, (state, action) => {
      state.isProfitHistoryLoading = false;
      state.profitHistory = [];
      state.isProfitHistoryError =
        action.payload?.message || action.error.message;
    });
  },
});

export default cardProfitHistorySlice.reducer;
