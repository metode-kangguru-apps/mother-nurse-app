import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Baby, PMKCareInitialState, SelectBabyPayload } from "./types";

const initialState: PMKCareInitialState = {
  baby: {} as Baby,
  progress: [],
  sessions: [],
  loading: false,
  error: false,
  message: "",
};

const PMKCare = createSlice({
  name: "pmk-care",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state) => {
      state.error = true;
    },
    setSuccess: (state) => {
      state.loading = false;
      state.error = false;
    },
    setBabyTerapi: (state, action: PayloadAction<Baby>) => {
      state.baby = action.payload;
    },
    setBabyProgressAndSession: (
      state,
      action: PayloadAction<SelectBabyPayload>
    ) => {
      state.progress = action.payload.progress;
      state.sessions = action.payload.sessions;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  setBabyTerapi,
  setBabyProgressAndSession,
} = PMKCare.actions;

export default PMKCare.reducer;
