import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { InitialState, Mother, Nurse } from "./types";

const initialState: InitialState = {
  user: undefined,
  loading: false,
  error: false,
  message: "",
};

const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<Mother | Nurse>) => {
        state.user = {...state.user, ...action.payload}
    },
  },
});

export const {
    setUserData,
  } = authentication.actions;

export default authentication.reducer;
