import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllPaymentMethod = createAsyncThunk(
  "paymentMethods/fetchAllPaymentMethod",
  async (user_id, { rejectWithValue }) => {
    try {
      const baseUrl = `${
        import.meta.env.VITE_LOCALHOST_KEY
      }/paymentMethod/get_payment_method.php`;

      const params = new URLSearchParams();

      if (user_id) {
        params.append("user_id", user_id);
      }

      const finalUrl = `${baseUrl}?${params.toString()}`;

      const response = await axios.get(finalUrl);

      return response.data.data; // ✅ { success, data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch payment method"
      );
    }
  }
);

const paymentMethodSlice = createSlice({
  name: "paymentMethods",
  initialState: {
    isPaymentMethodsLoading: false,
    paymentMethods: [],
    isPaymentMethodsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllPaymentMethod.pending, (state) => {
      state.isPaymentMethodsLoading = true;
    });
    builder.addCase(fetchAllPaymentMethod.fulfilled, (state, action) => {
      state.isPaymentMethodsLoading = false;
      state.paymentMethods = action.payload;
      state.isPaymentMethodsError = null;
    });
    builder.addCase(fetchAllPaymentMethod.rejected, (state, action) => {
      state.isPaymentMethodsLoading = false;
      state.paymentMethods = [];
      state.isPaymentMethodsError = action.error.message;
    });
  },
});

export default paymentMethodSlice.reducer;
