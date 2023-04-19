import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  loading: false,
  error: false,
};

const mother = createSlice({
  name: "mother",
  initialState,
  reducers: {
    fetchMotherRequest: (state) => {
      state.loading = true;
    },
    fetchMotherSuccess: (state) => {
      state.loading = false
      state.error = false
    },
    clearMotherDataSuccess: (state) => {
      
    },
    fetchMotherError: (state) => {
      state.error = true
      state.loading = false
    },
  },
});

export const {
  fetchMotherRequest,
  fetchMotherSuccess,
  fetchMotherError,
  clearMotherDataSuccess,
} = mother.actions;

export default mother.reducer;
