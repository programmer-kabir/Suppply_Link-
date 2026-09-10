import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchInvestmentCards = createAsyncThunk(
  "investmentCards/fetchInvestmentCards",
  async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/investors/getInvestInstallmentsCards.php`
      );
      return response.data.cards;
    } catch (error) {
      return error;
    }
  }
);
const investmentCardsSlice = createSlice({
  name: "investmentCards",
  initialState: {
    isInvestmentCardsLoading: false,
    investmentCards: [],
    isInvestmentCardsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvestmentCards.pending, (state) => {
      state.isInvestmentCardsLoading = true;
    });
    builder.addCase(fetchInvestmentCards.fulfilled, (state, action) => {
      state.isInvestmentCardsLoading = false;
      state.investmentCards = action.payload;
      state.isInvestmentCardsError = null;
    });
    builder.addCase(fetchInvestmentCards.rejected, (state, action) => {
      state.isInvestmentCardsLoading = false;
      state.investmentCards = [];
      state.isInvestmentCardsError = action.error.message;
    });
  },
});

export default investmentCardsSlice.reducer;
