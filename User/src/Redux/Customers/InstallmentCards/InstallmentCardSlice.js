import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchInstallmentCards = createAsyncThunk(
  "customerInstallmentCards/fetchInstallmentCards",
  async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/customers/get_installment_cards.php`
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  }
);
const customerInstallmentCardsSlice = createSlice({
  name: "customerInstallmentCards",
  initialState: {
    isCustomerInstallmentsCardsLoading: false,
    customerInstallmentCards: [],
    isCustomerInstallmentsCardsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInstallmentCards.pending, (state) => {
      state.isCustomerInstallmentsCardsLoading = true;
    });
    builder.addCase(fetchInstallmentCards.fulfilled, (state, action) => {
      state.isCustomerInstallmentsCardsLoading = false;
      state.customerInstallmentCards = action.payload;
      state.isCustomerInstallmentsCardsError = null;
    });
    builder.addCase(fetchInstallmentCards.rejected, (state, action) => {
      state.isCustomerInstallmentsCardsLoading = false;
      state.customerInstallmentCards = [];
      state.isCustomerInstallmentsCardsError = action.error.message;
    });
  },
});

export default customerInstallmentCardsSlice.reducer;
