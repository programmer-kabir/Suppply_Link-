import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// export const fetchProfitAnalytics = createAsyncThunk(
//   "profitAnalytics/fetchProfitAnalytics",
//   async () => {
//     try {
//       const response = await axios.get(
//         `${
//           import.meta.env.VITE_LOCALHOST_KEY
//         }/profit_generator/get_profrit_generator.php`
//       );
//     //   console.log(response.data.data);
//       return response.data.data;
//     } catch (error) {
//       return error;
//     }
//   }
// );

export const fetchProfitAnalytics = createAsyncThunk(
  "profitAnalytics/fetchProfitAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const baseURL = `${
        import.meta.env.VITE_LOCALHOST_KEY
      }/profit_generator/get_profrit_generator.php`;

      const limit = 200; // ✅ backend safe limit
      let page = 1;

      let all = [];
      let total = Infinity;

      // safety guard (যদি ভুলে infinite loop হয়)
      const MAX_PAGES = 2000;

      while (page <= MAX_PAGES && all.length < total) {
        const res = await axios.get(baseURL, { params: { page, limit } });

        const payload = res.data || {};
        if (!payload.success) {
          return rejectWithValue(payload?.message || "Failed to load data");
        }

        const chunk = Array.isArray(payload.data) ? payload.data : [];
        total = Number(payload.total || 0);

        all = all.concat(chunk);

        if (chunk.length === 0) break; // no more rows
        page += 1;
      }

      return all;
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);
const ProfitAnalyticsSlice = createSlice({
  name: "profitAnalytics",
  initialState: {
    isProfitAnalyticsLoading: false,
    profitAnalytics: [],
    isUProfitAnalyticsError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfitAnalytics.pending, (state) => {
      state.isProfitAnalyticsLoading = true;
    });
    builder.addCase(fetchProfitAnalytics.fulfilled, (state, action) => {
      state.isProfitAnalyticsLoading = false;
      state.profitAnalytics = action.payload;
      state.isUProfitAnalyticsError = null;
    });
    builder.addCase(fetchProfitAnalytics.rejected, (state, action) => {
      state.isProfitAnalyticsLoading = false;
      state.profitAnalytics = [];
      state.isUProfitAnalyticsError = action.error.message;
    });
  },
});

export default ProfitAnalyticsSlice.reducer;
