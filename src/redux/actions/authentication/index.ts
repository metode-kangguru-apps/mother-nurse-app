import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Authetication } from "./types";

const initialState: Authetication = {
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
    fetchUserSuccess: (state, action: PayloadAction<any>) => {
      // set user state
      state.user = { ...state.user, ...action.payload };
      state.error = false;
      state.loading = false;
    },
    fetchMotherSuccess: (state, action: PayloadAction<any>) => {
      // set mother state
      state.mother = { ...state.mother, ...action.payload };
      state.error = false;
      state.loading = false;
    },
    fetchNurseSuccess: (state, action: PayloadAction<any>) => {
      // set nurse state
      state.nurse = { ...state.nurse, ...action.payload };
      state.error = false;
      state.loading = false;
    },
    clearAuthenticationDataSuccess: (state) => {
      state.mother = undefined;
      state.user = undefined;
      state.nurse = undefined;
      state.loading = false;
      state.error = false;
    },
    fetchAutheticationError: (state) => {
      state.error = true;
      state.loading = false;
    },
  },
});

export const {
  fetchAuthenticationRequest,
  fetchUserSuccess,
  fetchMotherSuccess,
  fetchNurseSuccess,
  clearAuthenticationDataSuccess,
  fetchAutheticationError,
} = authentication.actions;

export default authentication.reducer;
