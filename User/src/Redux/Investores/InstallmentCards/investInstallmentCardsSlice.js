import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchInstallmentsCards = createAsyncThunk(
  "investInstallmentCards/fetchInstallmentsCards",
  async (investor_id) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/investors/getInvestInstallmentsCards.php`
      );
      //   console.log(response.data.cards);
      return response.data.cards;
    } catch (error) {
      return error;
    }
  }
);
const investInstallmentCardsSlice = createSlice({
  name: "investInstallmentCards",
  initialState: {
    isInvestInstallmentsCardsLoading: false,
    investInstallmentCards: [],
    isInvestInstallmentsCardsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInstallmentsCards.pending, (state) => {
      state.isInvestInstallmentsCardsLoading = true;
    });
    builder.addCase(fetchInstallmentsCards.fulfilled, (state, action) => {
      state.isInvestInstallmentsCardsLoading = false;
      state.investInstallmentCards = action.payload;
      state.isInvestInstallmentsCardsError = null;
    });
    builder.addCase(fetchInstallmentsCards.rejected, (state, action) => {
      state.isInvestInstallmentsCardsLoading = false;
      state.investInstallmentCards = [];
      state.isInvestInstallmentsCardsError = action.error.message;
    });
  },
});

export default investInstallmentCardsSlice.reducer;
