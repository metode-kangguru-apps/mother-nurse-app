import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Authentication, Baby, Mother, Nurse } from "./types";

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
      state.user = { ...state.user, ...action.payload };
    },
    setMotherData: (state, action: PayloadAction<any>) => {
      // set mother state
      state.mother = { ...state.mother, ...action.payload };
    },
    updateMotherBabyCollectionData: (state, action: PayloadAction<Baby>) => {
      // update baby based on indexes
      const idx = state.mother?.babyCollection?.findIndex(
        (babyDocument) => babyDocument.id === action.payload.id
      );
      if (idx !== undefined && state.mother?.babyCollection?.[idx]) {
        state.mother.babyCollection[idx] = action.payload;
      }
    },
    setNurseData: (state, action: PayloadAction<any>) => {
      // set nurse state
      state.nurse = { ...state.nurse, ...action.payload };
    },
    fetchAuthenticationSuccess: (state) => {
      state.loading = false;
      state.error = false;
    },
    clearAuthenticationDataSuccess: (state) => {
      state.mother = undefined;
      state.user = undefined;
      state.nurse = undefined;
    },
    fetchAuthenticationError: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.loading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  setUserData,
  setMotherData,
  updateMotherBabyCollectionData,
  setNurseData,
  fetchAuthenticationRequest,
  fetchAuthenticationSuccess,
  fetchAuthenticationError,
  clearAuthenticationDataSuccess,
} = authentication.actions;

export default authentication.reducer;
