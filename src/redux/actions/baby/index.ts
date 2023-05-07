import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BabyState, Progress } from "./types";

const initialState: BabyState = {
  loading: false,
  progress: [],
  error: false,
};

const baby = createSlice({
  name: "baby",
  initialState,
  reducers: {
    fetchBabyRequest: (state) => {
      state.loading = true;
    },
    fetchBabySuccess: (state) => {
      state.loading = false;
      state.error = false;
    },
    setBabyProgress: (state, action: PayloadAction<Progress[]>) => {
      state.progress = action.payload;
    },
    clearBabyDataSuccess: (state) => {
      state = {} as BabyState;
    },
    fetchBabyError: (state) => {
      state.error = true;
      state.loading = false;
    },
  },
});

export const {
  fetchBabyRequest,
  fetchBabySuccess,
  fetchBabyError,
  setBabyProgress,
  clearBabyDataSuccess,
} = baby.actions;

export default baby.reducer;
