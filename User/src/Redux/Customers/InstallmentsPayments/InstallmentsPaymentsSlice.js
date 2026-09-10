import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchInstallmentsPayments = createAsyncThunk(
  "customerInstallmentPayments/fetchInstallmentsPayments",
  async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/customers/get_installment_payments.php`
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  }
);
const customerInstallmentPaymentsSlice = createSlice({
  name: "customerInstallmentPayments",
  initialState: {
    isCustomerInstallmentsPaymentsLoading: false,
    customerInstallmentPayments: [],
    isCustomerInstallmentsPaymentsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInstallmentsPayments.pending, (state) => {
      state.isCustomerInstallmentsPaymentsLoading = true;
    });
    builder.addCase(fetchInstallmentsPayments.fulfilled, (state, action) => {
      state.isCustomerInstallmentsPaymentsLoading = false;
      state.customerInstallmentPayments = action.payload;
      state.isCustomerInstallmentsPaymentsError = null;
    });
    builder.addCase(fetchInstallmentsPayments.rejected, (state, action) => {
      state.isCustomerInstallmentsPaymentsLoading = false;
      state.customerInstallmentPayments = [];
      state.isCustomerInstallmentsPaymentsError = action.error.message;
    });
  },
});

export default customerInstallmentPaymentsSlice.reducer;
