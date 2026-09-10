import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchSupplierPayments = createAsyncThunk(
  "supplierPayments/fetchSupplierPayments",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCALHOST_KEY}/supplierPayments/getSupplierPayments.php`,
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  },
);
const SupplierPaymentAnalyticsSlice = createSlice({
  name: "supplierPayments",
  initialState: {
    isSupplierPaymentsLoading: false,
    supplierPayments: [],
    isSupplierPaymentsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSupplierPayments.pending, (state) => {
      state.isSupplierPaymentsLoading = true;
    });
    builder.addCase(fetchSupplierPayments.fulfilled, (state, action) => {
      state.isSupplierPaymentsLoading = false;
      state.supplierPayments = action.payload;
      state.isSupplierPaymentsError = null;
    });
    builder.addCase(fetchSupplierPayments.rejected, (state, action) => {
      state.isSupplierPaymentsLoading = false;
      state.supplierPayments = [];
      state.isSupplierPaymentsError = action.error.message;
    });
  },
});

export default SupplierPaymentAnalyticsSlice.reducer;
