import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Authentication, Mother } from "./types";

const initialState: Authentication = {
  mother: undefined,
  user: undefined,
  nurse: undefined,
  loading: false,
  error: false,
};

const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    fetchAuthenticationRequest: (state) => {
      state.loading = true;
    },
    setUserData: (state, action: PayloadAction<any>) => {
      // set user state
      state.user = { ...state.user, ...action.payload }
    },
    setMotherData: (state, action: PayloadAction<Mother>) => {
      // set mother state
      state.mother = { ...state.mother, ...action.payload }
    },
    setNurseData: (state, action: PayloadAction<any>) => {
      // set nurse state
      state.nurse = { ...state.nurse, ...action.payload }
    },
    fetchAuthenticationSuccess: (state) => {
      state.loading = false
      state.error = false
    },
    clearAuthenticationDataSuccess: (state) => {
      state.mother = undefined
      state.user = undefined
      state.nurse = undefined
    },
    fetchAuthenticationError: (state) => {
      state.error = true
      state.loading = false
    },
  },
});

export const {
  setUserData,
  setMotherData,
  setNurseData,
  fetchAuthenticationRequest,
  fetchAuthenticationSuccess,
  fetchAuthenticationError,
  clearAuthenticationDataSuccess,
} = authentication.actions;

export default authentication.reducer;
