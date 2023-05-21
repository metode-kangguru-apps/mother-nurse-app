import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserInitialState, Mother, MotherPayload, Nurse } from "./types";
import { Baby } from "../pmkCare/types";

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
    pushBabyToCollection: (state, action: PayloadAction<Baby>) => {
      (state.user as Mother).babyCollection.push(action.payload);
    },
  },
});

export const { setUserData, pushBabyToCollection } = authentication.actions;

export default authentication.reducer;
