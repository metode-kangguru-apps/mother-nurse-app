import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthenticationState, Baby, Mother, Nurse } from "./types";

const initialState: AuthenticationState = {
  mother: undefined,
  user: undefined,
  nurse: undefined,
  loading: undefined,
  success: undefined,
  error: undefined,
};

const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    fetchAuthenticationRequest: (state) => {
      state.loading = true;
      state.success = undefined;
      state.error = undefined;
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
      } else {
        state.mother?.babyCollection?.push(action.payload)
      }
    },
    setNurseData: (state, action: PayloadAction<any>) => {
      // set nurse state
      state.nurse = { ...state.nurse, ...action.payload };
    },
    fetchAuthenticationSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = undefined
    },
    fetchAuthenticationError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = true;
      state.success = undefined;
      state.errorMessage = action.payload;
    },
    clearAuthenticationDataSuccess: (state) => {
      state.mother = undefined;
      state.user = undefined;
      state.nurse = undefined;
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
