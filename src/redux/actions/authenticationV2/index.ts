import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserInitialState, Mother, MotherPayload, Nurse } from "./types";

const initialState: UserInitialState = {
  user: undefined,
  loading: false,
  error: false,
  message: "",
};

const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<Partial<MotherPayload | Mother> | Partial<Nurse>>
    ) => {
      state.user = { ...state.user, ...action.payload } as Mother;
    },
  },
});

export const { setUserData } = authentication.actions;

export default authentication.reducer;
