import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchStockMobiles = createAsyncThunk(
  "stockMobiles/fetchStockMobiles",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCALHOST_KEY}/Inventory/getMobileStocks.php`,
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  },
);
const MobileAnalyticsSlice = createSlice({
  name: "stockMobiles",
  initialState: {
    isStockMobilesLoading: false,
    stockMobiles: [],
    isStockMobilesError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStockMobiles.pending, (state) => {
      state.isStockMobilesLoading = true;
    });
    builder.addCase(fetchStockMobiles.fulfilled, (state, action) => {
      state.isStockMobilesLoading = false;
      state.stockMobiles = action.payload;
      state.isStockMobilesError = null;
    });
    builder.addCase(fetchStockMobiles.rejected, (state, action) => {
      state.isStockMobilesLoading = false;
      state.stockMobiles = [];
      state.isStockMobilesError = action.error.message;
    });
  },
});

export default MobileAnalyticsSlice.reducer;
