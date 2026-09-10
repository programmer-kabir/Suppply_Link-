import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchInstallmentFiles = createAsyncThunk(
  "installmentFiles/fetchInstallmentFiles",
  async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCALHOST_KEY
        }/installmentFiles/get_installment_file_records.php`
      );
      return response.data.data;
    } catch (error) {
      return error;
    }
  }
);
const InstallmentFileSlice = createSlice({
  name: "installmentFiles",
  initialState: {
    isLoading: false,
    installmentFiles: [],
    isError: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInstallmentFiles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchInstallmentFiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.installmentFiles = action.payload;
      state.isError = null;
    });
    builder.addCase(fetchInstallmentFiles.rejected, (state, action) => {
      state.isLoading = false;
      state.installmentFiles = [];
      state.isError = action.error.message;
    });
  },
});

export default InstallmentFileSlice.reducer;
